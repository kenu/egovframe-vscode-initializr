import { type ReactNode } from "react"

import { ExtensionStateProvider } from "./context/ExtensionStateContext"
import { EgovTabsStateProvider } from "./context/EgovTabsStateContext"
import { VSCodeThemeProvider } from "./components/ui/VSCodeThemeProvider"

export function Providers({ children }: { children: ReactNode }) {
	return (
		<ExtensionStateProvider>
			<EgovTabsStateProvider>
				<VSCodeThemeProvider>{children}</VSCodeThemeProvider>
			</EgovTabsStateProvider>
		</ExtensionStateProvider>
	)
}
