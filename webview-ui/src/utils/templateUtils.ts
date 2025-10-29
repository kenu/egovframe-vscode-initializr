import { TemplateConfig, GroupedTemplates } from "../components/egov/types/templates"

/**
 * Configuration Generation 템플릿 배열을 카테고리별로 그룹화
 */
export function groupTemplates(templates: TemplateConfig[]): GroupedTemplates {
	const grouped: GroupedTemplates = {}

	templates.forEach((template) => {
		const parts = template.displayName.split(" > ")
		if (parts.length >= 2) {
			const category = parts[0]
			const subcategory = parts[1]

			if (!grouped[category]) {
				grouped[category] = {}
			}

			grouped[category][subcategory] = template
		}
	})

	return grouped
}
