export interface CodeConfig {
	packageName: string
	outputPath: string
}

/**
 * CodeView에서 사용되는 설정에 대한 validation을 수행합니다.
 * packageName은 Java package name 규칙을 따르며 groupId와 동일한 validation을 적용합니다.
 */
export function validateCodeConfig(config: Partial<CodeConfig>): string[] {
	const errors: string[] = []

	if (!config.packageName || config.packageName.trim() === "") {
		errors.push("Package name is required")
	} else if (!/^[a-z]([a-z0-9.]*[a-z0-9])?$/.test(config.packageName)) {
		errors.push(
			"Package name must start with a lowercase letter, contain only lowercase letters, numbers, or dots, and cannot end with a dot",
		)
	}

	if (!config.outputPath || config.outputPath.trim() === "") {
		errors.push("Output path is required")
	}

	return errors
}
