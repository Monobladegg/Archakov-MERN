import {body} from "express-validator";

export const registrationValidation = [
  body("email", "Incorrect email").isEmail(),
  body("fullName", "Incorrect full name").isLength({min: 3, max: 32}),
  body("password", "Incorrect password").isLength({min: 5, max: 32}),
  body("avatarUrl", "Incorrect avatar URL").optional().isURL(),
];

export const loginValidation = [
  body("email", "Incorrect email").isEmail(),
  body("password", "Incorrect password").isLength({min: 5, max: 32})
]