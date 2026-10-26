import type { ComponentPropsWithoutRef } from "react";
import { BannerStyled, type TBannerTone } from "./styled";

interface IBannerProps extends ComponentPropsWithoutRef<"div"> {
	tone?: TBannerTone;
}

export default function Banner({ tone = "info", children, ...rest }: IBannerProps) {
	return (
		<BannerStyled $tone={tone} {...rest}>
			{children}
		</BannerStyled>
	);
}

export type { TBannerTone };
