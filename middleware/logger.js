const logger = (req, res, next) => {
  console.log(`→ ${req.method} ${req.url}`);
  if (Object.keys(req.body).length) {
    console.log("  Body:", req.body);
  }
  next();
};

export default logger;
