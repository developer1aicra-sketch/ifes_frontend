const endpoints = {
  categories: {
    list: `/category/list`,
    // IMPORTANT: Do NOT use "razorpay" as categoryId - this endpoint should not be called with payment gateway names
    // Validation is enforced in categoriesApi.js and categoriesSaga.js
    details: (id) => `/category/get/${id}`,
  },
  signupAuth: {
    sendOtp: `/auth/signup/send/otp`,
    verifyOtp: `/auth/signup/verify/otp`,
    signup: `/signup`, // Returns token in response - automatically saved to localStorage and used in subsequent requests
    step2: `/signup/step2` // Requires Authorization token (automatically added from localStorage via axios interceptor)
  },
  membership: {
    initiate: `/membership/initiate`
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
  }
};

export default endpoints;