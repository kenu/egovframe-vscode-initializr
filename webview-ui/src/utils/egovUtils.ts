import { ProjectConfig } from "./projectUtils"

export interface EgovProjectGenerationRequest {
	config: ProjectConfig
	method: "form" | "command"
}

export interface EgovProjectGenerationResponse {
	success: boolean
	message: string
	projectPath?: string
	error?: string
}

export function createProjectGenerationMessage(config: ProjectConfig, method: string) {
	return {
		type: "generateProject" as const,
		projectConfig: {
			projectName: config.projectName,
			artifactId: config.artifactId,
			groupId: config.groupId,
			outputPath: config.outputPath,
			template: {
				displayName: config.template.displayName,
				fileName: config.template.fileName,
				pomFile: config.template.pomFile,
			},
		},
		method,
	}
}

export function createSelectOutputPathMessage() {
	return {
		type: "selectOutputPath" as const,
	}
}

export function createGenerateProjectByCommandMessage() {
	return {
		type: "generateProjectByCommand" as const,
	}
}

export function createGetWorkspacePathMessage() {
	return {
		type: "getWorkspacePath" as const,
	}
}

// Generate unique project name if conflict exists
export function generateUniqueProjectName(baseName: string, existingNames: string[]): string {
	if (!existingNames.includes(baseName)) {
		return baseName
	}

	let counter = 1
	let uniqueName = `${baseName}-${counter}`
	while (existingNames.includes(uniqueName)) {
		counter++
		uniqueName = `${baseName}-${counter}`
	}
	return uniqueName
}

// file path selection in eGovFrame Configuration Generation - Especially for EhcacheForm
export function createSelectConfigFilePathMessage() {
	return {
		type: "selectConfigFilePath" as const,
	}
}
