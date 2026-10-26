import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { FailureStyled, FailureTitleStyled } from "./styled";

interface IFailureProps extends Omit<ComponentPropsWithoutRef<"div">, "title"> {
	title: ReactNode;
	description?: ReactNode;
	// The recovery action — pass a Button. Required by design: a failure
	// carries its own fix, never a dead end.
	children: ReactNode;
}

export default function Failure({ title, description, children, ...rest }: IFailureProps) {
	return (
		<FailureStyled {...rest}>
			<FailureTitleStyled>{title}</FailureTitleStyled>
			{description && <p>{description}</p>}
			{children}
		</FailureStyled>
	);
}
