export const ADMIN_EMAIL = 'robertwaweru324@gmail.com';

export function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  return email.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase().trim();
}
