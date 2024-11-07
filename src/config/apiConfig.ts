const baseUrl = 'http://10.10.0.219:3000';

const apiConfig = {
  LOGIN_URL: `${baseUrl}/user/login`,
  SIGNUP_URL: `${baseUrl}/user/signup`,
  SEND_OTP_URL: `${baseUrl}/user/sendOtp`,
  VERIFY_OTP_URL: `${baseUrl}/user/verifyOtp`,
  FORGOT_PASSWORD_URL: `${baseUrl}/user/forgot-password`,
  CREATE_SEARCH_URL: `${baseUrl}/search`,
  GET_RECENT_SEARCH_URL: `${baseUrl}/search`,
  GET_ALL_PRODUCTS_URL: `${baseUrl}/products`,
  GET_IMAGES_BY_ID: `${baseUrl}/images`,
  GET_ALL_CATEGORIES_URL: `${baseUrl}/categories`,
  GET_ALL_OFFERS_URL: `${baseUrl}/bestoffers`,
  GET_ALL_BEST_CHOICE_URL: `${baseUrl}/bestchoice/best-choice`,
  GET_ALL_TODAY_SPECAILS_URL: `${baseUrl}/todayspecials`,
  GET_ALL_RESTUARENTS_NEAR_BY_URL: `${baseUrl}/business/nearby?`,
  CREATE_ADDRESS_URL: `${baseUrl}/address/`,
};

export default apiConfig;
