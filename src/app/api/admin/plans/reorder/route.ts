import { Plan } from "@/server/models/Plan";
import { reorderRoute } from "../../_crud";

export const POST = reorderRoute(Plan, "plans").POST;
