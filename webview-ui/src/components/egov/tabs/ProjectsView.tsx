import { useState, useEffect } from "react"
import { Button, TextField, TextArea, Select, RadioGroup, ProgressRing, Link, Divider } from "../../ui"
import { vscode } from "../../../utils/vscode"
import {
	ProjectTemplate,
	ProjectConfig,
	PROJECT_TEMPLATES,
	PROJECT_CATEGORIES,
	getTemplatesByCategory,
	validateProjectConfig,
	getDefaultGroupId,
	generateSampleProjectName,
} from "../../../utils/projectUtils"
import {
	createProjectGenerationMessage,
	createSelectOutputPathMessage,
	createGenerateProjectByCommandMessage,
	validateFileSystemPath,
} from "../../../utils/egovUtils"
import { useProjectsViewState } from "../../../context/EgovTabsStateContext"

export const ProjectsView = () => {
	const { state, updateState } = useProjectsViewState()
	const { selectedCategory, outputPath, packageName, groupId, artifactId, version, description, generationMode } = state

	// Map groupId to groupID for compatibility
	const groupID = groupId
	const setGroupID = (value: string) => updateState({ groupId: value })

	// Get selectedTemplate from state
	const { selectedTemplate } = state

	// Local states that don't need persistence
	const [validationErrors, setValidationErrors] = useState<string[]>([])
	const [isGenerating, setIsGenerating] = useState<boolean>(false)
	const [generationStatus, setGenerationStatus] = useState<string>("")

	// Extract projectName from artifactId for compatibility
	const projectName = artifactId
	const setProjectName = (value: string) => updateState({ artifactId: value })

	// Map generationMethod to generationMode
	const generationMethod = generationMode
	const setGenerationMethod = (value: "form" | "command") => updateState({ generationMode: value })

	// Helper functions
	const setSelectedCategory = (value: string) => updateState({ selectedCategory: value })
	const setSelectedTemplate = (template: ProjectTemplate | null) => updateState({ selectedTemplate: template })
	const setOutputPath = (value: string) => updateState({ outputPath: value })

	// 카테고리에 해당하는 템플릿 배열
	const filteredTemplates = getTemplatesByCategory(selectedCategory)

	// Sample 버튼(handleInsertSample)을 위해 초기 출력 경로 설정
	const [initialPath, setInitialPath] = useState("")

	useEffect(() => {
		// Initialize with sample project name
		setProjectName(generateSampleProjectName())

		// Request current workspace path when component mounts
		vscode.postMessage({ type: "getWorkspacePath" })

		// Listen for messages from extension
		const handleMessage = (event: MessageEvent) => {
			const message = event.data
			switch (message.type) {
				case "selectedOutputPath":
					if (message.text) {
						setOutputPath(message.text)
					}
					break
				case "currentWorkspacePath":
					// Set workspace path as default output path
					if (message.text) {
						setOutputPath(message.text)
						setInitialPath(message.text) // useState로 관리, Sample 버튼(handleInsertSample)을 위해 초기 출력 경로 설정
					}
					break
				case "projectGenerationResult":
					setIsGenerating(false)
					if (message.success) {
						setGenerationStatus(`✅ Project generated successfully at: ${message.projectPath}`)
						// Reset form
						setSelectedTemplate(null)
						setProjectName(generateSampleProjectName())
						setValidationErrors([])
					} else {
						setGenerationStatus(`❌ Generation failed: ${message.error}`)
					}
					break
				case "projectGenerationProgress":
					setGenerationStatus(message.text || "")
					break
			}
		}

		window.addEventListener("message", handleMessage)
		return () => window.removeEventListener("message", handleMessage)
	}, [])

	const handleCategoryChange = (event: any) => {
		const category = event.target.value
		setSelectedCategory(category)
		setSelectedTemplate(null) // Reset template selection when category changes
		setGenerationStatus("") // Clear previous status
	}

	const handleTemplateSelect = (template: ProjectTemplate) => {
		setSelectedTemplate(template)
		setValidationErrors([]) // Clear previous errors
		setGenerationStatus("") // Clear previous status

		// Insert Sample 기능을 템플릿 선택 시 자동 실행
		handleInsertSample()
	}

	const handleSelectOutputPath = () => {
		vscode.postMessage(createSelectOutputPathMessage())
	}

	const validateForm = (): boolean => {
		if (!selectedTemplate) {
			setValidationErrors(["Please select a project template"])
			return false
		}

		const config: Partial<ProjectConfig> = {
			projectName,
			groupID,
			outputPath,
			template: selectedTemplate,
		}

		const errors = validateProjectConfig(config)

		// Additional file system validation
		if (projectName && !validateFileSystemPath(projectName)) {
			errors.push("Project name contains invalid characters for file system")
		}

		setValidationErrors(errors)
		return errors.length === 0
	}

	const handleGenerateProject = async () => {
		if (!validateForm()) {
			return
		}

		setIsGenerating(true)
		setGenerationStatus("🚀 Starting project generation...")

		try {
			const config: ProjectConfig = {
				projectName,
				groupID,
				outputPath,
				template: selectedTemplate!,
			}

			// Send message to extension for actual project generation
			const message = createProjectGenerationMessage(config, generationMethod)
			vscode.postMessage(message)
		} catch (error) {
			console.error("Error generating project:", error)
			setIsGenerating(false)
			setGenerationStatus(`❌ Error: ${error}`)
		}
	}

	const handleGenerateByCommand = () => {
		vscode.postMessage(createGenerateProjectByCommandMessage())
	}

	const handleInsertSample = () => {
		if (PROJECT_TEMPLATES.length > 0) {
			if (!selectedCategory || selectedCategory === "All") {
				// 카테고리가 선택되지 않거나 All인 경우
				setSelectedCategory(PROJECT_TEMPLATES[0].category || "Web")
				setSelectedTemplate(PROJECT_TEMPLATES[0])
			} else if (!selectedTemplate) {
				// 카테고리는 선택되었는데 템플릿은 선택되지 않은 경우
				setSelectedTemplate(filteredTemplates[0])
			}
		}
		setProjectName(generateSampleProjectName())
		setGroupID(getDefaultGroupId())
		setOutputPath(initialPath)
		setGenerationStatus("") // Clear previous status
	}

	const handleProjectNameChange = (event: any) => {
		setGenerationStatus("") // Clear previous status

		const value = event.target.value
		setProjectName(value)

		// Real-time validation for project name
		if (value && !validateFileSystemPath(value)) {
			setValidationErrors(["Project name contains invalid characters"])
		} else {
			setValidationErrors([])
		}
	}

	return (
		<div style={{ padding: "20px" }}>
			{/* Header */}
			<div style={{ marginBottom: "20px" }}>
				<h3 style={{ color: "var(--vscode-foreground)", marginTop: 0, marginBottom: "8px" }}>
					Generate eGovFrame Projects
				</h3>
				<p
					style={{
						fontSize: "12px",
						color: "var(--vscode-descriptionForeground)",
						margin: 0,
						marginTop: "5px",
					}}>
					Generate new eGovFrame projects from predefined templates. Choose from various project templates including
					basic Spring applications, web applications, and more. Learn more at{" "}
					<Link href="https://github.com/eGovFramework/egovframe-vscode-initializr" style={{ display: "inline" }}>
						GitHub
					</Link>
				</p>
			</div>

			{/* Generation Status */}
			{generationStatus && (
				<div style={{ marginBottom: "20px" }}>
					<div
						style={{
							backgroundColor: generationStatus.startsWith("❌")
								? "var(--vscode-inputValidation-errorBackground)"
								: generationStatus.startsWith("✅")
									? "var(--vscode-inputValidation-infoBackground)"
									: "var(--vscode-inputValidation-warningBackground)",
							border: `1px solid ${
								generationStatus.startsWith("❌")
									? "var(--vscode-inputValidation-errorBorder)"
									: generationStatus.startsWith("✅")
										? "var(--vscode-inputValidation-infoBorder)"
										: "var(--vscode-inputValidation-warningBorder)"
							}`,
							color: generationStatus.startsWith("❌")
								? "var(--vscode-inputValidation-errorForeground)"
								: generationStatus.startsWith("✅")
									? "var(--vscode-inputValidation-infoForeground)"
									: "var(--vscode-inputValidation-warningForeground)",
							padding: "10px",
							borderRadius: "3px",
							fontSize: "12px",
						}}>
						{generationStatus}
					</div>
				</div>
			)}

			{/* Generation Method Selection - Hide 처리 - Command-based Generation 제외 목적 */}
			<div style={{ display: "none", marginBottom: "20px" }}>
				<h4 style={{ color: "var(--vscode-foreground)", marginBottom: "10px", marginTop: 0 }}>Generation Method</h4>
				<RadioGroup
					name="generationMethod"
					value={generationMethod}
					onChange={(value: string) => setGenerationMethod(value as "form" | "command")}
					options={[
						{ value: "form", label: "Form-based Generation (Recommended)" },
						{ value: "command", label: "Command-based Generation" },
					]}
				/>
			</div>

			{generationMethod === "command" ? (
				/* Command-based Generation */
				<div>
					<div style={{ marginBottom: "20px" }}>
						<h4 style={{ color: "var(--vscode-foreground)", marginBottom: "10px", marginTop: 0 }}>
							Interactive Project Generation
						</h4>
						<p style={{ fontSize: "12px", color: "var(--vscode-descriptionForeground)", marginBottom: "15px" }}>
							Follow step-by-step prompts to generate your eGovFrame project. This mode provides guided assistance
							and validation at each step.
						</p>

						<div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
							<button
								style={{
									backgroundColor: "var(--vscode-button-background)",
									color: "var(--vscode-button-foreground)",
									border: "1px solid var(--vscode-button-border)",
									borderRadius: "4px",
									padding: "8px 12px",
									cursor: "pointer",
									display: "inline-flex",
									alignItems: "center",
									fontSize: "13px",
									fontFamily: "inherit",
									outline: "none",
								}}
								onMouseOver={(e) => {
									;(e.target as HTMLButtonElement).style.backgroundColor =
										"var(--vscode-button-hoverBackground)"
								}}
								onMouseOut={(e) => {
									;(e.target as HTMLButtonElement).style.backgroundColor = "var(--vscode-button-background)"
								}}
								onFocus={(e) => {
									;(e.target as HTMLButtonElement).style.outline = "1px solid var(--vscode-focusBorder)"
								}}
								onBlur={(e) => {
									;(e.target as HTMLButtonElement).style.outline = "none"
								}}
								onClick={handleGenerateByCommand}>
								<span className="codicon codicon-debug-step-over" style={{ marginRight: "6px" }}></span>
								Start Interactive Generation
							</button>
						</div>

						<div
							style={{
								backgroundColor: "var(--vscode-textBlockQuote-background)",
								border: "1px solid var(--vscode-textBlockQuote-border)",
								borderRadius: "3px",
								padding: "12px",
								marginTop: "15px",
								fontSize: "12px",
							}}>
							<div style={{ fontWeight: "bold", marginBottom: "8px" }}>Interactive Generation Features:</div>
							<ul style={{ margin: 0, paddingLeft: "20px" }}>
								<li>Step-by-step category and template selection</li>
								<li>Real-time validation and suggestions</li>
								<li>Workspace integration and path recommendations</li>
								<li>Preview generated project structure</li>
								<li>Rollback capability if generation fails</li>
							</ul>
						</div>
					</div>
				</div>
			) : (
				/* Form-based Generation */
				<div>
					{/* Template Category Selection */}
					<div style={{ marginBottom: "20px" }}>
						<h4 style={{ color: "var(--vscode-foreground)", marginBottom: "10px", marginTop: 0 }}>
							Template Category
						</h4>
						<select
							value={selectedCategory}
							onChange={handleCategoryChange}
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
							{PROJECT_CATEGORIES.map((category) => (
								<option key={category} value={category}>
									{category}
								</option>
							))}
						</select>
					</div>

					{/* Template Selection */}
					<div style={{ marginBottom: "20px" }}>
						<h4 style={{ color: "var(--vscode-foreground)", marginBottom: "10px" }}>Template Selection</h4>
						<div
							style={{
								border: "1px solid var(--vscode-input-border)",
								borderRadius: "3px",
								padding: "10px",
								maxHeight: "200px",
								overflowY: "auto",
								backgroundColor: "var(--vscode-input-background)",
							}}>
							{filteredTemplates.map((template) => (
								<div
									key={template.fileName}
									style={{
										padding: "8px",
										margin: "4px 0",
										cursor: "pointer",
										borderRadius: "3px",
										backgroundColor:
											selectedTemplate?.fileName === template.fileName
												? "var(--vscode-list-activeSelectionBackground)"
												: "transparent",
										color:
											selectedTemplate?.fileName === template.fileName
												? "var(--vscode-list-activeSelectionForeground)"
												: "var(--vscode-foreground)",
									}}
									onClick={() => handleTemplateSelect(template)}>
									{" "}
									{/* => setSelectedTemplate(template) */}
									<div style={{ fontWeight: "bold", fontSize: "13px" }}>{template.displayName}</div>
									<div style={{ fontSize: "11px", opacity: 0.8, marginTop: "2px" }}>{template.description}</div>
									<div style={{ fontSize: "10px", opacity: 0.6, marginTop: "2px" }}>
										File: {template.fileName}
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Project Configuration */}
					{selectedTemplate && (
						<div style={{ marginBottom: "20px" }}>
							<h4 style={{ color: "var(--vscode-foreground)", marginBottom: "10px" }}>Project Configuration</h4>

							{/* Project Name */}
							<div style={{ width: "calc(100% - 24px)", marginBottom: "15px" }}>
								<TextField
									label="Project Name"
									value={projectName}
									onChange={handleProjectNameChange}
									placeholder="Enter project name (letters, numbers, hyphens, underscores)"
									isRequired
								/>
								<div style={{ fontSize: "10px", color: "var(--vscode-descriptionForeground)", marginTop: "2px" }}>
									Will be used as the project folder name and the artifactId & name in pom.xml
								</div>
							</div>

							{/* Group ID (only if template has pomFile) */}
							{selectedTemplate.pomFile && (
								<div style={{ width: "calc(100% - 24px)", marginBottom: "15px" }}>
									<TextField
										label="Group ID"
										value={groupID}
										onChange={(e: any) => setGroupID(e.target.value)}
										placeholder="e.g., com.company.project"
										isRequired
									/>
									<div
										style={{
											fontSize: "10px",
											color: "var(--vscode-descriptionForeground)",
											marginTop: "2px",
										}}>
										Will be used as the groupId in pom.xml
									</div>
								</div>
							)}

							{/* Output Path */}
							<div style={{ marginBottom: "15px" }}>
								<div style={{ display: "flex", gap: "10px", alignItems: "end" }}>
									<div style={{ flex: 1, marginRight: "10px" }}>
										<TextField
											label="Output Path"
											value={outputPath}
											onChange={(e: any) => setOutputPath(e.target.value)}
											placeholder="Select output directory"
											isRequired
										/>
									</div>
									<button
										style={{
											backgroundColor: "var(--vscode-button-secondaryBackground)",
											color: "var(--vscode-button-secondaryForeground)",
											border: "1px solid var(--vscode-button-border)",
											borderRadius: "4px",
											padding: "8px 12px",
											cursor: "pointer",
											display: "inline-flex",
											alignItems: "center",
											fontSize: "13px",
											fontFamily: "inherit",
											outline: "none",
										}}
										onMouseOver={(e) => {
											;(e.target as HTMLButtonElement).style.backgroundColor =
												"var(--vscode-button-secondaryHoverBackground)"
										}}
										onMouseOut={(e) => {
											;(e.target as HTMLButtonElement).style.backgroundColor =
												"var(--vscode-button-secondaryBackground)"
										}}
										onFocus={(e) => {
											;(e.target as HTMLButtonElement).style.outline = "1px solid var(--vscode-focusBorder)"
										}}
										onBlur={(e) => {
											;(e.target as HTMLButtonElement).style.outline = "none"
										}}
										onClick={handleSelectOutputPath}>
										<span className="codicon codicon-folder-opened" style={{ marginRight: "6px" }}></span>
										Browse
									</button>
								</div>
								<div style={{ fontSize: "10px", color: "var(--vscode-descriptionForeground)", marginTop: "2px" }}>
									Project will be created in: {outputPath ? `${outputPath}/${projectName}` : "Not selected"}
								</div>
							</div>

							{/* Template Info */}
							<div
								style={{
									backgroundColor: "var(--vscode-textBlockQuote-background)",
									border: "1px solid var(--vscode-textBlockQuote-border)",
									padding: "10px",
									borderRadius: "3px",
									marginBottom: "15px",
								}}>
								<div style={{ fontSize: "12px", marginBottom: "5px" }}>
									<strong>Selected Template:</strong> {selectedTemplate.displayName}
								</div>
								<div style={{ fontSize: "11px", color: "var(--vscode-descriptionForeground)" }}>
									{selectedTemplate.description}
								</div>
								<div style={{ fontSize: "10px", color: "var(--vscode-descriptionForeground)", marginTop: "5px" }}>
									Source: templates/projects/examples/{selectedTemplate.fileName}
								</div>
								{selectedTemplate.pomFile && (
									<div
										style={{
											fontSize: "10px",
											color: "var(--vscode-descriptionForeground)",
											marginTop: "5px",
										}}>
										Includes: Maven POM configuration ({selectedTemplate.pomFile})
									</div>
								)}
							</div>
						</div>
					)}

					{/* Validation Errors */}
					{validationErrors.length > 0 && (
						<div style={{ marginBottom: "20px" }}>
							<div
								style={{
									backgroundColor: "var(--vscode-inputValidation-errorBackground)",
									border: "1px solid var(--vscode-inputValidation-errorBorder)",
									color: "var(--vscode-inputValidation-errorForeground)",
									padding: "10px",
									borderRadius: "3px",
								}}>
								<div style={{ fontWeight: "bold", marginBottom: "5px" }}>Validation Errors:</div>
								<ul style={{ margin: 0, paddingLeft: "20px" }}>
									{validationErrors.map((error, index) => (
										<li key={index} style={{ fontSize: "12px" }}>
											{error}
										</li>
									))}
								</ul>
							</div>
						</div>
					)}

					{/* Action Buttons */}
					<div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
						{/* Generate Project Button */}
						<button
							disabled={isGenerating || !selectedTemplate || !projectName || !outputPath}
							onClick={handleGenerateProject}
							style={{
								width: "100%",
								backgroundColor: "var(--vscode-button-background)",
								color: "var(--vscode-button-foreground)",
								border: "1px solid var(--vscode-button-border)",
								borderRadius: "4px",
								padding: "12px 16px",
								cursor:
									isGenerating || !selectedTemplate || !projectName || !outputPath ? "not-allowed" : "pointer",
								display: "inline-flex",
								alignItems: "center",
								justifyContent: "center",
								fontSize: "13px",
								fontFamily: "inherit",
								outline: "none",
								opacity: isGenerating || !selectedTemplate || !projectName || !outputPath ? 0.5 : 1,
							}}
							onMouseOver={(e) => {
								if (!(isGenerating || !selectedTemplate || !projectName || !outputPath)) {
									;(e.target as HTMLButtonElement).style.backgroundColor =
										"var(--vscode-button-hoverBackground)"
								}
							}}
							onMouseOut={(e) => {
								if (!(isGenerating || !selectedTemplate || !projectName || !outputPath)) {
									;(e.target as HTMLButtonElement).style.backgroundColor = "var(--vscode-button-background)"
								}
							}}
							onFocus={(e) => {
								;(e.target as HTMLButtonElement).style.outline = "1px solid var(--vscode-focusBorder)"
							}}
							onBlur={(e) => {
								;(e.target as HTMLButtonElement).style.outline = "none"
							}}>
							{isGenerating ? (
								<>
									<span
										className="codicon codicon-loading codicon-modifier-spin"
										style={{ marginRight: "6px" }}></span>
									Generating...
								</>
							) : (
								<>
									<span className="codicon codicon-rocket" style={{ marginRight: "6px" }}></span>
									Generate Project
								</>
							)}
						</button>
					</div>
				</div>
			)}

			{/* Available Templates Info */}
			<div
				style={{
					backgroundColor: "var(--vscode-editor-background)",
					border: "1px solid var(--vscode-panel-border)",
					borderRadius: "3px",
					padding: "15px",
					marginTop: "20px",
				}}>
				<h4 style={{ color: "var(--vscode-foreground)", marginBottom: "10px", marginTop: 0 }}>
					Available Templates ({PROJECT_TEMPLATES.length})
				</h4>
				<div style={{ fontSize: "12px", color: "var(--vscode-foreground)" }}>
					<div style={{ marginBottom: "8px" }}>
						<strong>Categories:</strong>
					</div>
					<ul style={{ fontSize: "11px", color: "var(--vscode-foreground)", margin: "0", paddingLeft: "20px" }}>
						<li>
							<strong>Web:</strong> Basic web application projects
						</li>
						<li>
							<strong>Template:</strong> Pre-configured project templates
						</li>
						<li>
							<strong>Mobile:</strong> Mobile and hybrid app projects
						</li>
						<li>
							<strong>Boot:</strong> Spring Boot based projects
						</li>
						<li>
							<strong>MSA:</strong> Microservices architecture projects
						</li>
						<li>
							<strong>Batch:</strong> Batch processing projects
						</li>
					</ul>
					<div style={{ marginTop: "10px", fontSize: "10px", opacity: 0.8 }}>
						All templates are sourced from templates/projects/examples/ directory
					</div>
				</div>
			</div>
		</div>
	)
}

export default ProjectsView
