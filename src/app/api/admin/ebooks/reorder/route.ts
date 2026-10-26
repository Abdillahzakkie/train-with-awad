import { Ebook } from "@/server/models/Ebook";
import { reorderRoute } from "../../_crud";

export const POST = reorderRoute(Ebook, "ebooks").POST;
