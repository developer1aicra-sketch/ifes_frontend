const endpoints = {
  categories: {
    list: `/category/list`,
    // IMPORTANT: Do NOT use "razorpay" as categoryId - this endpoint should not be called with payment gateway names
    // Validation is enforced in categoriesApi.js and categoriesSaga.js
    details: (id) => `/category/get/${id}`,
  },
  signupAuth: {
    sendOtp: `/auth/signup/send/otp`,
    verifyOtp: `/auth/signup/verify/otp`, // Response must include token; stored and sent as Bearer for /signup
    /** POST email + password; returns token and user. Then use token for signup/step2, step3, membership/bulk, payment/create */
    authSignup: `/auth/signup`,
    /** PUT; JSON: categoryId, designation, fullName, mobile, planId. Requires Bearer token from auth/signup */
    signupStep2: `/signup/step2`,
    /** FormData: shipping/affiliation. Requires Bearer token */
    signupStep3: `/signup/step3`,
    signup: `/signup/step2`, // legacy alias
    step2: `/signup/step3` // legacy alias
  },
  membership: {
    initiate: `/membership/initiate`,
    bulk: `/membership/bulk`, // POST { members: [...] }; run before /payment/create; returns membership(s) with _id
    myGet: `/membership/my/get` // Requires Authorization: Bearer token
  },
  payment: {
    create: `/payment/create`, // Run after /membership/bulk; uses membership_id from bulk response
    verify: `/payments/verify` // Verify payment after successful Razorpay transaction
  },
  loginAuth: {
    sendOtp: `/auth/login/send/otp`,
    verifyOtp: `/auth/login/verify/otp`
  },
  competition: {
    list: '/competition/list',
    details: (id) => `/competition/get/${id}`
  },
  event: {
    list: '/event/list'
  },
  club: {
    add: `/club/add`,
    myGet: `/club/my/get`
  },
  squad: {
    clubs: {
      list: '/squad/clubs',
      create: '/squad/clubs',
      update: (id) => `/squad/clubs/${id}`,
      delete: (id) => `/squad/clubs/${id}`,
      details: (id) => `/squad/clubs/${id}`
    },
    teams: {
      list: (clubId) => `/squad/clubs/${clubId}/teams`,
      create: (clubId) => `/squad/clubs/${clubId}/teams`,
      update: (clubId, teamId) => `/squad/clubs/${clubId}/teams/${teamId}`,
      delete: (clubId, teamId) => `/squad/clubs/${clubId}/teams/${teamId}`,
      details: (clubId, teamId) => `/squad/clubs/${clubId}/teams/${teamId}`
    },
    members: {
      add: (clubId, teamId) => `/squad/clubs/${clubId}/teams/${teamId}/members`,
      remove: (clubId, teamId, memberId) => `/squad/clubs/${clubId}/teams/${teamId}/members/${memberId}`,
      updateCaptain: (clubId, teamId) => `/squad/clubs/${clubId}/teams/${teamId}/captain`
    }
  },
  partners: {
    home: (countryCode) => `/partners/home/${countryCode}`,
    update: (id) => `/partners/${id}`
  },
  about: {
    people: (category) => `/about-worso/people?category=${encodeURIComponent(category)}`,
  },
  directory: {
    /** GET all users data for Student Community Directory; may support ?page=&limit=&search= */
    allUsers: `/all-users-data`,
  },
};

export default endpoints;