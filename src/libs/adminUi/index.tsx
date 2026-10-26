"use client";

import {
	type ComponentPropsWithoutRef,
	type CSSProperties,
	type ElementType,
	type ReactNode,
	useEffect,
	useId,
} from "react";
import Select, { components, type OptionProps, type StylesConfig } from "react-select";
import {
	AdminButtonStyled,
	AdminCardStyled,
	AdminGridStyled,
	AdminInputStyled,
	AdminTextareaStyled,
	BadgeStyled,
	DialogStyled,
	EmptyStyled,
	FieldStyled,
	NoticeStyled,
	OverlayStyled,
	PageHeaderStyled,
	type TAdminSize,
	type TAdminVariant,
	TableStyled,
	ToggleRowStyled,
	type TTone,
} from "./styled";

export * from "./styled";

interface IAdminButtonProps extends ComponentPropsWithoutRef<"button"> {
	variant?: TAdminVariant;
	size?: TAdminSize;
	block?: boolean;
	as?: ElementType;
	href?: string;
}

export function AdminButton({ variant = "secondary", size = "md", block, type, as, ...rest }: IAdminButtonProps) {
	return (
		<AdminButtonStyled
			as={as}
			$variant={variant}
			$size={size}
			$block={block}
			type={as ? undefined : (type ?? "button")}
			{...rest}
		/>
	);
}

interface IAdminCardProps extends Omit<ComponentPropsWithoutRef<"div">, "title"> {
	title?: ReactNode;
	as?: ElementType;
}

export function AdminCard({ title, as, children, ...rest }: IAdminCardProps) {
	return (
		<AdminCardStyled as={as} {...rest}>
			{title && <h2>{title}</h2>}
			{children}
		</AdminCardStyled>
	);
}

interface IAdminGridProps {
	$cols: 2 | 3 | 4;
	children: ReactNode;
}

export function AdminGrid({ $cols, children }: IAdminGridProps) {
	return <AdminGridStyled $cols={$cols}>{children}</AdminGridStyled>;
}

interface IPageHeaderProps {
	title: ReactNode;
	subtitle?: ReactNode;
	action?: ReactNode;
}

export function PageHeader({ title, subtitle, action }: IPageHeaderProps) {
	return (
		<PageHeaderStyled>
			<div>
				<h1>{title}</h1>
				{subtitle && <p>{subtitle}</p>}
			</div>
			{action && <div className="actions">{action}</div>}
		</PageHeaderStyled>
	);
}

interface IAdminFieldProps {
	label: ReactNode;
	htmlFor?: string;
	hint?: ReactNode;
	error?: ReactNode;
	required?: boolean;
	children: ReactNode;
}

export function AdminField({ label, htmlFor, hint, error, required, children }: IAdminFieldProps) {
	return (
		<FieldStyled>
			<label htmlFor={htmlFor}>
				{label}
				{required && (
					<span className="req" aria-hidden="true">
						*
					</span>
				)}
			</label>
			{children}
			{hint && <span className="hint">{hint}</span>}
			{error && (
				<span className="err" role="alert">
					{error}
				</span>
			)}
		</FieldStyled>
	);
}

export function AdminInput(props: ComponentPropsWithoutRef<"input">) {
	return <AdminInputStyled {...props} />;
}

export function AdminTextarea(props: ComponentPropsWithoutRef<"textarea">) {
	return <AdminTextareaStyled {...props} />;
}

export type TAdminOption = { value: string; label: string };

// react-select themed to the admin tokens (design/mockups 03-admin): a control
// that reads like an input with a chevron, and a white menu with a hover row and
// a ticked selection. Colours are token strings so adminTheme.ts stays the source
// of truth. Not searchable — these are short, known lists a non-technical person
// picks from, not a type-ahead.
const selectStyles: StylesConfig<TAdminOption, false> = {
	control: (base, state) => ({
		...base,
		minHeight: "var(--adm-ctl-h)",
		borderRadius: "var(--adm-r-sm)",
		borderColor: state.isFocused ? "var(--adm-accent)" : "var(--adm-line-2)",
		boxShadow: state.isFocused ? "var(--adm-focus)" : "none",
		backgroundColor: "var(--adm-surface)",
		fontSize: 16,
		"&:hover": { borderColor: state.isFocused ? "var(--adm-accent)" : "var(--adm-line-2)" },
	}),
	valueContainer: (base) => ({ ...base, padding: "2px 10px" }),
	singleValue: (base) => ({ ...base, color: "var(--adm-ink)" }),
	placeholder: (base) => ({ ...base, color: "var(--adm-ink-3)" }),
	input: (base) => ({ ...base, color: "var(--adm-ink)" }),
	indicatorSeparator: () => ({ display: "none" }),
	dropdownIndicator: (base) => ({ ...base, color: "var(--adm-ink-3)", padding: "0 10px" }),
	menu: (base) => ({
		...base,
		borderRadius: "var(--adm-r-sm)",
		border: "1px solid var(--adm-line)",
		boxShadow: "var(--adm-shadow)",
		backgroundColor: "var(--adm-surface)",
		overflow: "hidden",
		marginTop: 6,
	}),
	menuPortal: (base) => ({ ...base, zIndex: 80 }),
	menuList: (base) => ({ ...base, padding: 6 }),
	option: (base, state) => ({
		...base,
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
		minHeight: 40,
		borderRadius: 8,
		fontSize: 15,
		fontWeight: state.isSelected ? 650 : 400,
		cursor: "pointer",
		color: state.isSelected ? "var(--adm-accent-strong)" : "var(--adm-ink-2)",
		backgroundColor: state.isSelected
			? "var(--adm-accent-wash)"
			: state.isFocused
				? "var(--adm-surface-2)"
				: "transparent",
		"&:active": {
			backgroundColor: state.isSelected ? "var(--adm-accent-wash)" : "var(--adm-surface-2)",
		},
	}),
};

function AdminSelectOption(props: OptionProps<TAdminOption, false>) {
	return (
		<components.Option {...props}>
			<span>{props.data.label}</span>
			{props.isSelected && <span aria-hidden="true">✓</span>}
		</components.Option>
	);
}

export function AdminSelect({
	value,
	onChange,
	options,
	id,
	ariaLabel,
	placeholder,
	disabled,
}: {
	value: string;
	onChange: (value: string) => void;
	options: TAdminOption[];
	id?: string;
	ariaLabel?: string;
	placeholder?: string;
	disabled?: boolean;
}) {
	const selected = options.find((o) => o.value === value) ?? null;
	return (
		<Select<TAdminOption>
			inputId={id}
			instanceId={id ?? ariaLabel}
			aria-label={ariaLabel}
			options={options}
			value={selected}
			onChange={(opt) => opt && onChange(opt.value)}
			isDisabled={disabled}
			isSearchable={false}
			placeholder={placeholder ?? "Select…"}
			styles={selectStyles}
			components={{ Option: AdminSelectOption }}
			menuPortalTarget={typeof document !== "undefined" ? document.body : undefined}
			menuPlacement="auto"
		/>
	);
}

interface IAdminTableProps {
	head?: ReactNode;
	// Column labels, in order. On a phone each row becomes a card and these label
	// its stacked cells (fed to the CSS as --l1..--l6). Keep them matching `head`.
	columns?: string[];
	children: ReactNode;
}

export function AdminTable({ head, columns, children }: IAdminTableProps) {
	const labelVars = columns
		? (Object.fromEntries(columns.map((c, i) => [`--l${i + 1}`, `"${c}"`])) as CSSProperties)
		: undefined;
	return (
		<TableStyled>
			<table style={labelVars}>
				{head && <thead>{head}</thead>}
				<tbody>{children}</tbody>
			</table>
		</TableStyled>
	);
}

interface IAdminBadgeProps {
	tone?: TTone;
	children: ReactNode;
}

export function AdminBadge({ tone = "idle", children }: IAdminBadgeProps) {
	return <BadgeStyled $tone={tone}>{children}</BadgeStyled>;
}

interface IAdminNoticeProps {
	tone?: TTone;
	children: ReactNode;
	onDismiss?: () => void;
}

export function AdminNotice({ tone = "info", children, onDismiss }: IAdminNoticeProps) {
	return (
		<NoticeStyled $tone={tone} role={tone === "danger" ? "alert" : "status"}>
			<span className="notice-body">{children}</span>
			{onDismiss && (
				<button type="button" className="notice-dismiss" aria-label="Dismiss" onClick={onDismiss}>
					×
				</button>
			)}
		</NoticeStyled>
	);
}

interface IAdminEmptyProps {
	title: ReactNode;
	description?: ReactNode;
	// The action that fills the empty state — pass an AdminButton.
	children?: ReactNode;
}

export function AdminEmpty({ title, description, children }: IAdminEmptyProps) {
	return (
		<EmptyStyled>
			<span className="eglyph" aria-hidden="true">
				<svg viewBox="0 0 24 24" fill="currentColor">
					<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 12h-4c0 1.66-1.35 3-3 3s-3-1.34-3-3H5V5h14v10z" />
				</svg>
			</span>
			<h2>{title}</h2>
			{description && <p>{description}</p>}
			{children && <div className="ebtn">{children}</div>}
		</EmptyStyled>
	);
}

interface IAdminToggleProps {
	checked: boolean;
	onChange: (next: boolean) => void;
	label?: ReactNode;
	id?: string;
	disabled?: boolean;
}

export function AdminToggle({ checked, onChange, label, id, disabled }: IAdminToggleProps) {
	return (
		<ToggleRowStyled>
			{label && <span className="tlabel">{label}</span>}
			<button
				type="button"
				className="switch"
				role="switch"
				id={id}
				aria-checked={checked}
				aria-label={typeof label === "string" ? label : undefined}
				data-on={checked}
				disabled={disabled}
				onClick={() => onChange(!checked)}
			/>
		</ToggleRowStyled>
	);
}

interface IAdminModalProps {
	open: boolean;
	title: ReactNode;
	children?: ReactNode;
	confirmLabel: string;
	cancelLabel?: string;
	onConfirm: () => void;
	onCancel: () => void;
	danger?: boolean;
	busy?: boolean;
}

export function AdminModal({
	open,
	title,
	children,
	confirmLabel,
	cancelLabel = "Cancel",
	onConfirm,
	onCancel,
	danger,
	busy,
}: IAdminModalProps) {
	const titleId = useId();

	useEffect(() => {
		if (!open) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") onCancel();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [open, onCancel]);

	if (!open) return null;

	return (
		<OverlayStyled role="presentation" onClick={onCancel}>
			<DialogStyled open aria-modal="true" aria-labelledby={titleId} onClick={(e) => e.stopPropagation()}>
				<h2 id={titleId}>{title}</h2>
				{children}
				<div className="dialog-actions">
					<AdminButton variant="secondary" onClick={onCancel}>
						{cancelLabel}
					</AdminButton>
					<AdminButton variant={danger ? "danger" : "primary"} onClick={onConfirm} disabled={busy}>
						{busy ? "Working…" : confirmLabel}
					</AdminButton>
				</div>
			</DialogStyled>
		</OverlayStyled>
	);
}
