import React from "react"
import { TemplateConfig, FormComponentProps } from "../types/templates"
import DatasourceForm from "./DatasourceForm"
import LoggingForm from "./LoggingForm"
import CacheForm from "./CacheForm"
import PropertyForm from "./PropertyForm"
import IdGenerationForm from "./IdGenerationForm"
import SchedulingForm from "./SchedulingForm"
import TransactionForm from "./TransactionForm"
import JndiDatasourceForm from "./JndiDatasourceForm"
import EhcacheForm from "./EhcacheForm"

interface FormFactoryProps extends Omit<FormComponentProps, "template"> {
	template: TemplateConfig
}

const FormFactory: React.FC<FormFactoryProps> = ({ template, onSubmit, onCancel, initialData }) => {
	const getFormComponent = () => {
		const webView = template.webView

		// Cache forms
		if (webView.includes("cache-cache")) {
			return <CacheForm template={template} onSubmit={onSubmit} onCancel={onCancel} initialData={initialData} />
		}
		if (webView.includes("cache-ehcacheConfig")) {
			return <EhcacheForm template={template} onSubmit={onSubmit} onCancel={onCancel} initialData={initialData} />
		}

		// Datasource forms
		if (webView.includes("datasource-datasource")) {
			return <DatasourceForm template={template} onSubmit={onSubmit} onCancel={onCancel} initialData={initialData} />
		}
		if (webView.includes("datasource-jndiDatasource")) {
			return <JndiDatasourceForm template={template} onSubmit={onSubmit} onCancel={onCancel} initialData={initialData} />
		}

		// ID Generation forms
		if (webView.includes("id-gnr-")) {
			return <IdGenerationForm template={template} onSubmit={onSubmit} onCancel={onCancel} initialData={initialData} />
		}

		// Logging formType
		if (webView.includes("logging-")) {
			const loggingFormType = webView.includes("console")
				? "console"
				: webView.includes("file")
					? "file"
					: webView.includes("rollingFile")
						? "rollingFile"
						: webView.includes("timeBasedRollingFile")
							? "timeBasedRollingFile"
							: webView.includes("jdbc")
								? "jdbc"
								: "console"
			return <LoggingForm template={template} onSubmit={onSubmit} onCancel={onCancel} formType={loggingFormType} />
		}

		// Property forms
		if (webView.includes("property-")) {
			return <PropertyForm template={template} onSubmit={onSubmit} onCancel={onCancel} initialData={initialData} />
		}

		// Scheduling forms
		if (webView.includes("scheduling-")) {
			const schedulingFormType = webView.includes("beanJob")
				? "beanJob"
				: webView.includes("methodJob")
					? "methodJob"
					: webView.includes("simpleTrigger")
						? "simpleTrigger"
						: webView.includes("cronTrigger")
							? "cronTrigger"
							: webView.includes("scheduler")
								? "scheduler"
								: "beanJob"
			return (
				<SchedulingForm
					template={template}
					onSubmit={onSubmit}
					onCancel={onCancel}
					formType={schedulingFormType}
					initialData={initialData}
				/>
			)
		}

		// Transaction forms
		if (webView.includes("transaction-")) {
			const transactionFormType = webView.includes("transaction-datasource")
				? "datasource"
				: webView.includes("jpa")
					? "jpa"
					: webView.includes("jta")
						? "jta"
						: "datasource"
			return (
				<TransactionForm
					template={template}
					onSubmit={onSubmit}
					onCancel={onCancel}
					formType={transactionFormType}
					initialData={initialData}
				/>
			)
		}

		// Default fallback - use Datasource form as a base
		return <DatasourceForm template={template} onSubmit={onSubmit} onCancel={onCancel} initialData={initialData} />
	}

	return <div>{getFormComponent()}</div>
}

export default FormFactory
