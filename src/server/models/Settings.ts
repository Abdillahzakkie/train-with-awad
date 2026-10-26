import mongoose, { type HydratedDocument, type InferSchemaType, type Model, model, Schema } from "mongoose";

// One keyed document holding the editable, non-secret runtime settings — the
// addresses enquiry and purchase emails use. Secrets stay in env; only these
// operator-facing values live here, with env as the fallback.
const settingsSchema = new Schema(
	{
		key: { type: String, required: true, unique: true, default: "settings" },
		data: { type: Schema.Types.Mixed, default: {} },
	},
	{ timestamps: true, minimize: false },
);

type TSettingsFields = InferSchemaType<typeof settingsSchema> & { createdAt: Date };
export type TSettingsDoc = HydratedDocument<TSettingsFields>;

// Reuse the compiled model across hot reloads; defining it twice throws.
export const Settings: Model<TSettingsFields> =
	(mongoose.models.Settings as Model<TSettingsFields>) ?? model<TSettingsFields>("Settings", settingsSchema);
