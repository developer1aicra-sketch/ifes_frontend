import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Activity,
  Award,
  Building2,
  MapPin,
  Mail,
  Phone,
  Shield,
  UserCheck,
  Loader2,
  LogIn,
  ChevronRight,
  Edit2,
  Share2,
  Trophy,
} from "lucide-react";
import { getMyClubs, updateClub } from "../api/clubApi";
import { updateProfile as updateProfileApi } from "../api/profileApi";
import { INITIAL_DB } from "../constants/userData";

const AUTH_TOKEN_KEY = "token";

// Fallback stats/career/certificates until profile API exists
const DEFAULT_STATS = INITIAL_DB.currentUser.career_stats ?? { matches: 0, golds: 0, silvers: 0 };
const DEFAULT_CAREER = [
  { type: "winner", title: "Winner - ZRC Pune - RoboRace", subtitle: "2025 • Captain" },
  { type: "participant", title: "Participant - WRC UAE - Soccer", subtitle: "2024 • Pilot" },
];
const DEFAULT_CERTIFICATES = INITIAL_DB.currentUser.certificates ?? [
  { id: "cert_992", title: "Winner - RoboRace ZRC", date: "2025-05-12" },
  { id: "cert_112", title: "Participant - WRC Soccer", date: "2024-10-10" },
];

function useAuth() {
  const [token, setToken] = useState(() => localStorage.getItem(AUTH_TOKEN_KEY));
  const checkAuth = useCallback(() => {
    setToken(localStorage.getItem(AUTH_TOKEN_KEY));
  }, []);
  return { isAuthenticated: !!token, token, checkAuth };
}

function getEmailFromToken(token) {
  if (!token || typeof token !== "string") return null;
  const raw = token.startsWith("Bearer ") ? token.slice("Bearer ".length) : token;
  const parts = raw.split(".");
  if (parts.length < 2) return null;

  try {
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    const json = atob(padded);
    const payload = JSON.parse(json);

    return (
      payload?.email ??
      payload?.user?.email ??
      payload?.data?.email ??
      payload?.userEmail ??
      null
    );
  } catch {
    return null;
  }
}

function getRoleFromToken(token) {
  if (!token || typeof token !== "string") return null;
  const raw = token.startsWith("Bearer ") ? token.slice("Bearer ".length) : token;
  const parts = raw.split(".");
  if (parts.length < 2) return null;

  try {
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    const json = atob(padded);
    const payload = JSON.parse(json);

    return (
      payload?.role ??
      payload?.user?.role ??
      payload?.data?.role ??
      payload?.userRole ??
      null
    );
  } catch {
    return null;
  }
}

function useMyClubs(enabled) {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchClubs = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getMyClubs();
      const list = res?.data?.data ?? res?.data ?? [];
      setClubs(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to load your profile.");
      setClubs([]);
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    if (enabled) fetchClubs();
    else {
      setClubs([]);
      setError(null);
      setLoading(false);
    }
  }, [enabled, fetchClubs]);

  return { clubs, loading, error, refetch: fetchClubs };
}

function avatarUrl(name) {
  const seed = name ? encodeURIComponent(name.trim()) : "user";
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
}

function safeJsonParse(value, fallback = null) {
  if (value == null) return fallback;
  if (typeof value === "object") return value; // already parsed
  if (typeof value !== "string") return fallback;
  const s = value.trim();
  if (!s) return fallback;
  try {
    return JSON.parse(s);
  } catch {
    return fallback;
  }
}

export const StudentPassport = ({ setPage }) => {
  const { isAuthenticated, token, checkAuth } = useAuth();
  const { clubs, loading, error, refetch } = useMyClubs(isAuthenticated);
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [displayClubName, setDisplayClubName] = useState("");

  const buildProfileFormData = useCallback((payload) => {
    const fd = new FormData();

    const appendScalar = (key, value) => {
      if (value === undefined || value === null) return;
      if (typeof value === "string" && value.trim() === "") return;
      fd.append(key, value);
    };

    const appendNestedObject = (rootKey, obj) => {
      if (!obj || typeof obj !== "object") return;
      Object.entries(obj).forEach(([k, v]) => {
        if (v === undefined || v === null) return;
        if (typeof v === "string" && v.trim() === "") return;
        fd.append(`${rootKey}[${k}]`, v);
      });
    };

    const appendNestedArray = (rootKey, arr) => {
      if (!Array.isArray(arr)) return;
      arr.forEach((v, i) => {
        if (v === undefined || v === null) return;
        if (typeof v === "string" && v.trim() === "") return;
        fd.append(`${rootKey}[${i}]`, v);
      });
    };

    const p = payload || {};

    // Top-level scalars
    appendScalar("fullName", p.fullName);
    appendScalar("mobile", p.mobile);

    // File upload (logo). Backend expects key: "file"
    if (typeof File !== "undefined" && p.logo instanceof File) {
      fd.append("file", p.logo);
    }

    // Nested objects expected by backend in bracket notation (matches signup/step3 style)
    appendNestedObject("personalAndShippingAddress", p.personalAndShippingAddress);
    appendNestedObject("affiliation", p.affiliation);
    appendNestedObject("personal", p.personal);
    appendNestedObject("socialMedia", p.socialMedia);

    // additional: supports arrays
    if (p.additional && typeof p.additional === "object") {
      appendNestedArray("additional[skills]", p.additional.skills);
      appendNestedArray("additional[hobbies]", p.additional.hobbies);
    }

    // Back-compat: also send JSON blobs if backend still supports parsing strings
    // (harmless if ignored; helpful if server expects raw JSON in some deployments)
    if (p.personalAndShippingAddress) appendScalar("personalAndShippingAddress_json", JSON.stringify(p.personalAndShippingAddress));
    if (p.affiliation) appendScalar("affiliation_json", JSON.stringify(p.affiliation));
    if (p.personal) appendScalar("personal_json", JSON.stringify(p.personal));
    if (p.additional) appendScalar("additional_json", JSON.stringify(p.additional));
    if (p.socialMedia) appendScalar("socialMedia_json", JSON.stringify(p.socialMedia));

    return fd;
  }, []);
  const [profileForm, setProfileForm] = useState({
    dob: "",
    gender: "",
    fullShipingAddress: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    email: "",
    mobile: "",
    instituteName: "",
    classOrGrade: "",
    fatherName: "",
    motherName: "",
    skillsText: "",
    hobbiesText: "",
    facebook: "",
    instagram: "",
    linkedin: "",
    youtube: "",
    twitter: "",
    logoFile: null,
    logoUrl: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [profileSnapshot, setProfileSnapshot] = useState(null);

  const primaryClub = clubs?.[0];
  const tokenEmail = useMemo(() => getEmailFromToken(token), [token]);
  const tokenRole = useMemo(() => getRoleFromToken(token), [token]);
  const stripRole = tokenRole === "CLUBOWNER" ? "OWNER" : tokenRole === "MEMBER" ? "MEMBER" : null;

  const effectiveUser = useMemo(() => {
    const owner = primaryClub?.owner ?? null;
    const memberUser = primaryClub?.member?.user ?? primaryClub?.member?.user_id ?? null;

    // Architecture rule:
    // - If logged-in role is CLUBOWNER => show owner only
    // - If logged-in role is MEMBER => show member only
    if (tokenRole === "CLUBOWNER") return owner;
    if (tokenRole === "MEMBER") return memberUser;

    // Fallback if token doesn't contain role (best-effort)
    return memberUser ?? owner ?? null;
  }, [primaryClub, tokenRole]);

  const displayEmail =
    effectiveUser?.email ||
    primaryClub?.email ||
    primaryClub?.emailId ||
    tokenEmail ||
    "—";

  const [headerLogoPreviewUrl, setHeaderLogoPreviewUrl] = useState("");
  useEffect(() => {
    if (!profileForm.logoFile) {
      setHeaderLogoPreviewUrl("");
      return;
    }
    const url = URL.createObjectURL(profileForm.logoFile);
    setHeaderLogoPreviewUrl(url);
    return () => {
      try {
        URL.revokeObjectURL(url);
      } catch {
        // ignore
      }
    };
  }, [profileForm.logoFile]);

  useEffect(() => {
    // Restore last known profile (best-effort) for fields not present in club API.
    if (!isAuthenticated) return;
    try {
      const raw = localStorage.getItem("worso.profile.snapshot");
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        setProfileSnapshot(parsed);
      }
    } catch {
      // ignore
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const snap = profileSnapshot;
    if (!snap) return;
    setDisplayName((prev) => prev || snap.fullName || "");
    setProfileForm((prev) => ({
      ...prev,
      dob: snap?.personalAndShippingAddress?.dob ?? prev.dob,
      gender: snap?.personalAndShippingAddress?.gender ?? prev.gender,
      fullShipingAddress: snap?.personalAndShippingAddress?.fullShipingAddress ?? prev.fullShipingAddress,
      city: snap?.personalAndShippingAddress?.city ?? prev.city,
      state: snap?.personalAndShippingAddress?.state ?? prev.state,
      pincode: snap?.personalAndShippingAddress?.pincode ?? prev.pincode,
      country: snap?.personalAndShippingAddress?.country ?? prev.country,
      email: snap?.personalAndShippingAddress?.alternateEmail ?? prev.email,
      mobile: snap?.mobile ?? prev.mobile,
      instituteName: snap?.affiliation?.schoolOrCollege ?? prev.instituteName,
      classOrGrade: snap?.affiliation?.classOrGrade ?? prev.classOrGrade,
      fatherName: snap?.personal?.fatherName ?? prev.fatherName,
      motherName: snap?.personal?.motherName ?? prev.motherName,
      skillsText: Array.isArray(snap?.additional?.skills) ? snap.additional.skills.join(", ") : prev.skillsText,
      hobbiesText: Array.isArray(snap?.additional?.hobbies) ? snap.additional.hobbies.join(", ") : prev.hobbiesText,
      facebook: snap?.socialMedia?.facebook ?? prev.facebook,
      instagram: snap?.socialMedia?.instagram ?? prev.instagram,
      linkedin: snap?.socialMedia?.linkedin ?? prev.linkedin,
      youtube: snap?.socialMedia?.youtube ?? prev.youtube,
      twitter: snap?.socialMedia?.twitter ?? prev.twitter,
      logoUrl: snap?.logo ?? prev.logoUrl,
    }));
  }, [profileSnapshot]);

  useEffect(() => {
    if (primaryClub) {
      const user = effectiveUser ?? null;
      const userPersonalAndShippingAddress = safeJsonParse(user?.personalAndShippingAddress, {});
      const userAffiliation = safeJsonParse(user?.affiliation, {});
      const userPersonal = safeJsonParse(user?.personal, {});
      const userAdditional = safeJsonParse(user?.additional, {});
      const userSocialMedia = safeJsonParse(user?.socialMedia, {});

      setDisplayName(user?.fullName || user?.fullname || primaryClub.name || "");
      setDisplayClubName(primaryClub.clubName || "");
      setProfileForm((prev) => ({
        ...prev,
        // User profile (prefer member.user, fallback owner). Backend may send nested objects or JSON strings.
        dob: userPersonalAndShippingAddress?.dob ?? prev.dob,
        gender: userPersonalAndShippingAddress?.gender ?? prev.gender,
        fullShipingAddress: userPersonalAndShippingAddress?.fullShipingAddress ?? prev.fullShipingAddress,
        pincode: userPersonalAndShippingAddress?.pincode ?? prev.pincode,
        classOrGrade: userAffiliation?.classOrGrade ?? prev.classOrGrade,
        fatherName: userPersonal?.fatherName ?? prev.fatherName,
        motherName: userPersonal?.motherName ?? prev.motherName,
        skillsText: Array.isArray(userAdditional?.skills) ? userAdditional.skills.join(", ") : prev.skillsText,
        hobbiesText: Array.isArray(userAdditional?.hobbies) ? userAdditional.hobbies.join(", ") : prev.hobbiesText,
        facebook: userSocialMedia?.facebook ?? prev.facebook,
        instagram: userSocialMedia?.instagram ?? prev.instagram,
        linkedin: userSocialMedia?.linkedin ?? prev.linkedin,
        youtube: userSocialMedia?.youtube ?? prev.youtube,
        twitter: userSocialMedia?.twitter ?? prev.twitter,
        logoUrl: user?.logo ?? prev.logoUrl,

        // Club fields (top-level club)
        city: primaryClub?.city || primaryClub?.address?.city || prev.city,
        state: primaryClub?.state || primaryClub?.address?.state || prev.state,
        country: primaryClub?.country || primaryClub?.address?.country || prev.country,
        mobile: user?.mobile || user?.mobileNo || primaryClub?.mobile || primaryClub?.phone || prev.mobile,
        email: userPersonalAndShippingAddress?.alternateEmail || user?.email || primaryClub?.alternateEmail || primaryClub?.email || prev.email,
        instituteName:
          primaryClub?.instituteName ||
          primaryClub?.schoolOrCollege ||
          userAffiliation?.schoolOrCollege ||
          prev.instituteName,
      }));
    } else if (!loading && !error) {
      setDisplayName(INITIAL_DB.currentUser.full_name || "");
      setDisplayClubName(INITIAL_DB.club?.name ?? "");
    }
  }, [primaryClub, effectiveUser, loading, error]);

  const handleProfileField = (key) => (e) => {
    const value = e?.target?.value ?? "";
    setProfileForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleLogoChange = (e) => {
    const file = e?.target?.files?.[0] ?? null;
    setProfileForm((prev) => ({
      ...prev,
      logoFile: file,
    }));
  };

  const handleSaveProfile = async () => {
    if (!primaryClub?._id) {
      setSaveError("No club found to update");
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      const updateData = {};
      
      // Only include fields that have changed
      if (displayName !== primaryClub.name) {
        updateData.name = displayName;
      }
      if (displayClubName !== primaryClub.clubName) {
        updateData.clubName = displayClubName;
      }

      const email = profileForm.email.trim();
      const mobile = profileForm.mobile.trim();
      const isValidEmail = !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!isValidEmail) {
        setSaveError("Please enter a valid email address.");
        return;
      }
      if (mobile && /[^\d+\s-]/.test(mobile)) {
        setSaveError("Mobile number contains invalid characters.");
        return;
      }

      const profilePayload = {
        fullName: displayName?.trim() || undefined,
        mobile: mobile || undefined,
        personalAndShippingAddress: {
          dob: profileForm.dob?.trim() || undefined,
          gender: profileForm.gender?.trim() || undefined,
          fullShipingAddress: profileForm.fullShipingAddress?.trim() || undefined,
          city: profileForm.city.trim() || undefined,
          state: profileForm.state.trim() || undefined,
          pincode: profileForm.pincode?.trim() || undefined,
          country: profileForm.country.trim() || undefined,
          alternateEmail: email || undefined,
        },
        affiliation: {
          schoolOrCollege: profileForm.instituteName.trim() || undefined,
          classOrGrade: profileForm.classOrGrade?.trim() || undefined,
        },
        personal: {
          fatherName: profileForm.fatherName?.trim() || undefined,
          motherName: profileForm.motherName?.trim() || undefined,
        },
        additional: {
          skills: profileForm.skillsText
            ? profileForm.skillsText.split(",").map((s) => s.trim()).filter(Boolean)
            : undefined,
          hobbies: profileForm.hobbiesText
            ? profileForm.hobbiesText.split(",").map((s) => s.trim()).filter(Boolean)
            : undefined,
        },
        socialMedia: {
          facebook: profileForm.facebook?.trim() || undefined,
          instagram: profileForm.instagram?.trim() || undefined,
          linkedin: profileForm.linkedin?.trim() || undefined,
          youtube: profileForm.youtube?.trim() || undefined,
          twitter: profileForm.twitter?.trim() || undefined,
        },
      };
      if (profileForm.logoFile) {
        profilePayload.logo = profileForm.logoFile;
      }

      const tasks = [];
      if (Object.keys(updateData).length > 0) {
        tasks.push(updateClub(primaryClub._id, updateData));
      }
      // Update profile even if club didn't change; backend can ignore undefineds.
      const profileFormData = buildProfileFormData(profilePayload);
      const results = await Promise.all([...tasks, updateProfileApi(profileFormData)]);

      // If backend returns updated profile, sync UI from it (best-effort).
      const profileRes = results?.[results.length - 1]?.data?.data ?? results?.[results.length - 1]?.data;
      if (profileRes) {
        setProfileSnapshot(profileRes);
        try {
          localStorage.setItem("worso.profile.snapshot", JSON.stringify(profileRes));
        } catch {
          // ignore
        }
        setDisplayName(profileRes.fullName ?? displayName);
        setProfileForm((prev) => ({
          ...prev,
          dob: profileRes?.personalAndShippingAddress?.dob ?? prev.dob,
          gender: profileRes?.personalAndShippingAddress?.gender ?? prev.gender,
          fullShipingAddress: profileRes?.personalAndShippingAddress?.fullShipingAddress ?? prev.fullShipingAddress,
          city: profileRes?.personalAndShippingAddress?.city ?? prev.city,
          state: profileRes?.personalAndShippingAddress?.state ?? prev.state,
          pincode: profileRes?.personalAndShippingAddress?.pincode ?? prev.pincode,
          country: profileRes?.personalAndShippingAddress?.country ?? prev.country,
          email: profileRes?.personalAndShippingAddress?.alternateEmail ?? prev.email,
          mobile: profileRes?.mobile ?? prev.mobile,
          instituteName: profileRes?.affiliation?.schoolOrCollege ?? prev.instituteName,
          classOrGrade: profileRes?.affiliation?.classOrGrade ?? prev.classOrGrade,
          fatherName: profileRes?.personal?.fatherName ?? prev.fatherName,
          motherName: profileRes?.personal?.motherName ?? prev.motherName,
          skillsText: Array.isArray(profileRes?.additional?.skills) ? profileRes.additional.skills.join(", ") : prev.skillsText,
          hobbiesText: Array.isArray(profileRes?.additional?.hobbies) ? profileRes.additional.hobbies.join(", ") : prev.hobbiesText,
          facebook: profileRes?.socialMedia?.facebook ?? prev.facebook,
          instagram: profileRes?.socialMedia?.instagram ?? prev.instagram,
          linkedin: profileRes?.socialMedia?.linkedin ?? prev.linkedin,
          youtube: profileRes?.socialMedia?.youtube ?? prev.youtube,
          twitter: profileRes?.socialMedia?.twitter ?? prev.twitter,
          logoUrl: profileRes?.logo ?? prev.logoUrl,
          logoFile: null,
        }));
      }

      // Refresh clubs list to get updated data
      await refetch();

      setIsEditing(false);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to update club";
      setSaveError(errorMessage);
      console.error("Error updating club:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "TechnoXian RoboClub Profile",
        text: `${displayName} - Captain, ${displayClubName}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
    }
  };

  return (
    <div className="p-6 animate-fadeIn max-w-4xl mx-auto">
      <button
        onClick={() => setPage("dashboard")}
        className="text-slate-500 text-sm mb-4 hover:text-white flex items-center gap-1"
      >
        ← Back
      </button>

      {/* Not authenticated */}
      {!isAuthenticated && (
        <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center mx-auto mb-4">
            <Shield className="text-slate-400" size={32} />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Sign in to view your profile</h2>
          <p className="text-slate-400 text-sm mb-6 max-w-sm mx-auto">
            Use your email and OTP to sign in, or register a new RoboClub.
          </p>
          <button
            onClick={() => {
              setPage("home");
              checkAuth();
            }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg transition-colors"
          >
            <LogIn size={18} />
            Go to sign in / Register
          </button>
        </div>
      )}

      {/* Authenticated: loading */}
      {isAuthenticated && loading && (
        <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden p-12 text-center">
          <Loader2 className="w-10 h-10 text-cyan-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading your profile…</p>
        </div>
      )}

      {/* Authenticated: error */}
      {isAuthenticated && !loading && error && (
        <div className="bg-slate-900 border border-red-900/50 rounded-xl overflow-hidden p-8">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={refetch}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm"
          >
            Retry
          </button>
        </div>
      )}

      {/* Authenticated: profile UI (matches provided design) */}
      {isAuthenticated && !loading && !error && (
        <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
          {/* Header strip */}
          <div className="h-32 bg-gradient-to-r from-blue-900 to-slate-900" />

          {/* User info block */}
          <div className="px-6 md:px-8 pb-8 -mt-12">
            <div className="flex flex-wrap justify-between items-end gap-4">
              <div className="flex items-end gap-4">
                <img
                  src={
                    headerLogoPreviewUrl ||
                    profileForm.logoUrl ||
                    avatarUrl(displayName || primaryClub?.name)
                  }
                  alt="Profile"
                  className="w-24 h-24 rounded-xl border-4 border-slate-900 bg-slate-800 object-cover"
                />
                <div className="mb-1">
                  {isEditing ? (
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Your name"
                      className="bg-slate-800 text-white border border-slate-600 rounded px-3 py-2 w-full min-w-[200px] outline-none focus:border-cyan-500"
                    />
                  ) : (
                    <>
                      <h1 className="text-2xl font-black text-white uppercase tracking-tight">
                        {displayName || primaryClub?.name || "Member"}
                      </h1>
                    </>
                  )}
                  <div className="mt-1 flex items-center gap-2 text-slate-400 text-sm min-w-0">
                    <Mail size={14} className="text-slate-500 shrink-0" />
                    <span className="truncate" title={displayEmail}>
                      {displayEmail}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
              {stripRole && (
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wider border self-start ${
                    stripRole === "OWNER"
                      ? "bg-amber-500/15 text-amber-300 border-amber-600/40"
                      : "bg-emerald-500/15 text-emerald-300 border-emerald-600/40"
                  }`}
                  title={stripRole}
                >
                  {stripRole}
                </span>
              )}
              <button
                onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)}
                disabled={isSaving}
                className="bg-slate-800 p-2.5 rounded-lg border border-slate-600 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title={isEditing ? "Save" : "Edit"}
              >
                {isSaving ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Edit2 size={18} />
                )}
              </button>
              {isEditing && (
                <button
                  onClick={() => {
                    setDisplayName(primaryClub?.name ?? "");
                    setDisplayClubName(primaryClub?.clubName ?? "");
                    setProfileForm({
                      dob: profileSnapshot?.personalAndShippingAddress?.dob ?? "",
                      gender: profileSnapshot?.personalAndShippingAddress?.gender ?? "",
                      fullShipingAddress: profileSnapshot?.personalAndShippingAddress?.fullShipingAddress ?? "",
                      city: primaryClub?.city || primaryClub?.address?.city || "",
                      state: primaryClub?.state || primaryClub?.address?.state || "",
                      pincode: profileSnapshot?.personalAndShippingAddress?.pincode ?? "",
                      country: primaryClub?.country || primaryClub?.address?.country || "",
                      email: primaryClub?.alternateEmail || primaryClub?.email || "",
                      mobile: primaryClub?.mobile || primaryClub?.phone || "",
                      instituteName: primaryClub?.instituteName || primaryClub?.schoolOrCollege || "",
                      classOrGrade: profileSnapshot?.affiliation?.classOrGrade ?? "",
                      fatherName: profileSnapshot?.personal?.fatherName ?? "",
                      motherName: profileSnapshot?.personal?.motherName ?? "",
                      skillsText: Array.isArray(profileSnapshot?.additional?.skills) ? profileSnapshot.additional.skills.join(", ") : "",
                      hobbiesText: Array.isArray(profileSnapshot?.additional?.hobbies) ? profileSnapshot.additional.hobbies.join(", ") : "",
                      facebook: profileSnapshot?.socialMedia?.facebook ?? "",
                      instagram: profileSnapshot?.socialMedia?.instagram ?? "",
                      linkedin: profileSnapshot?.socialMedia?.linkedin ?? "",
                      youtube: profileSnapshot?.socialMedia?.youtube ?? "",
                      twitter: profileSnapshot?.socialMedia?.twitter ?? "",
                      logoFile: null,
                      logoUrl: profileSnapshot?.logo ?? "",
                    });
                    setIsEditing(false);
                    setSaveError(null);
                  }}
                  disabled={isSaving}
                  className="bg-slate-800 p-2.5 rounded-lg border border-slate-600 hover:bg-red-900/30 text-slate-300 hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Cancel"
                >
                  Cancel
                </button>
              )}
              {/* <button
                onClick={handleShare}
                className="bg-slate-800 p-2.5 rounded-lg border border-slate-600 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                title="Share profile"
              >
                <Share2 size={18} />
              </button> */}
            </div>
            </div>
            {isEditing && saveError && (
              <div className="mt-3 px-3 py-2 bg-red-900/20 border border-red-900/50 rounded-lg">
                <p className="text-red-400 text-sm">{saveError}</p>
              </div>
            )}
          </div>

          {/* Editable profile fields */}
          <div className="px-6 md:px-8 py-6 border-t border-slate-800">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-800/40 border border-slate-700 rounded-lg p-4 md:col-span-2">
                <div className="flex items-center justify-between gap-3 flex-wrap mb-2">
                  <div className="text-slate-300 text-sm font-semibold flex items-center gap-2">
                    <UserCheck size={16} className="text-slate-500" />
                    User Profile
                  </div>
                  {/* {(profileForm.logoUrl || profileForm.logoFile) && (
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span>Logo preview</span>
                      <img
                        src={profileForm.logoFile ? URL.createObjectURL(profileForm.logoFile) : profileForm.logoUrl}
                        alt="Logo"
                        className="w-9 h-9 rounded-md border border-slate-700 object-cover bg-slate-800"
                      />
                    </div>
                  )} */}
                </div>
                {isEditing ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <input
                      type="date"
                      value={profileForm.dob}
                      onChange={handleProfileField("dob")}
                      className="w-full bg-slate-800 text-white border border-slate-600 rounded px-3 py-2 outline-none focus:border-cyan-500"
                    />
                    <select
                      value={profileForm.gender}
                      onChange={handleProfileField("gender")}
                      className="w-full bg-slate-800 text-white border border-slate-600 rounded px-3 py-2 outline-none focus:border-cyan-500"
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    <input
                      value={profileForm.pincode}
                      onChange={handleProfileField("pincode")}
                      placeholder="Pincode"
                      className="w-full bg-slate-800 text-white border border-slate-600 rounded px-3 py-2 outline-none focus:border-cyan-500"
                    />
                    <input
                      value={profileForm.fullShipingAddress}
                      onChange={handleProfileField("fullShipingAddress")}
                      placeholder="Full shipping address"
                      className="w-full sm:col-span-2 lg:col-span-3 bg-slate-800 text-white border border-slate-600 rounded px-3 py-2 outline-none focus:border-cyan-500"
                    />
                    <input
                      value={profileForm.classOrGrade}
                      onChange={handleProfileField("classOrGrade")}
                      placeholder="Class / Grade"
                      className="w-full bg-slate-800 text-white border border-slate-600 rounded px-3 py-2 outline-none focus:border-cyan-500"
                    />
                    <input
                      value={profileForm.fatherName}
                      onChange={handleProfileField("fatherName")}
                      placeholder="Father name"
                      className="w-full bg-slate-800 text-white border border-slate-600 rounded px-3 py-2 outline-none focus:border-cyan-500"
                    />
                    <input
                      value={profileForm.motherName}
                      onChange={handleProfileField("motherName")}
                      placeholder="Mother name"
                      className="w-full bg-slate-800 text-white border border-slate-600 rounded px-3 py-2 outline-none focus:border-cyan-500"
                    />
                    <input
                      value={profileForm.skillsText}
                      onChange={handleProfileField("skillsText")}
                      placeholder="Skills (comma separated)"
                      className="w-full sm:col-span-2 lg:col-span-3 bg-slate-800 text-white border border-slate-600 rounded px-3 py-2 outline-none focus:border-cyan-500"
                    />
                    <input
                      value={profileForm.hobbiesText}
                      onChange={handleProfileField("hobbiesText")}
                      placeholder="Hobbies (comma separated)"
                      className="w-full sm:col-span-2 lg:col-span-3 bg-slate-800 text-white border border-slate-600 rounded px-3 py-2 outline-none focus:border-cyan-500"
                    />
                    <div className="sm:col-span-2 lg:col-span-3">
                      <label className="block text-xs text-slate-400 mb-1">Logo (optional)</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="w-full bg-slate-800 text-slate-200 border border-slate-600 rounded px-3 py-2 outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                    <div className="text-slate-300">
                      <span className="text-slate-500">DOB:</span> {profileForm.dob || "—"}
                    </div>
                    <div className="text-slate-300">
                      <span className="text-slate-500">Gender:</span> {profileForm.gender || "—"}
                    </div>
                    <div className="text-slate-300">
                      <span className="text-slate-500">Pincode:</span> {profileForm.pincode || "—"}
                    </div>
                    <div className="text-slate-300 sm:col-span-2 lg:col-span-3">
                      <span className="text-slate-500">Address:</span> {profileForm.fullShipingAddress || "—"}
                    </div>
                    <div className="text-slate-300">
                      <span className="text-slate-500">Class/Grade:</span> {profileForm.classOrGrade || "—"}
                    </div>
                    <div className="text-slate-300">
                      <span className="text-slate-500">Father:</span> {profileForm.fatherName || "—"}
                    </div>
                    <div className="text-slate-300">
                      <span className="text-slate-500">Mother:</span> {profileForm.motherName || "—"}
                    </div>
                    <div className="text-slate-300 sm:col-span-2 lg:col-span-3">
                      <span className="text-slate-500">Skills:</span> {profileForm.skillsText || "—"}
                    </div>
                    <div className="text-slate-300 sm:col-span-2 lg:col-span-3">
                      <span className="text-slate-500">Hobbies:</span> {profileForm.hobbiesText || "—"}
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-slate-800/40 border border-slate-700 rounded-lg p-4 md:col-span-2">
                <div className="flex items-center gap-2 mb-2 text-slate-300">
                  <Share2 size={16} className="text-slate-500" />
                  <span className="text-sm font-semibold">Social Links</span>
                </div>
                {isEditing ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      value={profileForm.facebook}
                      onChange={handleProfileField("facebook")}
                      placeholder="Facebook URL"
                      className="w-full bg-slate-800 text-white border border-slate-600 rounded px-3 py-2 outline-none focus:border-cyan-500"
                    />
                    <input
                      value={profileForm.instagram}
                      onChange={handleProfileField("instagram")}
                      placeholder="Instagram URL"
                      className="w-full bg-slate-800 text-white border border-slate-600 rounded px-3 py-2 outline-none focus:border-cyan-500"
                    />
                    <input
                      value={profileForm.linkedin}
                      onChange={handleProfileField("linkedin")}
                      placeholder="LinkedIn URL"
                      className="w-full bg-slate-800 text-white border border-slate-600 rounded px-3 py-2 outline-none focus:border-cyan-500"
                    />
                    <input
                      value={profileForm.youtube}
                      onChange={handleProfileField("youtube")}
                      placeholder="YouTube URL"
                      className="w-full bg-slate-800 text-white border border-slate-600 rounded px-3 py-2 outline-none focus:border-cyan-500"
                    />
                    <input
                      value={profileForm.twitter}
                      onChange={handleProfileField("twitter")}
                      placeholder="Twitter/X URL"
                      className="w-full bg-slate-800 text-white border border-slate-600 rounded px-3 py-2 outline-none focus:border-cyan-500"
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-300">
                    <div><span className="text-slate-500">Facebook:</span> {profileForm.facebook || "—"}</div>
                    <div><span className="text-slate-500">Instagram:</span> {profileForm.instagram || "—"}</div>
                    <div><span className="text-slate-500">LinkedIn:</span> {profileForm.linkedin || "—"}</div>
                    <div><span className="text-slate-500">YouTube:</span> {profileForm.youtube || "—"}</div>
                    <div><span className="text-slate-500">Twitter:</span> {profileForm.twitter || "—"}</div>
                  </div>
                )}
              </div>

              <div className="bg-slate-800/40 border border-slate-700 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2 text-slate-300">
                  <Phone size={16} className="text-slate-500" />
                  <span className="text-sm font-semibold">Mobile</span>
                </div>
                {isEditing ? (
                  <input
                    value={profileForm.mobile}
                    onChange={handleProfileField("mobile")}
                    placeholder="Enter mobile number"
                    className="w-full bg-slate-800 text-white border border-slate-600 rounded px-3 py-2 outline-none focus:border-cyan-500"
                  />
                ) : (
                  <p className="text-sm text-white">{profileForm.mobile || "—"}</p>
                )}
              </div>

              <div className="bg-slate-800/40 border border-slate-700 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2 text-slate-300">
                  <Mail size={16} className="text-slate-500" />
                  <span className="text-sm font-semibold">Email</span>
                </div>
                {isEditing ? (
                  <input
                    value={profileForm.email}
                    onChange={handleProfileField("email")}
                    placeholder="Enter email"
                    className="w-full bg-slate-800 text-white border border-slate-600 rounded px-3 py-2 outline-none focus:border-cyan-500"
                  />
                ) : (
                  <p className="text-sm text-white">{profileForm.email || displayEmail || "—"}</p>
                )}
              </div>

              <div className="bg-slate-800/40 border border-slate-700 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2 text-slate-300">
                  <Building2 size={16} className="text-slate-500" />
                  <span className="text-sm font-semibold">Institute Name</span>
                </div>
                {isEditing ? (
                  <input
                    value={profileForm.instituteName}
                    onChange={handleProfileField("instituteName")}
                    placeholder="Enter institute name"
                    className="w-full bg-slate-800 text-white border border-slate-600 rounded px-3 py-2 outline-none focus:border-cyan-500"
                  />
                ) : (
                  <p className="text-sm text-white">{profileForm.instituteName || "—"}</p>
                )}
              </div>

              <div className="bg-slate-800/40 border border-slate-700 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2 text-slate-300">
                  <MapPin size={16} className="text-slate-500" />
                  <span className="text-sm font-semibold">Location</span>
                </div>
                {isEditing ? (
                  <div className="grid grid-cols-1 gap-2">
                    <input
                      value={profileForm.city}
                      onChange={handleProfileField("city")}
                      placeholder="City"
                      className="w-full bg-slate-800 text-white border border-slate-600 rounded px-3 py-2 outline-none focus:border-cyan-500"
                    />
                    <input
                      value={profileForm.state}
                      onChange={handleProfileField("state")}
                      placeholder="State"
                      className="w-full bg-slate-800 text-white border border-slate-600 rounded px-3 py-2 outline-none focus:border-cyan-500"
                    />
                    <input
                      value={profileForm.country}
                      onChange={handleProfileField("country")}
                      placeholder="Country"
                      className="w-full bg-slate-800 text-white border border-slate-600 rounded px-3 py-2 outline-none focus:border-cyan-500"
                    />
                  </div>
                ) : (
                  <p className="text-sm text-white">
                    {[profileForm.city, profileForm.state, profileForm.country].filter(Boolean).join(", ") || "—"}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="px-6 md:px-8 py-6 border-t border-slate-800">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 text-center">
                <p className="text-xs text-slate-500 uppercase font-bold">Matches</p>
                <p className="text-2xl font-mono font-bold text-white mt-1">
                  {/* {DEFAULT_STATS.matches ?? 0} */}
                  0
                </p>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 text-center">
                <p className="text-xs text-slate-500 uppercase font-bold">Gold</p>
                <p className="text-2xl font-mono font-bold text-amber-400 mt-1">
                  {/* {DEFAULT_STATS.golds ?? 0} */}
                  0
                </p>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 text-center">
                <p className="text-xs text-slate-500 uppercase font-bold">Silver</p>
                <p className="text-2xl font-mono font-bold text-slate-300 mt-1">
                  {/* {DEFAULT_STATS.silvers ?? 0} */}
                  0
                </p>
              </div>
            </div>
          </div>

          {/* Career history */}
          <div className="px-6 md:px-8 py-6 border-t border-slate-800">
            {/* <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Career History
            </h3> */}
            <ul className="space-y-4">
              {DEFAULT_CAREER.map((entry, i) => (
                <li key={i} className="flex items-start gap-3">
                  {/* <div className="mt-0.5 shrink-0">
                    {entry.type === "winner" ? (
                      <Trophy size={18} className="text-amber-400" />
                    ) : (
                      <Activity size={18} className="text-slate-500" />
                    )}
                  </div> */}
                  {/* <div>
                    <p className="text-white font-semibold text-sm">{entry.title}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{entry.subtitle}</p>
                  </div> */}
                </li>
              ))}
            </ul> 
          </div>

          {/* Certificates (blockchain verified) */}
          {/* <div className="px-6 md:px-8 py-6 border-t border-slate-800">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Certificates (Blockchain Verified)
            </h3>
            <div className="flex flex-wrap gap-4">
              {DEFAULT_CERTIFICATES.map((cert) => (
                <div
                  key={cert.id}
                  className="flex items-center gap-3 bg-slate-800/50 border border-slate-700 rounded-lg p-4 min-w-0 hover:border-slate-600 transition-colors cursor-pointer"
                >
                  <Award className="text-cyan-500 shrink-0" size={24} />
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white truncate">{cert.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {cert.date} • #{cert.id}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div> */}

          {/* Optional: other clubs from api/club/my/get */}
          {clubs.length > 1 && (
            <div className="px-6 md:px-8 py-6 border-t border-slate-800">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
                Other clubs
              </h3>
              <div className="flex flex-wrap gap-2">
                {clubs.slice(1, 5).map((club) => (
                  <span
                    key={club._id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-sm"
                  >
                    <Building2 size={14} />
                    {club.clubName}
                    {club.clubCode && (
                      <span className="text-slate-500 text-xs">({club.clubCode})</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
