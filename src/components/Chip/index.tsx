import type { ComponentPropsWithoutRef } from "react";
import { ChipStyled } from "./styled";

interface IChipProps extends ComponentPropsWithoutRef<"span"> {
	active?: boolean;
}

export default function Chip({ active, children, ...rest }: IChipProps) {
	return (
		<ChipStyled $on={active} {...rest}>
			{children}
		</ChipStyled>
	);
}
