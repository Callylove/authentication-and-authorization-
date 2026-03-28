
export function generateOtp({
  length = 6,
  upper_case = false,
  lower_case = false,
  random_num = true,
}: {
  length?: number;
  upper_case?: boolean;
  lower_case?: boolean;
  random_num?: boolean;
}): string {
  let result: string = '';
  if (upper_case) result = 'ABCDEFGHIJKLMNOPQRSTUVWZYZ';
  if (lower_case) result += 'abcdefghijklmnopqrstuvwxyz';
  if (random_num) result += '0123456789';
  let otp = '';
  for (let p = 0; p < length; p++) {
    otp += result[Math.floor(Math.random() * result.length)];
  }
  return otp;
}


