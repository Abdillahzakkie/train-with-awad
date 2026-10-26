import { Ebook } from "@/server/models/Ebook";
import { itemRoutes, prepareEbook } from "../../_crud";

const handlers = itemRoutes(Ebook, "ebooks", prepareEbook);

export const PUT = handlers.PUT;
export const DELETE = handlers.DELETE;
