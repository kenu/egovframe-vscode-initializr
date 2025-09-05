import { TemplateContext } from "./templateContext"

export interface GenerateCodeMessage {
	type: "generateCode"
	ddl: string
	packageName?: string
	outputPath?: string
}

export interface UploadTemplatesMessage {
	type: "uploadTemplates"
	ddl: string
}

export interface DownloadTemplateContextMessage {
	type: "downloadTemplateContext"
	ddl: string
	context: TemplateContext
}

export interface InsertSampleDDLMessage {
	type: "insertSampleDDL"
}

export interface GetWorkspacePathMessage {
	type: "getWorkspacePath"
}

export interface SelectOutputPathMessage {
	type: "selectOutputPath"
}

export interface ValidateAndPreviewMessage {
	type: "validateAndPreview"
	ddl: string
	packageName?: string
}

export interface ValidateDDLOnlyMessage {
	type: "validateDDLOnly"
	ddl: string
	packageName?: string
}

export interface GetCurrentThemeMessage {
	type: "getCurrentTheme"
}

export interface GetSampleDDLsMessage {
	type: "getSampleDDLs"
}

export type WebviewMessage =
	| GenerateCodeMessage
	| UploadTemplatesMessage
	| DownloadTemplateContextMessage
	| InsertSampleDDLMessage
	| GetWorkspacePathMessage
	| SelectOutputPathMessage
	| ValidateAndPreviewMessage
	| ValidateDDLOnlyMessage
	| GetSampleDDLsMessage
	| GetCurrentThemeMessage

export interface ErrorResponse {
	type: "error"
	message: string
}

export interface SuccessResponse {
	type: "success"
	message: string
}

export interface SampleDDLResponse {
	type: "sampleDDL"
	ddl: string
}

export interface SelectedOutputPathResponse {
	type: "selectedOutputPath"
	text: string
}

export interface CurrentWorkspacePathResponse {
	type: "currentWorkspacePath"
	text: string
}

export interface ValidationResultResponse {
	type: "validationResult"
	isValid: boolean
	previews?: { [key: string]: string }
	packageName?: string
	error?: string
}

export interface SampleDDLsResponse {
	type: "sampleDDLs"
	data: { [key: string]: { name: string; ddl: string } }
}

export interface CurrentThemeResponse {
	type: "currentTheme"
	theme: "light" | "vs-dark"
}

export interface ThemeChangedResponse {
	type: "themeChanged"
	theme: "light" | "vs-dark"
}

export type ExtensionResponse =
	| ErrorResponse
	| SuccessResponse
	| SampleDDLResponse
	| SelectedOutputPathResponse
	| CurrentWorkspacePathResponse
	| ValidationResultResponse
	| SampleDDLsResponse
	| CurrentThemeResponse
	| ThemeChangedResponse
