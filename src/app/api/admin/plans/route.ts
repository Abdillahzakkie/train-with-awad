import { Plan } from "@/server/models/Plan";
import { collectionRoutes, preparePlan } from "../_crud";

const handlers = collectionRoutes(Plan, "plans", preparePlan);

export const GET = handlers.GET;
export const POST = handlers.POST;
