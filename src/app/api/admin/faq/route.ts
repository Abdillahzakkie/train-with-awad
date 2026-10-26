import { Faq } from "@/server/models/Faq";
import { collectionRoutes, prepareFaq } from "../_crud";

const handlers = collectionRoutes(Faq, "faq", prepareFaq);

export const GET = handlers.GET;
export const POST = handlers.POST;
