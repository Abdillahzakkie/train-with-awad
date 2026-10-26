import { Testimonial } from "@/server/models/Testimonial";
import { reorderRoute } from "../../_crud";

export const POST = reorderRoute(Testimonial, "testimonials").POST;
