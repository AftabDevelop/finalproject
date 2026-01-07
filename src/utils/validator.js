const validator = require('validator');

const validate = async (data) => {
  const mandatoryFields = ['firstName', 'emailId', 'password'];

  // Check if all mandatory fields are present
  const isAllowed = mandatoryFields.every((key) => data.hasOwnProperty(key));
  if (!isAllowed) {
    throw new Error("Field is missing");
  }

  // Validate email format
  if (!validator.isEmail(data.emailId)) {
    throw new Error("Invalid email format");
  }

  // Validate password strength
  if (!validator.isStrongPassword(data.password)) {
    throw new Error("Password is too weak (must contain uppercase, lowercase, number & symbol)");
  }

  // Validate firstName (letters only)
  if (!validator.isAlpha(data.firstName)) {
    throw new Error("First name must contain only letters.");
  }

  return { success: true, message: "Validation passed." };
};

module.exports = validate;  // ✅ yahan parentheses hata do
