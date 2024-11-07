export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isString = (value: any): boolean =>
  typeof value === 'string' || value instanceof String;

export const validateMobileNumber = (number: string): boolean =>
  number.length === 10 && /^\d+$/.test(number);

export function isAlphaNum(str: string) {
  const number = Number(str);
  return !isNaN(number);
}
