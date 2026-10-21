/**
 * Return a copy of `source` containing only the allowed keys that are present.
 * Used to stop clients from setting protected fields such as createdBy,
 * likes or comments through a request body (mass assignment).
 */
export const pick = (source = {}, allowedKeys = []) =>
  allowedKeys.reduce((result, key) => {
    if (source[key] !== undefined) result[key] = source[key];
    return result;
  }, {});

/** Escape characters that have a special meaning in regular expressions. */
export const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
