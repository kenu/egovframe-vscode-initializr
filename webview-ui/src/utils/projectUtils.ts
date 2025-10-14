export interface ProjectTemplate {
	displayName: string
	fileName: string
	pomFile: string
	description?: string
	category?: string
	projectName?: string
	artifactId?: string
}

export interface ProjectConfig {
	projectName: string
	artifactId: string
	groupId: string
	outputPath: string
	template: ProjectTemplate
}

export const PROJECT_TEMPLATES: ProjectTemplate[] = [
	{
		displayName: "Web Project", // eGovFrame Web Project
		fileName: "example-web.zip",
		pomFile: "example-web-pom.xml",
		description: "Basic eGovFrame web application project",
		category: "Web",
		projectName: "web-project",
	},
	{
		displayName: "Template >Simple Homepage", // eGovFrame Template Project > Simple Homepage
		fileName: "example-template-simple.zip",
		pomFile: "example-template-simple-pom.xml",
		description: "Simple homepage template with basic functionalities",
		category: "Template",
		projectName: "template-simple-homepage",
	},
	{
		displayName: "Template > Portal Site", // eGovFrame Template Project > Portal Site
		fileName: "example-template-portal.zip",
		pomFile: "example-template-portal-pom.xml",
		description: "Portal site template for enterprise applications",
		category: "Template",
		projectName: "template-portal-site",
	},
	{
		displayName: "Template > Enterprise Business", // eGovFrame Template Project > Enterprise Business
		fileName: "example-template-enterprise.zip",
		pomFile: "example-template-enterprise-pom.xml",
		description: "Enterprise business application template",
		category: "Template",
		projectName: "template-enterprise-business",
	},
	{
		displayName: "Template > Common All-in-one", // eGovFrame Template Project > Common All-in-one
		fileName: "egovframework-all-in-oneAllNew_wizard.zip",
		pomFile: "egovframework-all-in-oneAllNew_wizard-pom.xml",
		description: "Comprehensive all-in-one project template",
		category: "Template",
		projectName: "template-common-all-in-one",
	},
	{
		displayName: "Mobile Project", // eGovFrame Mobile Project
		fileName: "example-mbl-web.zip",
		pomFile: "mobile-web-pom.xml",
		description: "Mobile web application project",
		category: "Mobile",
		projectName: "mobile-project",
	},
	{
		displayName: "Mobile Template Project", // eGovFrame Mobile Template Project
		fileName: "egovframework-all-in-one-mobile-4.3.0.zip",
		pomFile: "mobile-template-pom.xml",
		description: "Mobile template project with hybrid app support",
		category: "Mobile",
		projectName: "mobile-template-project",
	},
	{
		displayName: "DeviceAPI Web Project", // eGovFrame DeviceAPI Web Project
		fileName: "DeviceAPI_WEBService_Guide_V4.3.0.zip",
		pomFile: "",
		description: "Device API integration web project",
		category: "Mobile",
		projectName: "deviceapi-web-project",
	},
	{
		displayName: "Boot Web Project", // eGovFrame Boot Web Project
		fileName: "example-boot-web.zip",
		pomFile: "example-boot-web-pom.xml",
		description: "Spring Boot based web project",
		category: "Boot",
		projectName: "boot-web-project",
	},
	{
		displayName: "Boot Template > Simple Homepage (Backend)", // eGovFrame Boot Template Project > Simple Homepage (Backend)
		fileName: "egovframe-template-simple-backend.zip",
		pomFile: "egovframe-template-simple-backend-pom.xml",
		description: "Spring Boot simple homepage backend",
		category: "Boot",
		projectName: "boot-template-simple-backend",
	},
	{
		displayName: "Boot Template > Simple Homepage (Frontend)", // eGovFrame Boot Template Project > Simple Homepage (Frontend)
		fileName: "egovframe-template-simple-react.zip",
		pomFile: "",
		description: "React-based frontend for simple homepage",
		category: "Boot",
		projectName: "boot-template-simple-frontend",
	},
	{
		displayName: "MSA Boot Template > Common Components (KRDS)", // eGovFrame MSA Boot Template Project > Common Components (KRDS)
		fileName: "egovframe-common-components-msa-krds-4.3.1.zip",
		pomFile: "",
		description: "MSA common components with KRDS integration",
		category: "MSA",
		projectName: "msa-boot-common-components",
	},
	{
		displayName: "MSA Boot Template > Portal (Backend)", // eGovFrame MSA Boot Template Project > Portal (Backend)
		fileName: "egovframe-msa-portal-backend.zip",
		pomFile: "",
		description: "MSA portal backend services",
		category: "MSA",
		projectName: "msa-boot-portal-backend",
	},
	{
		displayName: "MSA Boot Template > Portal (Frontend)", // eGovFrame MSA Boot Template Project > Portal (Frontend)
		fileName: "egovframe-msa-portal-frontend.zip",
		pomFile: "",
		description: "MSA portal frontend application",
		category: "MSA",
		projectName: "msa-boot-portal-frontend",
	},
	{
		displayName: "Boot Batch Template > Scheduler (File)", // eGovFrame Boot Batch Template Project > Scheduler (File)
		fileName: "egovframework.rte.bat.template.sam.scheduler.zip",
		pomFile: "batch-sam-scheduler-pom.xml",
		description: "File-based batch scheduler project",
		category: "Batch",
		projectName: "boot-batch-scheduler-file",
	},
	{
		displayName: "Boot Batch Template > CommandLine (File)", // eGovFrame Boot Batch Template Project > CommandLine (File)
		fileName: "egovframework.rte.bat.template.sam.commandline.zip",
		pomFile: "batch-sam-commandline-pom.xml",
		description: "File-based command line batch project",
		category: "Batch",
		projectName: "boot-batch-commandline-file",
	},
	{
		displayName: "Boot Batch Template > Web (File)", // eGovFrame Boot Batch Template Project > Web (File)
		fileName: "egovframework.rte.bat.template.sam.web.zip",
		pomFile: "batch-sam-web-pom.xml",
		description: "File-based web batch project",
		category: "Batch",
		projectName: "boot-batch-web-file",
	},
	{
		displayName: "Boot Batch Template > Scheduler (DB)", // eGovFrame Boot Batch Template Project > Scheduler (DB)
		fileName: "egovframework.rte.bat.template.db.scheduler.zip",
		pomFile: "batch-db-scheduler-pom.xml",
		description: "Database-based batch scheduler project",
		category: "Batch",
		projectName: "boot-batch-scheduler-db",
	},
	{
		displayName: "Boot Batch Template > CommandLine (DB)", // eGovFrame Boot Batch Template Project > CommandLine (DB)
		fileName: "egovframework.rte.bat.template.db.commandline.zip",
		pomFile: "batch-db-commandline-pom.xml",
		description: "Database-based command line batch project",
		category: "Batch",
		projectName: "boot-batch-commandline-db",
	},
	{
		displayName: "Boot Batch Template > Web (DB)", // eGovFrame Boot Batch Template Project > Web (DB)
		fileName: "egovframework.rte.bat.template.db.web.zip",
		pomFile: "batch-db-web-pom.xml",
		description: "Database-based web batch project",
		category: "Batch",
		projectName: "boot-batch-web-db",
	},
]

//export const PROJECT_CATEGORIES =// ["All", "Web", "Template", "Mobile", "Boot", "MSA", "Batch"]
function categoriesFromProjectTemplates(templates: ProjectTemplate[]): string[] {
	const categories = new Set<string>() // Set은 요소의 첫 등장 순서를 보존하므로, PROJECT_TEMPLATES 배열에서 카테고리 등장 순서에 주의가 필요하다
	categories.add("All")
	templates.forEach((template) => {
		if (template.category) {
			categories.add(template.category)
		}
	})
	return Array.from(categories)
}

// 카테고리 배열 반환 : ["All", "Web", "Template", "Mobile", "Boot", "MSA", "Batch"]
export const PROJECT_CATEGORIES: string[] = Array.from(categoriesFromProjectTemplates(PROJECT_TEMPLATES))

/*
 * getTemplatesByCategory
 *
 * 카테고리에 해당하는 템플릿 배열 반환
 * type: (category: string) => ProjectTemplate[]
 * return: ProjectTemplate[]
 */
export function getTemplatesByCategory(category: string): ProjectTemplate[] {
	if (category === "All") {
		return PROJECT_TEMPLATES
	}
	return PROJECT_TEMPLATES.filter((template) => template.category === category)
}

export function validateProjectConfig(config: Partial<ProjectConfig>): string[] {
	const errors: string[] = []

	if (!config.projectName || config.projectName.trim() === "") {
		errors.push("Project name is required")
	} else if (!/^[a-zA-Z][a-zA-Z0-9_-]*$/.test(config.projectName)) {
		errors.push("Project name must start with a letter and contain only letters, numbers, hyphens, and underscores")
	}

	// groupId validation (only for templates with pomFile)
	if (config.template?.pomFile) {
		if (!config.groupId || config.groupId.trim() === "") {
			errors.push("Group ID is required for this template")
		} else if (!/^[a-z]([a-z0-9.]*[a-z0-9])?$/.test(config.groupId)) {
			errors.push(
				"Group ID must start with a lowercase letter, contain only lowercase letters, numbers, or dots, and cannot end with a dot",
			)
		}
	}

	// artifactId validation (only for templates with pomFile)
	if (config.template?.pomFile) {
		if (!config.artifactId || config.artifactId.trim() === "") {
			errors.push("Artifact ID is required for this template")
		} else if (!/^[a-z][a-z0-9-]*$/.test(config.artifactId)) {
			errors.push("Artifact ID must start with a lowercase letter and contain only lowercase letters, numbers, or hyphens")
		}
	}

	if (!config.outputPath || config.outputPath.trim() === "") {
		errors.push("Output path is required")
	}

	if (!config.template) {
		errors.push("Template selection is required")
	}

	return errors
}
