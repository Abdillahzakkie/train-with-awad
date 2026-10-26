import { Testimonial } from "@/server/models/Testimonial";
import { itemRoutes, prepareTestimonial } from "../../_crud";

const handlers = itemRoutes(Testimonial, "testimonials", prepareTestimonial);

export const PUT = handlers.PUT;
export const DELETE = handlers.DELETE;
