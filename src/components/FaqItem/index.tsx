"use client";
import { type ReactNode, useId, useState } from "react";
import { FaqAStyled, FaqItemStyled, FaqQStyled } from "./styled";

interface IFaqItemProps {
	question: ReactNode;
	defaultOpen?: boolean;
	children: ReactNode;
}

export default function FaqItem({ question, defaultOpen = false, children }: IFaqItemProps) {
	const [open, setOpen] = useState(defaultOpen);
	const answerId = useId();

	return (
		<FaqItemStyled>
			<FaqQStyled
				type="button"
				$open={open}
				aria-expanded={open}
				aria-controls={answerId}
				onClick={() => setOpen((v) => !v)}
			>
				{question}
			</FaqQStyled>
			{open && <FaqAStyled id={answerId}>{children}</FaqAStyled>}
		</FaqItemStyled>
	);
}
