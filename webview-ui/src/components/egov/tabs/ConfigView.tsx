import React, { useState, useEffect } from "react"
import { Button, TextField, TextArea, Select, RadioGroup, ProgressRing, Link, Divider } from "../../ui"
import { TemplateConfig, GroupedTemplates, ConfigFormData } from "../types/templates"
import { loadTemplates } from "../utils/templateUtils"
import FormFactory from "../forms/FormFactory"
import { vscode } from "../../../utils/vscode"

const ConfigView: React.FC = () => {
	const [templates, setTemplates] = useState<TemplateConfig[]>([])
	const [groupedTemplates, setGroupedTemplates] = useState<GroupedTemplates>({})
	const [selectedCategory, setSelectedCategory] = useState<string>("")
	const [selectedSubcategory, setSelectedSubcategory] = useState<string>("")
	const [selectedTemplate, setSelectedTemplate] = useState<TemplateConfig | null>(null)
	const [currentView, setCurrentView] = useState<"list" | "form">("list")
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const initializeTemplates = () => {
			try {
				setLoading(true)

				// 정적 템플릿 데이터 로드
				const loadedTemplates = loadTemplates()
				console.log("Loaded templates:", loadedTemplates)
				setTemplates(loadedTemplates)

				// 템플릿을 카테고리별로 그룹화 (Cache, Datasource, Transaction, ID Generation, Property, Scheduling, Logging)
				const grouped: GroupedTemplates = {}
				loadedTemplates.forEach((template) => {
					const [category, subcategory] = template.displayName.split(" > ")
					if (category && subcategory) {
						if (!grouped[category]) {
							grouped[category] = {}
						}
						grouped[category][subcategory] = template
					}
				})

				console.log("Grouped templates:", grouped)

				// groupedTemplates에 그룹화된 템플릿 설정 set
				setGroupedTemplates(grouped)
				setError(null)
			} catch (err) {
				console.error("Failed to load templates:", err)
				setError("Failed to load templates. Please try again.")
			} finally {
				setLoading(false)
			}
		}

		initializeTemplates()
	}, [])

	// 1. 사용자가 카테고리(select category)를 선택했을 때
	const handleCategoryChange = (category: string) => {
		console.log("Category selected:", category)
		setSelectedCategory(category)
		setSelectedSubcategory("")
		setSelectedTemplate(null)
	}

	// 2. 사용자가 서브 카테고리(select configuration type), 즉 특정 특정 템플릿을 선택했을 때 => 선택한 서브 카테고리에 해당하는 템플릿 설정
	const handleSubcategoryChange = (subcategory: string) => {
		console.log("Subcategory selected:", subcategory)
		setSelectedSubcategory(subcategory)

		if (selectedCategory && subcategory && groupedTemplates[selectedCategory]) {
			const template = groupedTemplates[selectedCategory][subcategory]
			if (template) {
				setSelectedTemplate(template)
				console.log("Template selected:", template)
			}
		}
	}

	// 3-1. 사용자가 특정 템플릿의 설정(configure) 버튼을 클릭했을 때 => 선택한 템플릿의 설정 폼을 열기(= setCurrentView("form")) => 3-2
	const handleConfigureClick = () => {
		if (selectedTemplate) {
			console.log("Opening form for template:", selectedTemplate)
			setCurrentView("form")
		}
	}

	// 4. 사용자가 특정 템플릿의 설정 폼을 제출했을 때 => 선택한 템플릿의 설정 폼을 Extension으로 보내기
	const handleFormSubmit = (formData: ConfigFormData) => {
		console.log("Form submitted with data:", formData)
		console.log("Selected template:", selectedTemplate)

		if (!selectedTemplate) {
			console.error("No template selected")
			return
		}

		// Post message to generate config
		try {
			vscode.postMessage({
				type: "generateConfig",
				template: selectedTemplate,
				formData: formData,
			})
		} catch (error) {
			console.error("Error sending message:", error)
		}

		// Return to list view
		setCurrentView("list")
	}

	const handleFormCancel = () => {
		console.log("Form cancelled")
		setCurrentView("list")
	}

	// 3-2. 사용자가 특정 템플릿의 설정(configure) 버튼을 클릭했을 때 => 선택한 템플릿의 설정 폼을 열기(동적 폼 렌더링) - FormFactory 컴포넌트 반환
	if (currentView === "form" && selectedTemplate) {
		return <FormFactory template={selectedTemplate} onSubmit={handleFormSubmit} onCancel={handleFormCancel} />
	}

	// 로딩 중일 때
	if (loading) {
		return (
			<div style={{ padding: "20px", textAlign: "center" }}>
				<p style={{ color: "var(--vscode-foreground)" }}>Loading templates...</p>
			</div>
		)
	}

	// 로딩 중 에러가 발생했을 때
	if (error) {
		return (
			<div style={{ padding: "20px", textAlign: "center" }}>
				<p style={{ color: "var(--vscode-errorForeground)" }}>{error}</p>
				<Button onClick={() => window.location.reload()}>Retry</Button>
			</div>
		)
	}

	const categories = Object.keys(groupedTemplates)
	const subcategories = selectedCategory ? Object.keys(groupedTemplates[selectedCategory] || {}) : []

	return (
		<div style={{ padding: "20px", maxWidth: "800px" }}>
			{/* Header */}
			<div style={{ marginBottom: "20px" }}>
				<h3 style={{ color: "var(--vscode-foreground)", marginTop: 0, marginBottom: "8px" }}>
					Generate eGovFrame Configurations
				</h3>
				<p
					style={{
						fontSize: "12px",
						color: "var(--vscode-descriptionForeground)",
						margin: 0,
						marginTop: "5px",
					}}>
					Generate configuration files for eGovFrame projects. Learn more at{" "}
					<Link
						href="https://github.com/eGovFramework/egovframe-vscode-initializr"
						style={{ display: "inline", fontSize: "12px" }}>
						GitHub
					</Link>
				</p>
			</div>

			<div style={{ marginBottom: "20px" }}>
				<div style={{ marginBottom: "15px" }}>
					<label style={{ display: "block", marginBottom: "5px", color: "var(--vscode-foreground)" }}>
						Select Category
					</label>
					<select
						value={selectedCategory}
						onChange={(e) => handleCategoryChange(e.target.value)}
						style={{
							width: "100%",
							padding: "8px 12px",
							backgroundColor: "var(--vscode-input-background)",
							color: "var(--vscode-input-foreground)",
							border: "1px solid var(--vscode-input-border)",
							borderRadius: "4px",
							fontSize: "13px",
							fontFamily: "inherit",
							outline: "none",
							appearance: "none",
							WebkitAppearance: "none",
							MozAppearance: "none",
						}}
						onFocus={(e) => {
							;(e.target as HTMLSelectElement).style.borderColor = "var(--vscode-focusBorder)"
						}}
						onBlur={(e) => {
							;(e.target as HTMLSelectElement).style.borderColor = "var(--vscode-input-border)"
						}}>
						<option value="">Choose a category...</option>
						{categories.map((category) => (
							<option key={category} value={category}>
								{category}
							</option>
						))}
					</select>
				</div>

				{selectedCategory && (
					<div style={{ marginBottom: "15px" }}>
						<label style={{ display: "block", marginBottom: "5px", color: "var(--vscode-foreground)" }}>
							Select Configuration Type
						</label>
						<select
							value={selectedSubcategory}
							onChange={(e) => handleSubcategoryChange(e.target.value)}
							style={{
								width: "100%",
								padding: "8px 12px",
								backgroundColor: "var(--vscode-input-background)",
								color: "var(--vscode-input-foreground)",
								border: "1px solid var(--vscode-input-border)",
								borderRadius: "4px",
								fontSize: "13px",
								fontFamily: "inherit",
								outline: "none",
								appearance: "none",
								WebkitAppearance: "none",
								MozAppearance: "none",
							}}
							onFocus={(e) => {
								;(e.target as HTMLSelectElement).style.borderColor = "var(--vscode-focusBorder)"
							}}
							onBlur={(e) => {
								;(e.target as HTMLSelectElement).style.borderColor = "var(--vscode-input-border)"
							}}>
							<option value="">Choose a configuration type...</option>
							{subcategories.map((subcategory) => (
								<option key={subcategory} value={subcategory}>
									{subcategory}
								</option>
							))}
						</select>
					</div>
				)}

				{selectedTemplate && (
					<div style={{ marginTop: "20px" }}>
						<Divider />
						<div
							style={{
								marginTop: "20px",
								padding: "15px",
								border: "1px solid var(--vscode-panel-border)",
								borderRadius: "4px",
							}}>
							<h3 style={{ color: "var(--vscode-foreground)", marginBottom: "10px" }}>Selected Configuration</h3>
							<p style={{ color: "var(--vscode-foreground)", marginBottom: "15px" }}>
								<strong>Name:</strong> {selectedTemplate.displayName}
							</p>
							<p style={{ color: "var(--vscode-foreground)", marginBottom: "15px" }}>
								<strong>Template:</strong> {selectedTemplate.templateFile}
							</p>
							<p style={{ color: "var(--vscode-foreground)", marginBottom: "15px" }}>
								<strong>Folder:</strong> {selectedTemplate.templateFolder}
							</p>
							<Button onClick={handleConfigureClick} variant="primary">
								Configure
							</Button>
						</div>
					</div>
				)}
			</div>

			{templates.length === 0 && !loading && (
				<div style={{ textAlign: "center", padding: "40px" }}>
					<p style={{ color: "var(--vscode-foreground)" }}>No templates available</p>
				</div>
			)}
		</div>
	)
}

export default ConfigView
