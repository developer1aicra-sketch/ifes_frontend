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
    signup: `/signup/step2`, // Requires Authorization: Bearer <token> (token from verify OTP)
    step2: `/signup/step3` // Requires Authorization: Bearer token
  },
  membership: {
    initiate: `/membership/initiate`,
    myGet: `/membership/my/get` // Requires Authorization: Bearer token
  },
  payment: {
    create: `/payment/create`, // Requires Authorization token (automatically added from localStorage via axios interceptor)
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
  }
};

export default endpoints;