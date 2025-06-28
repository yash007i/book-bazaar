import { body } from "express-validator";

const userRegistrationValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required.")
      .isEmail()
      .withMessage("Email is Invalid."),

    body("fullname")
      .trim()
      .notEmpty()
      .withMessage("Fullname is required.")
      .isLength({ min: 3 })
      .withMessage("Fullname should be at least minimum 3 length.")
      .isLength({ max: 13 })
      .withMessage("Fullname can not be maximum 13 char."),

    body("password")
      .notEmpty()
      .withMessage("Password is required.")
      .isLength({ min: 3 })
      .withMessage("Password should be at least minimum 3 length."),

    body("phone")
      .trim()
      .notEmpty()
      .withMessage("Phone is required.")
      .isLength({ max: 10 })
      .withMessage("Phone can not be maximum 10 char."),
  ];
};

const userLoginValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required.")
      .isEmail()
      .withMessage("Email is Invalid."),
    body("password")
      .notEmpty()
      .withMessage("Password is required.")
      .isLength({ min: 3 })
      .withMessage("Password should be at least minimum 3 length."),
  ];
};

const userForgotPasswordValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required.")
      .isEmail()
      .withMessage("Email is Invalid."),
    body("password")
      .notEmpty()
      .withMessage("Password is required.")
      .isLength({ min: 3 })
      .withMessage("Password should be at least minimum 3 length."),
    body("conformPassword")
      .notEmpty()
      .withMessage("Conform Password is required.")
      .isLength({ min: 3 })
      .withMessage("Conform Password should be at least minimum 3 length."),
  ];
};

export {
  userRegistrationValidator,
  userLoginValidator,
  userForgotPasswordValidator,
};
