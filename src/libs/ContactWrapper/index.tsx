"use client";

import { type FormEvent, useState } from "react";
import { Button, Failure, Field, FieldError, Hint, Input, Label, Success } from "@/components";
import { useSubmitLead } from "@/hooks";
import { leadSchema, type TLeadInput } from "@/server/validators/lead";
import { FormStyled } from "./styled";

type TMode = TLeadInput["mode"];
type TStatus = "idle" | "submitting" | "sent" | "error";
type TErrors = Partial<Record<keyof TLeadInput, string>>;

interface IValues {
	name: string;
	email: string;
	phone: string;
	mode: TMode;
	goal: string;
}

// The "Book a free call" form. Validates with the shared leadSchema inline, so
// the client and the Route Handler enforce one definition, then submits through
// useSubmitLead. A 200 renders Success; an error renders Failure with a retry.
export default function ContactWrapper() {
	const submitLead = useSubmitLead();
	const [status, setStatus] = useState<TStatus>("idle");
	const [errors, setErrors] = useState<TErrors>({});
	const [values, setValues] = useState<IValues>({ name: "", email: "", phone: "", mode: "online", goal: "" });

	function set<K extends keyof IValues>(key: K, value: IValues[K]) {
		setValues((prev) => ({ ...prev, [key]: value }));
	}

	async function onSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const parsed = leadSchema.safeParse({
			name: values.name,
			email: values.email,
			phone: values.phone || undefined,
			mode: values.mode,
			goal: values.goal || undefined,
			source: "contact",
		});
		if (!parsed.success) {
			const fieldErrors = parsed.error.flatten().fieldErrors;
			setErrors({
				name: fieldErrors.name?.[0],
				email: fieldErrors.email?.[0],
				phone: fieldErrors.phone?.[0],
				mode: fieldErrors.mode?.[0],
				goal: fieldErrors.goal?.[0],
			});
			return;
		}
		setErrors({});
		setStatus("submitting");
		try {
			await submitLead(parsed.data);
			setStatus("sent");
		} catch {
			setStatus("error");
		}
	}

	if (status === "sent") {
		return (
			<Success
				title="Enquiry received"
				description="Awad has your enquiry and replies himself, usually within one working day. No need to send it again."
			>
				<Button as="a" href="/online-coaching" variant="outline">
					Read the online coaching plan while you wait
				</Button>
			</Success>
		);
	}

	return (
		<FormStyled onSubmit={onSubmit} noValidate>
			{status === "error" && (
				<Failure
					title="Your enquiry didn't send"
					description="The connection dropped before it reached Awad, so nothing was lost — what you typed is still here. Check you're online and send it again."
				>
					<Button type="submit" variant="primary">
						Try again
					</Button>
				</Failure>
			)}

			<Field invalid={Boolean(errors.name)}>
				<Label htmlFor="name" required>
					Your name
				</Label>
				<Input
					id="name"
					name="name"
					autoComplete="name"
					value={values.name}
					onChange={(event) => set("name", event.target.value)}
				/>
				{errors.name && <FieldError>{errors.name}</FieldError>}
			</Field>

			<Field invalid={Boolean(errors.email)}>
				<Label htmlFor="email" required>
					Email
				</Label>
				<Input
					id="email"
					name="email"
					type="email"
					autoComplete="email"
					value={values.email}
					onChange={(event) => set("email", event.target.value)}
				/>
				{errors.email && <FieldError>{errors.email}</FieldError>}
			</Field>

			<Field invalid={Boolean(errors.phone)}>
				<Label htmlFor="phone">
					Phone <Hint>(optional)</Hint>
				</Label>
				<Input
					id="phone"
					name="phone"
					type="tel"
					autoComplete="tel"
					value={values.phone}
					onChange={(event) => set("phone", event.target.value)}
				/>
				{errors.phone && <FieldError>{errors.phone}</FieldError>}
			</Field>

			<Field invalid={Boolean(errors.mode)}>
				<Label htmlFor="mode" required>
					What are you interested in?
				</Label>
				<Input
					as="select"
					id="mode"
					name="mode"
					value={values.mode}
					onChange={(event) => set("mode", event.target.value as TMode)}
				>
					<option value="online">Online coaching</option>
					<option value="in-person">In-person coaching</option>
				</Input>
				{errors.mode && <FieldError>{errors.mode}</FieldError>}
			</Field>

			<Field invalid={Boolean(errors.goal)}>
				<Label htmlFor="goal">Your goal</Label>
				<Input
					multiline
					id="goal"
					name="goal"
					placeholder="What do you want to get out of coaching?"
					value={values.goal}
					onChange={(event) => set("goal", event.target.value)}
				/>
				{errors.goal && <FieldError>{errors.goal}</FieldError>}
			</Field>

			<Button type="submit" variant="primary" block disabled={status === "submitting"}>
				{status === "submitting" ? "Sending…" : "Book a free call"}
			</Button>
		</FormStyled>
	);
}
