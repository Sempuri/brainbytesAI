import Message from "./message.js";

/**
 * Save a chat message to the database.
 * @param {string} session - The session ID.
 * @param {string} message - The message text.
 * @returns {Promise<Object>} - The saved message.
 */
export async function saveMessage(session, message) {
  return await Message.create({ session, message });
}

/**
 * Get all messages for a given session.
 * @param {string} session - The session ID.
 * @returns {Promise<Array>} - Array of messages.
 */
export async function getMessagesBySession(session) {
  return await Message.find({ session });
}
