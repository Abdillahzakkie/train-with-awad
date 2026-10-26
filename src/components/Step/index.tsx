import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { StepBodyStyled, StepNumStyled, StepStyled } from "./styled";

interface IStepProps extends Omit<ComponentPropsWithoutRef<"div">, "title"> {
	num: ReactNode;
	title: ReactNode;
	children?: ReactNode;
}

export default function Step({ num, title, children, ...rest }: IStepProps) {
	return (
		<StepStyled {...rest}>
			<StepNumStyled>{num}</StepNumStyled>
			<StepBodyStyled>
				<h5>{title}</h5>
				{children && <p>{children}</p>}
			</StepBodyStyled>
		</StepStyled>
	);
}
