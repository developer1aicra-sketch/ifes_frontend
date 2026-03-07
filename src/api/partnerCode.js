let currentPartnerCode = '';

export const setPartnerCode = (code) => {
  currentPartnerCode = (code || '').toString().trim().toUpperCase();
};

export const getPartnerCode = () => currentPartnerCode;

