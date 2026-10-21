// Fields that must never be written to the logs
const SENSITIVE_FIELDS = ["password", "confirmPassword", "token"];

export const redact = (body = {}) => {
  const safe = { ...body };
  for (const field of SENSITIVE_FIELDS) {
    if (field in safe) safe[field] = "[REDACTED]";
  }
  return safe;
};

const logger = (req, res, next) => {
  console.log(`→ ${req.method} ${req.url}`);
  if (req.body && Object.keys(req.body).length) {
    console.log("  Body:", redact(req.body));
  }
  next();
};

export default logger;
