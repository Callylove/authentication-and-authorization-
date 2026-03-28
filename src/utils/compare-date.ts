export function tokenExpired({
  tokenExpiryDate,
}: {
  tokenExpiryDate: Date;
}): boolean {
  const today = new Date();
  const expiryMinutes = parseInt(process.env.OTP_EXPIRATION_MINUTES || '5'); // fallback if env is undefined

  const adjustedExpiry = new Date(tokenExpiryDate.getTime());
  adjustedExpiry.setMinutes(adjustedExpiry.getMinutes() + expiryMinutes);

  return today.getTime() > adjustedExpiry.getTime();
}
