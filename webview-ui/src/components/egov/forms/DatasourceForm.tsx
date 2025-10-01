import { useState, useEffect } from "react"
import { Button, TextField, Select, RadioGroup } from "../../ui"
import { ConfigGenerationType, ConfigFormData, FormComponentProps } from "../types/templates"
import { vscode } from "../../../utils/vscode"

const DatasourceForm: React.FC<FormComponentProps> = ({ onSubmit, onCancel, template, initialData }) => {
	const [formData, setFormData] = useState({
		generationType: ConfigGenerationType.XML,
		txtConfigPackage: "",
		txtFileName: "context-datasource",
		txtDatasourceName: "dataSource",
		rdoType: "DBCP",
		txtDriver: "",
		txtUrl: "",
		txtUser: "",
		txtPasswd: "",
		...initialData,
	})
	const [pendingFormData, setPendingFormData] = useState<ConfigFormData | null>(null)

	const [validationError, setValidationError] = useState<string>("")

	// Message listener for folder selection response
	useEffect(() => {
		const handleMessage = (event: any) => {
			const message = event.data
			switch (message.type) {
				// Generate 버튼 클릭 - 중복 파일 검사 통과 시
				case "selectedOutputFolder":
					if (pendingFormData) {
						onSubmit({
							...pendingFormData,
							outputFolder: message.text,
						})
						setPendingFormData(null)
					}
					break

				// Generate 버튼 클릭 - 중복 파일 검사 실패 시
				case "selectedOutputFolderDuplicate":
					console.log("DatasourceForm: Received selectedOutputFolderDuplicate message:", message.text)
					setValidationError(message.text) // Duplicate file exists: + formData.txtFileName
					break
			}
		}

		window.addEventListener("message", handleMessage)
		return () => {
			window.removeEventListener("message", handleMessage)
		}
	}, [pendingFormData, onSubmit])

	const handleGenerationTypeChange = (type: ConfigGenerationType) => {
		setFormData((prev) => ({
			...prev,
			generationType: type,
			txtFileName: type === ConfigGenerationType.JAVA_CONFIG ? "EgovDataSourceConfig" : "context-datasource",
		}))
		// 타입 변경 시 에러 클리어
		setValidationError("")
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()

		// Validate required fields
		const requiredFields: { field: keyof typeof formData; label: string }[] = [
			{ field: "generationType" as keyof typeof formData, label: "Generation Type" },
			{ field: "txtDatasourceName" as keyof typeof formData, label: "DataSource Name" },
			{ field: "rdoType" as keyof typeof formData, label: "Driver Type" },
			{ field: "txtDriver" as keyof typeof formData, label: "Driver" },
			{ field: "txtUrl" as keyof typeof formData, label: "URL" },
			{ field: "txtUser" as keyof typeof formData, label: "User" },
		]

		// 조건부로 txtFileName, txtConfigPackage 필드 추가
		if (formData.generationType === ConfigGenerationType.JAVA_CONFIG) {
			requiredFields.push(
				{ field: "txtFileName" as keyof typeof formData, label: "Class Name" },
				{ field: "txtConfigPackage" as keyof typeof formData, label: "Package Name" },
			)
		} else {
			requiredFields.push({ field: "txtFileName" as keyof typeof formData, label: "File Name" })
		}

		const missingFields = requiredFields.filter(({ field }) => !formData[field]?.toString().trim())

		if (missingFields.length > 0) {
			const fieldNames = missingFields.map(({ label }) => label).join(", ")
			setValidationError(`Please fill in the following required fields: ${fieldNames}`)
			return
		}

		// 성공 시 에러 클리어
		setValidationError("")

		// Check if vscode API is available
		if (!vscode) {
			console.error("VSCode API is not available")
			return
		}

		setPendingFormData(formData)

		try {
			vscode.postMessage({
				type: "selectOutputFolder",
				formData: formData, // formData를 전달하여 파일명 중복 검사
			})
		} catch (error) {
			console.error("Error sending message:", error)
		}
	}

	const handleInputChange = (field: string, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }))
		// 입력 시 에러 클리어
		setValidationError("")
	}

	return (
		<div style={{ padding: "20px", maxWidth: "600px" }}>
			<h2 style={{ color: "var(--vscode-foreground)", marginBottom: "20px" }}>Create DataSource</h2>

			{/* Validation Errors */}
			{validationError && (
				<div style={{ marginBottom: "20px" }}>
					<div
						style={{
							backgroundColor: "var(--vscode-inputValidation-errorBackground)",
							border: "1px solid var(--vscode-inputValidation-errorBorder)",
							color: "var(--vscode-inputValidation-errorForeground)",
							padding: "10px",
							borderRadius: "3px",
							fontWeight: "bold",
							fontSize: "12px",
						}}>
						{validationError}
					</div>
				</div>
			)}

			<form onSubmit={handleSubmit}>
				<div style={{ marginBottom: "20px" }}>
					<RadioGroup
						label="Generation Type"
						name="generationType"
						value={formData.generationType}
						onChange={(value) => handleGenerationTypeChange(value as ConfigGenerationType)}
						orientation="horizontal"
						options={[
							{ value: ConfigGenerationType.XML, label: "XML" },
							{ value: ConfigGenerationType.JAVA_CONFIG, label: "JavaConfig" },
						]}
					/>
				</div>

				{formData.generationType === ConfigGenerationType.JAVA_CONFIG && (
					<div style={{ width: "calc(100% - 24px)", marginBottom: "20px" }}>
						<TextField
							label="Package Name"
							value={formData.txtConfigPackage}
							onChange={(e) => handleInputChange("txtConfigPackage", e.target.value)}
							placeholder="Enter package name"
							isRequired
						/>
					</div>
				)}

				<div style={{ width: "calc(100% - 24px)", marginBottom: "20px" }}>
					<TextField
						label={formData.generationType === ConfigGenerationType.JAVA_CONFIG ? "Class Name" : "File Name"}
						value={formData.txtFileName}
						onChange={(e) => handleInputChange("txtFileName", e.target.value)}
						placeholder={
							formData.generationType === ConfigGenerationType.JAVA_CONFIG
								? "Enter class name (PascalCase)"
								: "Enter file name"
						}
						isRequired
					/>
				</div>

				<div style={{ marginBottom: "20px" }}>
					<h3 style={{ color: "var(--vscode-foreground)", marginBottom: "10px" }}>Configuration</h3>

					<div style={{ width: "calc(100% - 24px)", marginBottom: "15px" }}>
						<TextField
							label="DataSource Name"
							value={formData.txtDatasourceName}
							placeholder="Enter datasource name"
							onChange={(e) => handleInputChange("txtDatasourceName", e.target.value)}
							isRequired
						/>
					</div>

					<div style={{ marginBottom: "15px" }}>
						<Select
							label="Driver Type"
							value={formData.rdoType}
							onChange={(e) => handleInputChange("rdoType", e.target.value)}
							isRequired
							options={[
								{ value: "DBCP", label: "DBCP" },
								{ value: "C3P0", label: "C3P0" },
								{ value: "JDBC", label: "JDBC" },
							]}
						/>
					</div>

					<div style={{ width: "calc(100% - 24px)", marginBottom: "15px" }}>
						<TextField
							label="Driver"
							value={formData.txtDriver}
							placeholder="Enter driver class name"
							onChange={(e) => handleInputChange("txtDriver", e.target.value)}
							isRequired
						/>
					</div>

					<div style={{ width: "calc(100% - 24px)", marginBottom: "15px" }}>
						<TextField
							label="URL"
							value={formData.txtUrl}
							placeholder="Enter database URL"
							onChange={(e) => handleInputChange("txtUrl", e.target.value)}
							isRequired
						/>
					</div>

					<div style={{ width: "calc(100% - 24px)", marginBottom: "15px" }}>
						<TextField
							label="User"
							value={formData.txtUser}
							placeholder="Enter username"
							onChange={(e) => handleInputChange("txtUser", e.target.value)}
							isRequired
						/>
					</div>

					<div style={{ width: "calc(100% - 24px)", marginBottom: "20px" }}>
						<TextField
							label="Password"
							type="password"
							value={formData.txtPasswd}
							placeholder="Enter password"
							onChange={(e) => handleInputChange("txtPasswd", e.target.value)}
						/>
					</div>
				</div>

				<div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
					<Button variant="secondary" onClick={onCancel}>
						Cancel
					</Button>
					<Button type="submit" variant="primary">
						Generate
					</Button>
				</div>
			</form>
		</div>
	)
}

export default DatasourceForm
