export enum ConfigGenerationType {
	XML = "xml",
	YAML = "yaml",
	PROPERTIES = "properties",
	JAVA_CONFIG = "javaConfig",
	JSON = "json",
}

export interface TemplateConfig {
	displayName: string
	templateFolder: string
	templateFile: string
	webView: string
	fileNameProperty: string
	javaConfigTemplate: string
	yamlTemplate: string
	propertiesTemplate: string
	description: string
}

export interface GroupedTemplates {
	[category: string]: {
		[subcategory: string]: TemplateConfig
	}
}

export interface FormComponentProps {
	template: TemplateConfig
	onSubmit: (formData: ConfigFormData) => void
	onCancel: () => void
	initialData?: Partial<ConfigFormData>
	formType?: string
}

// 확장된 ConfigFormData 인터페이스 - 모든 폼 필드 포함
export interface ConfigFormData {
	// 공통 필드
	generationType: ConfigGenerationType
	txtFileName: string // = generationType이 ConfigGenerationType.JAVA_CONFIG 일 때는 클래스 이름, 그 외에는 파일 이름
	outputFolder?: string

	// JavaConfig 관련
	txtConfigPackage?: string

	// Datasource 관련
	txtDatasourceName?: string
	rdoType?: string
	txtDriver?: string
	txtUrl?: string
	txtUser?: string
	txtPasswd?: string

	// JNDI Datasource 관련
	txtJndiName?: string

	// Logging 관련
	txtAppenderName?: string
	txtConversionPattern?: string
	txtLogFileName?: string
	cboAppend?: boolean
	txtLogFileNamePattern?: string
	txtMaxIndex?: string
	txtMaxFileSize?: string
	txtInterval?: string
	cboModulate?: boolean
	txtTableName?: string
	rdoConnectionType?: string
	txtConnectionFactoryClass?: string
	txtConnectionFactoryMethod?: string

	// Cache 관련
	txtDiskStore?: string
	txtDftMaxElements?: string
	txtDftEternal?: string
	txtDftIdelTime?: string
	txtDftLiveTime?: string
	txtDftOverfow?: string
	txtDftDiskPersistence?: string
	txtDftDiskExpiry?: string
	txtCacheName?: string
	txtMaxElements?: string
	txtEternal?: string
	txtIdleTime?: string
	txtLiveTime?: string
	txtOverflowToDisk?: string
	txtDiskPersistent?: string
	cboMemoryPolicy?: string
	txtConfigLocation?: string
	txtComponentScanBasePackage?: string
	txtDftHeapEntries?: string
	txtDftOffheapSize?: string
	txtHeapEntries?: string

	// Property 관련
	txtPropertyServiceName?: string
	rdoPropertyType?: string
	txtKey?: string
	txtValue?: string
	cboEncoding?: string
	txtPropertyFile?: string

	// ID Generation 관련
	txtIdServiceName?: string
	//txtDatasourceName?: string // Datasource 템플릿 쪽에 이미 선언되어 있음
	rdoIdType?: string
	txtQuery?: string
	txtTable?: string
	txtTableNameFieldValue?: string
	txtBlockSize?: string
	//chkStrategy?: boolean // 선언 불필요
	txtStrategyName?: string
	txtPrefix?: string
	txtCipers?: string
	txtFillChar?: string
	txtAddress?: string

	// Scheduling 관련
	txtJobName?: string
	txtServiceClass?: string
	chkProperty?: boolean
	txtPropertyName?: string
	txtPropertyValue?: string
	txtServiceName?: string
	txtServiceMethod?: string
	cboConcurrent?: string
	cboJobDetailType?: string
	txtTriggerName?: string
	txtStartDelay?: string
	txtCronExpression?: string
	txtRepeatInterval?: string
	txtSchedulerName?: string
	cboTriggerType?: string

	// Transaction 관련
	txtTransactionTemplate?: string
	txtTransactionTemplateName?: string
	txtTransactionName?: string
	txtDataSourceName?: string
	chkAopConfigTransaction?: boolean
	chkAnnotationTransaction?: boolean
	txtEntityManagerFactory?: string
	txtPackagesToScan?: string
	cmbDialectName?: string
	txtSpringDataJpaRepositoriesPackage?: string
	txtJtaImplementation?: string
	txtGlobalTimeout?: string
	txtPointCutName?: string
	txtPointCutExpression?: string
	txtAdviceName?: string
	txtMethodName?: string
	chkReadOnly?: boolean
	txtRollbackFor?: string
	txtNoRollbackFor?: string
	txtTimeout?: string
	cmbPropagation?: string
	cmbIsolation?: string

	// 기타 추가 필드들
	[key: string]: any
}
