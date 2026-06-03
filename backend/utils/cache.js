import Cache from "../models/Cache.js";
import crypto from "crypto";

/**
 * Hashes a prompt using MD5.
 * @param {string} prompt 
 * @returns {string} MD5 hash
 */
const getHash = (prompt) => {
  return crypto.createHash("md5").update(prompt).digest("hex");
};

/**
 * Saves or updates a response variation in the cache.
 * @param {string} prompt 
 * @param {string} response 
 */
export const saveToCache = async (prompt, response) => {
  try {
    const hash = getHash(prompt);
    let doc = await Cache.findOne({ hash });

    if (!doc) {
      console.log("[CACHE SAVE] Saving response to cache...");
      doc = new Cache({
        hash,
        responses: [response],
        useCount: 1
      });
    } else {
      console.log("[CACHE UPDATE] Adding new variation...");
      doc.responses.push(response);
      if (doc.responses.length > 3) {
        doc.responses.shift(); // remove oldest
      }
      doc.useCount += 1;
    }

    await doc.save();
  } catch (error) {
    console.error("Error saving to cache:", error);
  }
};

/**
 * Retrieves a response from the cache if available.
 * @param {string} prompt 
 * @param {boolean} regenerate 
 * @returns {string|null} The cached response or null
 */
export const getFromCache = async (prompt, regenerate = false) => {
  try {
    const hash = getHash(prompt);
    const doc = await Cache.findOne({ hash });

    if (!doc || !doc.responses || doc.responses.length === 0) {
      console.log("[CACHE MISS] No cache found for prompt");
      return null;
    }

    if (!regenerate) {
      // Normal generate mode: return the first variation
      console.log("[CACHE HIT] Returning cached response");
      doc.useCount += 1;
      await doc.save();
      return doc.responses[0];
    } else {
      // Regenerate mode: return a random variation excluding responses[0] if possible
      if (doc.responses.length > 1) {
        console.log("[CACHE HIT] Returning cached response");
        const variations = doc.responses.slice(1);
        const randomIndex = Math.floor(Math.random() * variations.length);
        const chosen = variations[randomIndex];
        
        doc.useCount += 1;
        await doc.save();
        return chosen;
      } else {
        // Only 1 variation exists: force fresh API call
        console.log("[CACHE MISS] No cache found for prompt");
        return null;
      }
    }
  } catch (error) {
    console.error("Error getting from cache:", error);
    return null;
  }
};
