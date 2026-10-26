import { Testimonial } from "@/server/models/Testimonial";
import { collectionRoutes, prepareTestimonial } from "../_crud";

const handlers = collectionRoutes(Testimonial, "testimonials", prepareTestimonial);

export const GET = handlers.GET;
export const POST = handlers.POST;
