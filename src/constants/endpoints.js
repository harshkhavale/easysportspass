export const ENDPOINTS = {
  AUTH: {
    INIT: `/auth/unauthorized-token`,
    LOGIN: `/auth/login`,
    REGISTER: `/auth/register`,
    REFRESH_TOKEN: `/auth/refresh-token`,
  },
  MEMBERSHIP: {
    GET_ALL_PLANS: `/membershipplan/allplans`,
    GET_NORMAL_PLANS: `/membershipplan`,
    ADD_MEMBERSHIP_TO_USER: `/usermembershipplandetail`,
    GET_CORPORATE_PLANS: `/membershipplan/getcorporateplans`,
    ATTRIBUTES: `/membershipplanattribute`,
    USER_DETAIL: `/usermembershipplandetail`,
    GET_USER_PLAN: `/usermembershipplandetail/getuserplan`,
  },
  CORPORATE: {
    CORPORATE: `/corporateuser`,
    VERIFY_CORPORATE_USER: `/corporateuser/verifycorporateuser`,
  },
  MESSAGE: {
    VERIFY_EMAIL_OTP: `/message/verifyemailotp`,
    VERIFY_MOBILE_OTP: `/message/verifymobileotp`,
    SEND_EMAIL_OTP: `/message/sendemailotp`,
    SEND_MOBILE_OTP: `/message/sendmobileotp`,
    FORGOT_PASSWORD_MOBILE_LINK: `/message/send-mobile?type=SEND_RESET_LINK&messageType=FORGOT_PASSWORD`,
    FORGOT_PASSWORD_EMAIL_LINK: `/message/send-email?type=SEND_RESET_LINK&messageType=FORGOT_PASSWORD`,
    SEND_EMAIL: '/message/send-email?type=SEND_RESET_LINK&messageType=USER_CREATED',
  },
  USERS: {
    USERS: `/users`,
    CATEGORY: `/usercategory`,
    PROFILE_PIC: '/getProfilePic',
    FORGOT_PASSWORD: '/users/forgot-password',
  },
  COUNTRY: {
    COUNTRY: `/country`,
  },
  STATE: {
    STATE: `/state`,
  },
  CITY: {
    CITY: `city`,
  },
  SUPPLIER: {
    SUPPLIER: `suppliers`,
    GET_SUPPLIER_PIC: `suppliers/getSupplierPic`,
  },
  ACTIVITIES: {
    ACTIVITIES: `activities`,
  },
  CHECK_IN: {
    CHECK_IN: '/UserCheckInDetail',
    GET_CHECK_IN_USERS: '/UserCheckInDetail/supplier',
  },
};
export const IMAGE_URL = import.meta.env.IMAGE_URL;
