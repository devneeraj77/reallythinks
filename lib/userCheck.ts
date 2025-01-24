import redis from "./redis";

// Function to check if the user exists in Redis
export async function checkUserExists(receiver: string): Promise<boolean> {
  try {
    // Check if the user exists in Redis
    const userExists = await redis.exists(`user:${receiver}`);
    return userExists === 1; // Redis returns 1 if the key exists, 0 if not
  } catch (error) {
    console.error("Error checking user existence:", error);
    return false; // If there's an error, return false
  }
}
