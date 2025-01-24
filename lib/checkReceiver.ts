import redis from "./redis";

export async function checkReceiverExists(receiver: string): Promise<boolean> {
  try {
    const key = `user:${receiver}`;
    const exists = await redis.exists(key); // Returns 1 if the key exists, 0 otherwise
    return exists === 1;
  } catch (error) {
    console.error("Error checking receiver existence:", error);
    throw new Error("Failed to check receiver existence.");
  }
}
