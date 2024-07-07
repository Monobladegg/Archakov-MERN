import {body} from "express-validator";

export const postCreateValidation = [
  body("title", "Incorrect title").isLength({min: 3, max: 128}),
  body("text", "Incorrect text").isLength({min: 3, max: 1024}),
  body("tags", "Incorrect tags").optional().isString(),
  body("imageUrl", "Incorrect image URL").optional().isURL()
]