import React from "react"
import { useVSCodeTheme } from "./theme"

export interface ResponsiveMenuButtonProps {
	children: React.ReactNode
	active: boolean
	onClick: () => void
	icon: "edit" | "info"
	title: string
	isCompact: boolean
	dataValue: string
}

export const ResponsiveMenuButton = ({
	children,
	active,
	onClick,
	icon,
	title,
	isCompact,
	dataValue,
}: ResponsiveMenuButtonProps) => {
	const theme = useVSCodeTheme()

	// SVG 아이콘 컴포넌트들

	// https://fonts.google.com/icons?selected=Material+Icons+Outlined:edit:&icon.query=edit&icon.size=24&icon.color=%23F3F3F3&icon.platform=web&icon.set=Material+Icons
	const EditIcon = () => (
		<svg
			width="16"
			height="16"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className="w-4 h-4"
			aria-hidden="true"
			style={{
				color: active ? theme.colors.listActiveForeground : theme.colors.foreground,
			}}>
			<path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
		</svg>
	)

	// https://fonts.google.com/icons?selected=Material+Icons+Outlined:info:&icon.query=info&icon.size=24&icon.color=%23F3F3F3&icon.platform=web&icon.set=Material+Icons&icon.style=Outlined
	const InfoIcon = () => (
		<svg
			width="16"
			height="16"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className="w-4 h-4"
			aria-hidden="true"
			style={{
				color: active ? theme.colors.listActiveForeground : theme.colors.foreground,
			}}>
			<circle cx="12" cy="12" r="10" />
			<path d="M12 16v-4" />
			<path d="M12 8h.01" />
		</svg>
	)

	const renderIcon = () => {
		return icon === "edit" ? <EditIcon /> : icon === "info" ? <InfoIcon /> : null
	}

	return (
		<button
			aria-selected={active}
			onClick={onClick}
			title={title}
			role="tab"
			tabIndex={active ? 0 : -1}
			data-compact={isCompact}
			data-value={dataValue}
			style={{
				outline: "none",
				whiteSpace: "nowrap",
				overflow: "hidden",
				minWidth: 0,
				height: "48px", // h-12 = 48px
				padding: isCompact ? "16px" : "12px 16px", // data-[compact=true]:p-4
				boxSizing: "border-box",
				display: "flex",
				alignItems: "center",
				borderLeft: active ? `2px solid ${theme.colors.focusBorder}` : "2px solid transparent",
				borderTop: 0,
				borderRight: 0,
				borderBottom: 0,
				color: theme.colors.foreground,
				opacity: active ? 1 : 0.7,
				backgroundColor: active
					? "color-mix(in srgb, var(--vscode-list-activeSelectionBackground) 70%, transparent)"
					: "transparent",
				cursor: "pointer",
				transition: "all 0.2s ease",
				width: isCompact ? "48px" : "100%",
				justifyContent: isCompact ? "center" : "flex-start",
			}}
			onMouseEnter={(e) => {
				if (!active) {
					e.currentTarget.style.backgroundColor = theme.colors.toolbarHoverBackground
				}
			}}
			onMouseLeave={(e) => {
				if (!active) {
					e.currentTarget.style.backgroundColor = "transparent"
				}
			}}>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					gap: isCompact ? "0" : "8px",
					color: active ? theme.colors.listActiveForeground : theme.colors.foreground,
				}}>
				{renderIcon()}
				{!isCompact && (
					<span
						className="tab-label"
						style={{
							whiteSpace: "nowrap",
							overflow: "hidden",
							textOverflow: "ellipsis",
							fontSize: theme.fontSize.sm,
							color: active ? theme.colors.listActiveForeground : theme.colors.foreground,
						}}>
						{children}
					</span>
				)}
			</div>
		</button>
	)
}

ResponsiveMenuButton.displayName = "ResponsiveMenuButton"
