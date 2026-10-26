import { Faq } from "@/server/models/Faq";
import { reorderRoute } from "../../_crud";

export const POST = reorderRoute(Faq, "faq").POST;
