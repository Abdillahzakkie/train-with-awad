import mongoose, { type HydratedDocument, type InferSchemaType, type Model, model, Schema } from "mongoose";

// A registered WebAuthn credential for an admin, additive alongside the password
// login. `counter` is the signature counter checked on each assertion.
const passkeySchema = new Schema(
	{
		userId: { type: Schema.Types.ObjectId, ref: "AdminUser", required: true },
		credentialId: { type: String, required: true, unique: true },
		publicKey: { type: String, required: true },
		counter: { type: Number, default: 0 },
		transports: { type: [String], default: [] },
		deviceName: { type: String, default: "Passkey" },
	},
	{ timestamps: true },
);

type TPasskeyFields = InferSchemaType<typeof passkeySchema> & { createdAt: Date };
export type TPasskeyDoc = HydratedDocument<TPasskeyFields>;

// Reuse the compiled model across hot reloads; defining it twice throws.
export const Passkey: Model<TPasskeyFields> =
	(mongoose.models.Passkey as Model<TPasskeyFields>) ?? model<TPasskeyFields>("Passkey", passkeySchema);
