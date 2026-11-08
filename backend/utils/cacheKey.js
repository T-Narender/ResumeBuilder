import crypto from "crypto";

export const getRedisCacheKey = (prompt) => {
  const promptHash = crypto
    .createHash("sha256")
    .update(String(prompt))
    .digest("hex");

  return `ai:response:${promptHash}`;
};
