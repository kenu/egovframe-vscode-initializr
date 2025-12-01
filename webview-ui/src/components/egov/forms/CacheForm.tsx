import React, { useState, useEffect } from "react"
import { Button, TextField, RadioGroup, Select, Checkbox, Link } from "../../ui"
import { ConfigFormData, ConfigGenerationType, FormComponentProps } from "../types/templates"
import { vscode } from "../../../utils/vscode"

const CacheForm: React.FC<FormComponentProps> = ({ onSubmit, onCancel, template, initialData }) => {
	const [currentPage, setCurrentPage] = useState(1)
	const [formData, setFormData] = useState<ConfigFormData>({
		// 아래는 입력값들에 대한 초기값
		generationType: ConfigGenerationType.XML,
		txtFileName: "ehcache-default",
		txtDiskStore: "user.dir/second",
		txtDftMaxElements: "10000",
		txtDftEternal: "false",
		txtDftLiveTime: "120",
		txtDftOverfow: "true",
		txtDftDiskPersistence: "true",
		txtCacheName: "cache",
		txtMaxElements: "100",
		txtEternal: "false",
		txtIdleTime: "360",
		txtOverflowToDisk: "false",
		txtDiskPersistent: "false",
		...initialData,
	})
	//const [selectedOutputFolder, setSelectedOutputFolder] = useState<string | null>(null) // 지금은 없어도 됨
	const [pendingFormData, setPendingFormData] = useState<ConfigFormData | null>(null)

	const [validationError, setValidationError] = useState<string>("")

	// Message listener for folder selection response
	useEffect(() => {
		const handleMessage = (event: any) => {
			const message = event.data
			switch (message.type) {
				// Generate 버튼 클릭 - 중복 파일 검사 통과 시
				case "selectedOutputFolder":
					//setSelectedOutputFolder(message.text)
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
					console.log("CacheForm: Received selectedOutputFolderDuplicate message:", message.text)
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
			txtFileName: type === ConfigGenerationType.JAVA_CONFIG ? "EgovEhcacheDefaultConfig" : "ehcache-default",
		}))
		// 타입 변경 시 에러 클리어
		setValidationError("")
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()

		// Validate required fields
		const requiredFields: { field: keyof typeof formData; label: string }[] = [
			{ field: "generationType" as keyof typeof formData, label: "Generation Type" },
			{ field: "txtFileName" as keyof typeof formData, label: "File Name" },

			{ field: "txtDiskStore" as keyof typeof formData, label: "Disk Store Path" },

			{ field: "txtDftMaxElements" as keyof typeof formData, label: "Default Cache Max Elements" },
			{ field: "txtDftEternal" as keyof typeof formData, label: "Default Cache Eternal" },
			{ field: "txtDftLiveTime" as keyof typeof formData, label: "Default Cache Live Time" },
			{ field: "txtDftOverfow" as keyof typeof formData, label: "Default Cache Overflow to Disk" },
			{ field: "txtDftDiskPersistence" as keyof typeof formData, label: "Default Cache Disk Persistent" },
		]

		if (currentPage === 2) {
			requiredFields.push(
				{ field: "txtCacheName" as keyof typeof formData, label: "Cache Name" },
				{ field: "txtMaxElements" as keyof typeof formData, label: "Max Elements" },
				{ field: "txtEternal" as keyof typeof formData, label: "Eternal" },
				{ field: "txtIdleTime" as keyof typeof formData, label: "Idle Time" },
				{ field: "txtOverflowToDisk" as keyof typeof formData, label: "Overflow to Disk" },
				{ field: "txtDiskPersistent" as keyof typeof formData, label: "Disk Persistent" },
			)
		}

		const missingFields = requiredFields.filter(({ field }) => !formData[field]?.toString().trim())

		if (missingFields.length > 0) {
			const fieldNames = missingFields.map(({ label }) => label).join(", ")
			//alert(`Please fill in the following required fields: ${fieldNames}`)
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

		// Store form data and request folder selection
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

	const handleInputChange = (field: string, value: string | boolean) => {
		setFormData((prev) => ({ ...prev, [field]: value }))
		// 입력 시 에러 클리어
		setValidationError("")
	}

	return (
		<div style={{ padding: "20px", maxWidth: "600px" }}>
			<h2 style={{ color: "var(--vscode-foreground)", marginBottom: "20px" }}>Set Cache</h2>

			{/* Info */}
			<div
				style={{
					backgroundColor: "var(--vscode-editor-background)",
					border: "1px solid var(--vscode-panel-border)",
					borderRadius: "3px",
					padding: "15px",
					marginTop: "20px",
				}}>
				<h4 style={{ color: "var(--vscode-foreground)", marginBottom: "10px", marginTop: 0 }}>Guide:</h4>
				<div style={{ marginBottom: "10px" }}>
					<Link
						href="https://egovframework.github.io/egovframe-docs/egovframe-runtime/foundation-layer/cache/ehCache/"
						style={{ display: "inline", fontSize: "12px" }}>
						Cache Guide Here
					</Link>
				</div>
				<div style={{ fontSize: "11px", color: "var(--vscode-descriptionForeground)", marginTop: "8px" }}>
					<strong>Requirements:</strong>
					<ul style={{ margin: "5px 0", paddingLeft: "20px" }}>
						<li>Spring Framework 6.x</li>
						<li>JDK 17+</li>
						<li>Ehcache 3.10.8+ (jakarta classifier)</li>
						<li>jakarta.cache-api 3.1.1+ (JCache/JSR-107)</li>
					</ul>
				</div>
				<div style={{ fontSize: "11px", color: "var(--vscode-descriptionForeground)", marginTop: "8px" }}>
					<strong>Required Dependencies:</strong>
					<ul style={{ margin: "5px 0", paddingLeft: "20px" }}>
						<li>org.ehcache:ehcache:3.10.8:jakarta</li>
						<li>jakarta.cache:jakarta.cache-api:3.1.1</li>
						<li>spring-context-support</li>
					</ul>
				</div>
			</div>

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
				{currentPage === 1 && (
					<div>
						<div style={{ marginBottom: "20px" }}>
							<h3 style={{ color: "var(--vscode-foreground)", marginBottom: "10px" }}>Generation File</h3>

							{/* XML 설정만 제공(JavaConfig 미사용)
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
							*/}

							<div style={{ width: "calc(100% - 24px)", marginBottom: "20px" }}>
								<TextField
									label="File Name"
									value={formData.txtFileName}
									onChange={(e) => handleInputChange("txtFileName", e.target.value)}
									placeholder="Enter file name"
									isRequired
								/>
								<div style={{ fontSize: "10px", color: "var(--vscode-descriptionForeground)", marginTop: "2px" }}>
									Ehcache 3.x XML 설정 파일 이름 (예: ehcache-default.xml)
								</div>
							</div>
						</div>

						<div style={{ marginBottom: "20px" }}>
							<h3 style={{ color: "var(--vscode-foreground)", marginBottom: "10px" }}>Disk Store</h3>

							<div style={{ width: "calc(100% - 24px)", marginBottom: "15px" }}>
								<TextField
									label="Disk Store Path"
									value={formData.txtDiskStore}
									onChange={(e) => handleInputChange("txtDiskStore", e.target.value)}
									placeholder="Enter disk store path"
									isRequired
								/>
								<div style={{ fontSize: "10px", color: "var(--vscode-descriptionForeground)", marginTop: "2px" }}>
									디스크 캐시를 저장할 경로 (예: user.dir/second 또는 /tmp/cache)
								</div>
							</div>
						</div>

						<div style={{ marginBottom: "20px" }}>
							<h3 style={{ color: "var(--vscode-foreground)", marginBottom: "10px" }}>Set Default Cache</h3>
							<div style={{ fontSize: "11px", color: "var(--vscode-descriptionForeground)", marginBottom: "10px" }}>
								모든 캐시에 기본적으로 적용될 설정입니다.
							</div>

							<div style={{ width: "calc(100% - 24px)", marginBottom: "15px" }}>
								<TextField
									label="Default Cache Max Elements"
									value={formData.txtDftMaxElements}
									onChange={(e) => handleInputChange("txtDftMaxElements", e.target.value)}
									placeholder="Enter default cache max elements"
									isRequired
								/>
								<div style={{ fontSize: "10px", color: "var(--vscode-descriptionForeground)", marginTop: "2px" }}>
									힙 메모리에 저장할 최대 엔트리 수
								</div>
							</div>

							{/* 업데이트 전 Select 코드
							<div style={{ marginBottom: "15px" }}>
								<label style={{ display: "block", marginBottom: "5px", color: "var(--vscode-foreground)" }}>
									 Cache Eternal <span style={{ color: "var(--vscode-errorForeground)" }}>*</span>
								</label>
								<Select options={[]} />
							</div>
							*/}

							{/* 업데이트 후 Select 코드 */}
							<div style={{ marginBottom: "15px" }}>
								<Select
									label="Default Cache Eternal"
									options={[
										{ value: "true", label: "True" },
										{ value: "false", label: "False" },
									]}
									value={formData.txtDftEternal}
									onChange={(e) => handleInputChange("txtDftEternal", e.target.value)}
									isRequired
								/>
								<div style={{ fontSize: "10px", color: "var(--vscode-descriptionForeground)", marginTop: "2px" }}>
									True: 만료되지 않음, False: TTL/TTI 적용
								</div>
							</div>

							<div style={{ width: "calc(100% - 24px)", marginBottom: "15px" }}>
								<TextField
									label="Default Cache Live Time (sec)"
									value={formData.txtDftLiveTime}
									onChange={(e) => handleInputChange("txtDftLiveTime", e.target.value)}
									placeholder="Enter default cache live time (sec)"
									isRequired
								/>
								<div style={{ fontSize: "10px", color: "var(--vscode-descriptionForeground)", marginTop: "2px" }}>
									TTL (Time To Live): 생성 후 만료 시간 (초)
								</div>
							</div>

							<div style={{ marginBottom: "15px" }}>
								<Select
									label="Default Cache Overflow to Disk"
									options={[
										{ value: "true", label: "True" },
										{ value: "false", label: "False" },
									]}
									value={formData.txtDftOverfow}
									onChange={(e) => handleInputChange("txtDftOverfow", e.target.value)}
									isRequired
								/>
								<div style={{ fontSize: "10px", color: "var(--vscode-descriptionForeground)", marginTop: "2px" }}>
									힙 메모리가 가득 차면 디스크에 저장 (Ehcache 3.x: disk tier 사용)
								</div>
							</div>

							<div style={{ marginBottom: "20px" }}>
								<Select
									label="Default Cache Disk Persistent"
									options={[
										{ value: "true", label: "True" },
										{ value: "false", label: "False" },
									]}
									value={formData.txtDftDiskPersistence}
									onChange={(e) => handleInputChange("txtDftDiskPersistence", e.target.value)}
									isRequired
								/>
								<div style={{ fontSize: "10px", color: "var(--vscode-descriptionForeground)", marginTop: "2px" }}>
									JVM 재시작 시 디스크 캐시 유지 여부
								</div>
							</div>
						</div>

						<div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
							<Button variant="secondary" onClick={onCancel}>
								Cancel
							</Button>
							<Button onClick={() => setCurrentPage(2)}>Next</Button>
						</div>
					</div>
				)}

				{currentPage === 2 && (
					<div>
						<div style={{ marginBottom: "20px" }}>
							<h3 style={{ color: "var(--vscode-foreground)", marginBottom: "10px" }}>Set Custom Cache</h3>
							<div style={{ fontSize: "11px", color: "var(--vscode-descriptionForeground)", marginBottom: "10px" }}>
								특정 용도에 맞는 커스텀 캐시 설정입니다.
							</div>

							<div style={{ width: "calc(100% - 24px)", marginBottom: "15px" }}>
								<TextField
									label="Cache Name"
									value={formData.txtCacheName}
									onChange={(e) => handleInputChange("txtCacheName", e.target.value)}
									placeholder="Enter cache name"
									isRequired
								/>
								<div style={{ fontSize: "10px", color: "var(--vscode-descriptionForeground)", marginTop: "2px" }}>
									애플리케이션에서 사용할 캐시 이름 (예: userCache, productCache)
								</div>
							</div>

							<div style={{ width: "calc(100% - 24px)", marginBottom: "15px" }}>
								<TextField
									label="Max Elements"
									value={formData.txtMaxElements}
									onChange={(e) => handleInputChange("txtMaxElements", e.target.value)}
									placeholder="Enter max elements"
									isRequired
								/>
							</div>

							<div style={{ marginBottom: "15px" }}>
								<Select
									label="Eternal"
									options={[
										{ value: "true", label: "True" },
										{ value: "false", label: "False" },
									]}
									value={formData.txtEternal}
									onChange={(e) => handleInputChange("txtEternal", e.target.value)}
									isRequired
								/>
							</div>

							<div style={{ width: "calc(100% - 24px)", marginBottom: "15px" }}>
								<TextField
									label="Idle Time (sec)"
									value={formData.txtIdleTime}
									onChange={(e) => handleInputChange("txtIdleTime", e.target.value)}
									placeholder="Enter idle time (sec)"
									isRequired
								/>
								<div style={{ fontSize: "10px", color: "var(--vscode-descriptionForeground)", marginTop: "2px" }}>
									TTI (Time To Idle): 마지막 접근 후 만료 시간 (초)
								</div>
							</div>

							<div style={{ marginBottom: "15px" }}>
								<Select
									label="Overflow to Disk"
									options={[
										{ value: "true", label: "True" },
										{ value: "false", label: "False" },
									]}
									value={formData.txtOverflowToDisk}
									onChange={(e) => handleInputChange("txtOverflowToDisk", e.target.value)}
									isRequired
								/>
							</div>

							<div style={{ marginBottom: "20px" }}>
								<Select
									label="Disk Persistent"
									options={[
										{ value: "true", label: "True" },
										{ value: "false", label: "False" },
									]}
									value={formData.txtDiskPersistent}
									onChange={(e) => handleInputChange("txtDiskPersistent", e.target.value)}
									isRequired
								/>
								<div style={{ fontSize: "10px", color: "var(--vscode-descriptionForeground)", marginTop: "2px" }}>
									JVM 재시작 시 디스크 캐시 유지 여부
								</div>
							</div>
						</div>

						<div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
							<Button variant="secondary" onClick={() => setCurrentPage(1)}>
								Previous
							</Button>
							<Button variant="secondary" onClick={onCancel}>
								Cancel
							</Button>
							<Button type="submit" variant="primary">
								Generate
							</Button>
						</div>
					</div>
				)}
			</form>
		</div>
	)
}

export default CacheForm
