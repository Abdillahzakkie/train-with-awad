import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { StatLabelStyled, StatStyled, StatValStyled } from "./styled";

interface IStatProps extends ComponentPropsWithoutRef<"div"> {
	value: ReactNode;
	label: ReactNode;
}

export default function Stat({ value, label, ...rest }: IStatProps) {
	return (
		<StatStyled {...rest}>
			<StatValStyled>{value}</StatValStyled>
			<StatLabelStyled>{label}</StatLabelStyled>
		</StatStyled>
	);
}
