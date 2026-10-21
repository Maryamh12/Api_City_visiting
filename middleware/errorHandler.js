const errorHandler = (err, req, res, next) => {
  // Missing, invalid or expired tokens are authentication failures (401)
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ message: "Invalid token. Please log in again." });
  }
  if (err.name === "TokenExpiredError") {
    return res.status(401).json({ message: "Session expired. Please log in again." });
  }
  if (err.name === "CastError") {
    return res.status(400).json({ message: "Invalid ID format." });
  }
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ message: messages.join(", ") });
  }
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Request body is not valid JSON." });
  }
  console.error("Unhandled error:", err);
  return res.status(500).json({ message: "Internal server error." });
};

export default errorHandler;
