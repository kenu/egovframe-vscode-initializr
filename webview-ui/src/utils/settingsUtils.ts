export interface EgovSettings {
	defaultGroupId: string
	defaultArtifactId: string
	defaultPackageName: string
}

/**
 * EgovSettings에 대한 validation을 수행합니다.
 * groupId, artifactId, packageName은 기존 projectUtils.ts와 codeUtils.ts의 validation 규칙을 따릅니다.
 */
export function validateEgovSettings(settings: Partial<EgovSettings>): string[] {
	const errors: string[] = []

	// defaultGroupId validation
	if (!settings.defaultGroupId || settings.defaultGroupId.trim() === "") {
		errors.push("Default Group ID is required")
	} else if (!/^[a-z]([a-z0-9.]*[a-z0-9])?$/.test(settings.defaultGroupId)) {
		errors.push(
			"Default Group ID must start with a lowercase letter, contain only lowercase letters, numbers, or dots, and cannot end with a dot",
		)
	}

	// defaultArtifactId validation
	if (!settings.defaultArtifactId || settings.defaultArtifactId.trim() === "") {
		errors.push("Default Artifact ID is required")
	} else if (!/^[a-z][a-z0-9-]*$/.test(settings.defaultArtifactId)) {
		errors.push(
			"Default Artifact ID must start with a lowercase letter and contain only lowercase letters, numbers, or hyphens",
		)
	}

	// defaultPackageName validation
	if (!settings.defaultPackageName || settings.defaultPackageName.trim() === "") {
		errors.push("Default Package Name is required")
	} else if (!/^[a-z]([a-z0-9.]*[a-z0-9])?$/.test(settings.defaultPackageName)) {
		errors.push(
			"Default Package Name must start with a lowercase letter, contain only lowercase letters, numbers, or dots, and cannot end with a dot",
		)
	}

	return errors
}
