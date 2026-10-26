import mongoose, { type HydratedDocument, type InferSchemaType, type Model, Schema, model } from "mongoose";

// An admin who signs in to the CMS. The password login is primary; passkeys are
// additive (see Passkey). `status: "disabled"` blocks sign-in without deleting.
const adminUserSchema = new Schema(
	{
		email: { type: String, required: true, unique: true, lowercase: true },
		passwordHash: { type: String, required: true },
		name: { type: String, default: "Admin" },
		status: { type: String, enum: ["active", "disabled"], default: "active" },
	},
	{ timestamps: true },
);

type TAdminUserFields = InferSchemaType<typeof adminUserSchema> & { createdAt: Date };
export type TAdminUserDoc = HydratedDocument<TAdminUserFields>;

// Reuse the compiled model across hot reloads; defining it twice throws.
export const AdminUser: Model<TAdminUserFields> =
	(mongoose.models.AdminUser as Model<TAdminUserFields>) ?? model<TAdminUserFields>("AdminUser", adminUserSchema);
