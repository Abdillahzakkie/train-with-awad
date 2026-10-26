import { Plan } from "@/server/models/Plan";
import { itemRoutes, preparePlan } from "../../_crud";

const handlers = itemRoutes(Plan, "plans", preparePlan);

export const PUT = handlers.PUT;
export const DELETE = handlers.DELETE;
