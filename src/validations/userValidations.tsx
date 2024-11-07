import {isAlphaNum, isString, validateEmail} from '../utils/validationUtils';

export function signUpValidator({
  name,
  email,
  password,
  confirmPassword,
  role,
  country_code,
  mobile_no,
  state,
}: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  country_code: string;
  mobile_no: string;
  state: string;
}) {
  const phoneRegex = /^\d{10}$/;

  const Error = [];

  if (!name) Error.push({error: 'Name field is empty'});
  if (!email) Error.push({error: 'Email field is empty'});
  if (!mobile_no) Error.push({error: 'Phone number field is empty'});
  if (!password) Error.push({error: 'password field is empty'});
  if (!state) Error.push({error: 'state field is empty'});
  if (!country_code) Error.push({error: 'country_code field is empty'});
  if (!role) Error.push({error: 'role field is empty'});
  if (!confirmPassword) Error.push({error: 'confirmPassword field is empty'});
  if (password !== confirmPassword) {
    Error.push({error: 'Passwords do not match'});
  }

  if (name && !isString(name)) Error.push({error: 'name is not a string'});
  if (email && !isString(email)) Error.push({error: 'email is not a string'});
  if (mobile_no && !isString(mobile_no))
    Error.push({error: 'phone number is not a string'});
  if (password && !isString(password))
    Error.push({error: 'password is not a string'});
  if (password && password.length < 4) {
    Error.push({error: 'Please Provide Strong Password'});
  }

  if (email && isString(email) && !validateEmail(email)) {
    Error.push({error: 'Invalid email format'});
  }

  if (mobile_no && !phoneRegex.test(mobile_no)) {
    Error.push({error: 'Invalid phone number format'});
  }

  if (password && password.length < 4) {
    Error.push({error: 'Password at least contain 5 letters'});
  }
  if (country_code && !isAlphaNum(country_code)) {
    Error.push({error: 'country_code is not a valid number'});
  }

  if (Error && Error.length > 0) {
    return Error;
  }
  return [];
}

export function loginValidator({
  mobile_no,
  password,
  role,
  country_code,
}: {
  mobile_no: string;
  password: string;
  role: string;
  country_code: string;
}) {
  const Error = [];
  if (!mobile_no) Error.push({error: 'Email field is empty'});
  if (!password) Error.push({error: 'password field is empty'});
  if (!role) Error.push({error: 'role field is empty'});
  if (!country_code) Error.push({error: 'country_code field is empty'});
  if (mobile_no && !isString(mobile_no))
    Error.push({error: 'phone number is not a string'});
  if (password && !isString(password))
    Error.push({error: 'password is not a string'});
  if (password && password.length < 4) {
    Error.push({error: 'Please Provide Strong Password'});
  }

  if (Error && Error.length > 0) {
    return Error;
  }
  return [];
}
