import bcrypt from 'bcryptjs';

/**
 * Plain password ko bcrypt se hash karta ha
 * @param password Plain text password
 * @returns Hashed string
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

/**
 * Plain password aur stored hashed password ko compare karta ha
 * @param plainPassword User ka entered password
 * @param hashedPassword DB mein saved hash
 * @returns Boolean (true agar match ho jaye)
 */
export async function comparePassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(plainPassword, hashedPassword);
}