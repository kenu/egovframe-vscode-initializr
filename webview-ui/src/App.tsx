import EgovView from "./components/egov/EgovView"
import EgovSettingsView from "./components/egov/EgovSettingsView"
import { useExtensionState } from "./context/ExtensionStateContext"
import { Providers } from "./Providers"

const AppContent = () => {
	const { showEgov, showEgovSettings, egovTab, hideEgov, hideEgovSettingsScreen } = useExtensionState()

	// Show EgovSettingsView when showEgovSettings is true, otherwise show EgovView
	if (showEgovSettings) {
		return <EgovSettingsView onDone={hideEgovSettingsScreen} />
	}

	// Show EgovView as the main interface
	return <EgovView initialTab={egovTab} onDone={hideEgov} />
}

const App = () => {
	return (
		<Providers>
			<AppContent />
		</Providers>
	)
}

export default App
