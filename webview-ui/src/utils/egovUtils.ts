export function createSelectOutputPathMessage() {
	return {
		type: "selectOutputPath" as const,
	}
}

export function createGetWorkspacePathMessage() {
	return {
		type: "getWorkspacePath" as const,
	}
}

// file path selection in eGovFrame Configuration Generation - Especially for EhcacheForm
export function createSelectConfigFilePathMessage() {
	return {
		type: "selectConfigFilePath" as const,
	}
}
