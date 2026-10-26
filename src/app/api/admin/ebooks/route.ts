import { Ebook } from "@/server/models/Ebook";
import { collectionRoutes, prepareEbook } from "../_crud";

const handlers = collectionRoutes(Ebook, "ebooks", prepareEbook);

export const GET = handlers.GET;
export const POST = handlers.POST;
