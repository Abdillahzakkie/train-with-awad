"use client";

import { type ComponentPropsWithoutRef, type ElementType, type ReactNode, useEffect, useId } from "react";
import {
	AdminButtonStyled,
	AdminCardStyled,
	AdminGridStyled,
	AdminInputStyled,
	AdminSelectStyled,
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
	type TTone,
	TableStyled,
	ToggleRowStyled,
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

export function AdminSelect(props: ComponentPropsWithoutRef<"select">) {
	return <AdminSelectStyled {...props} />;
}

interface IAdminTableProps {
	head?: ReactNode;
	children: ReactNode;
}

export function AdminTable({ head, children }: IAdminTableProps) {
	return (
		<TableStyled>
			<table>
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
			<span className="eglyph" aria-hidden="true" />
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
