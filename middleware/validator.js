const { body, param, header, validationResult } = require("express-validator");
const userRegistrationRules = (...params) => {
  return [
    //call custom validator
    existenceValidator(...params),
    // username must be an email
    body("username")
      .isLength({ min: 5, max: 20 })
      .withMessage("username must be 5-20 characters"),
    // password must be at least 5 chars long
    body("password")
      .isLength({ min: 8 })
      .withMessage("password must be 8 characters at least"),
    body("username")
      .isLength({ min: 3, max: 15 })
      .withMessage("password must be 3-15 characters"),
  ];
};
const addPostRules = () => {
  return [
    body("body").notEmpty().withMessage("body cannot be empty"),
    body("title").notEmpty().withMessage("title cannot be empty"),
    header("authorization").notEmpty().withMessage("unauthorized"),
  ];
};
const deletePostRules = () => {
  return [header("authorization").notEmpty().withMessage("unauthorized")];
};
const getPostRules = () => {
  return [
    //call custom validator
    // existenceValidator(...params),
    param("postId"),
    header("authorization"),
  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

  return res.status(422).json({
    errors: extractedErrors,
  });
};

function existenceValidator(...params) {
  return (req, res, next) => {
    //does body contain each item in params
    params.forEach((p) => {
      if (!req.body[p]) {
        console.log(p);
        return next(`${p} must be provided`);
      }
    });

    return next();
  };
}

module.exports = {
  deletePostRules,
  addPostRules,
  getPostRules,
  userRegistrationRules,
  validate,
  existenceValidator,
};
