import { Faq } from "@/server/models/Faq";
import { itemRoutes, prepareFaq } from "../../_crud";

const handlers = itemRoutes(Faq, "faq", prepareFaq);

export const PUT = handlers.PUT;
export const DELETE = handlers.DELETE;
