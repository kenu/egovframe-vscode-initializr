import React, { createContext, useCallback, useContext, useEffect, useState } from "react"
import { useEvent } from "react-use"
import { ExtensionMessage } from "@shared/ExtensionMessage"
import { EgovViewTab } from "../shared/egovframe"
import { vscode } from "../utils/vscode"

interface ExtensionStateContextType {
	// Only keep essential eGov-related state
	showEgov: boolean
	showEgovSettings: boolean
	egovTab?: EgovViewTab

	// Legacy properties for compatibility (empty/default values)
	theme?: Record<string, string>
	telemetrySetting?: string
	distinctId?: string
	version?: string
	autoApprovalSettings?: any
	navigateToSettings?: () => void

	// eGov setters and navigation
	setEgovTab: (tab?: EgovViewTab) => void
	navigateToEgov: () => void
	hideEgov: () => void
	showEgovSettingsScreen: () => void
	hideEgovSettingsScreen: () => void
}

const ExtensionStateContext = createContext<ExtensionStateContextType | undefined>(undefined)

export const ExtensionStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	// UI view state - only eGov related
	const [showEgov, setShowEgov] = useState(true)
	const [showEgovSettings, setShowEgovSettings] = useState(false)
	const [egovTab, setEgovTab] = useState<EgovViewTab | undefined>(undefined)

	// Hide functions - only eGov
	const hideEgov = useCallback(() => setShowEgov(false), [setShowEgov])

	// Navigation functions - only eGov
	const navigateToEgov = useCallback(() => {
		setShowEgov(true)
		setShowEgovSettings(false)
	}, [setShowEgov, setShowEgovSettings])

	// eGov Settings view functions
	const showEgovSettingsScreen = useCallback(() => {
		setShowEgovSettings(true)
		setShowEgov(true)
	}, [setShowEgovSettings, setShowEgov])

	const hideEgovSettingsScreen = useCallback(() => {
		setShowEgovSettings(false)
	}, [setShowEgovSettings])

	// Minimal state for eGov functionality
	const handleMessage = useCallback(
		(event: MessageEvent) => {
			const message: ExtensionMessage = event.data

			if (message.type === "action" && message.action === "egovButtonClicked") {
				showEgovSettingsScreen()
			}
		},
		[showEgovSettingsScreen],
	)

	useEvent("message", handleMessage)

	// Send webviewDidLaunch message to extension when webview mounts
	useEffect(() => {
		vscode.postMessage({ type: "webviewDidLaunch" })
	}, [])

	const contextValue: ExtensionStateContextType = {
		showEgov,
		showEgovSettings,
		egovTab,

		// Legacy properties with default values
		theme: undefined,
		telemetrySetting: "unset",
		distinctId: "",
		version: "",
		autoApprovalSettings: {},
		navigateToSettings: () => {},

		// eGov functions
		navigateToEgov,
		hideEgov,
		setEgovTab,
		showEgovSettingsScreen,
		hideEgovSettingsScreen,
	}

	return <ExtensionStateContext.Provider value={contextValue}>{children}</ExtensionStateContext.Provider>
}

export const useExtensionState = () => {
	const context = useContext(ExtensionStateContext)
	if (context === undefined) {
		throw new Error("useExtensionState must be used within an ExtensionStateProvider")
	}
	return context
}
