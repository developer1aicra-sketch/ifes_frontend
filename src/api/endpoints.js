const endpoints = {
  categories: {
    list: `/category/list`,
    // IMPORTANT: Do NOT use "razorpay" as categoryId - this endpoint should not be called with payment gateway names
    // Validation is enforced in categoriesApi.js and categoriesSaga.js
    details: (id) => `/category/get/${id}`,
  },
  plans: {
    /** GET all membership plans */
    list: `/plan/list`,
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
    verifyOtp: `/auth/login/verify/otp`,
    login: `/auth/login`,
    /** POST with { email } — sends reset link to email */
    forgotPassword: `/auth/forgot/password`,
  },
  competition: {
    list: '/competition/list',
    details: (id) => `/competition/get/${id}`
  },
  event: {
    list: '/event/list',
    /** GET events by partner. Query: ?website=worso&partnerCode=EG */
    get: '/event/get',
  },
  bot: {
    list: '/bot/list',
  },
  club: {
    add: `/club/add`,
    myGet: `/club/my/get`,
    /** GET clubs by website + partnerCode. Query: ?website=worso&partnerCode=XX */
    get: `/club/get`,
    /** Get club by id. Requires Bearer token. */
    getById: (id) => `/club/get/${id}`,
    /** Update club by id (captain name / clubName etc). Requires Bearer token. */
    update: (id) => `/club/update/${id}`,
    /** Club members: list by club id. */
    members: (clubId) => `/clubmember/${clubId}`,
    /** Add club member */
    addMember: `/club/member/add`,
    /** Update club member by member id */
    updateMember: (memberId) => `/club/member/update/${memberId}`,
    /** Delete club member by member id */
    deleteMember: (memberId) => `/club/member/delete/${memberId}`,
  },
  team: {
    /** Create a team (requires Bearer token) */
    add: '/team/add',
    /** List teams (may accept ?club_id=) */
    list: '/team/list',
    /** Update team by id */
    update: (teamId) => `/team/update/${teamId}`,
  },
  squad: {
    /** Legacy squad endpoints used by squadApi.js */
    add: '/squad/add',
    getById: (id) => `/squad/get/${id}`,
    listByClub: (clubId) => `/squad/club/${clubId}`,
    update: (id) => `/squad/update/${id}`,
    delete: (id) => `/squad/delete/${id}`,
    myGet: '/squad/get/my',
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
    update: (id) => `/partners/${id}`,
    /** POST - create partner enquiry */
    createEnquiry: `/partner/create/enquiry`,
  },
  about: {
    people: (category) => `/about-worso/people?category=${encodeURIComponent(category)}`,
  },
  directory: {
    /** GET all users data for Student Community Directory; may support ?page=&limit=&search= */
    allUsers: `/all-users-data`,
  },
  classes: {
    schedule: `/classes/schedule`,
    register: `/class/register`,
  },
  profile: {
    /** Update logged-in member profile details */
    update: `/profile/update`,
  },
};

export default endpoints;