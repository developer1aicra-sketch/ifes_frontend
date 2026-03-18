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

export const StudentPassport = ({ setPage }) => {
  const { isAuthenticated, token, checkAuth } = useAuth();
  const { clubs, loading, error, refetch } = useMyClubs(isAuthenticated);
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [displayClubName, setDisplayClubName] = useState("");
  const [profileForm, setProfileForm] = useState({
    city: "",
    state: "",
    country: "",
    email: "",
    mobile: "",
    instituteName: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const primaryClub = clubs?.[0];
  const tokenEmail = useMemo(() => getEmailFromToken(token), [token]);
  const displayEmail =
    primaryClub?.email ||
    primaryClub?.emailId ||
    primaryClub?.user?.email ||
    primaryClub?.user_id?.email ||
    tokenEmail ||
    "—";

  useEffect(() => {
    if (primaryClub) {
      setDisplayName(primaryClub.name || "");
      setDisplayClubName(primaryClub.clubName || "");
      setProfileForm((prev) => ({
        ...prev,
        city: primaryClub?.city || primaryClub?.address?.city || prev.city,
        state: primaryClub?.state || primaryClub?.address?.state || prev.state,
        country: primaryClub?.country || primaryClub?.address?.country || prev.country,
        mobile: primaryClub?.mobile || primaryClub?.phone || prev.mobile,
        email: primaryClub?.alternateEmail || primaryClub?.email || prev.email,
        instituteName: primaryClub?.instituteName || primaryClub?.schoolOrCollege || prev.instituteName,
      }));
    } else if (!loading && !error) {
      setDisplayName(INITIAL_DB.currentUser.full_name || "");
      setDisplayClubName(INITIAL_DB.club?.name ?? "");
    }
  }, [primaryClub, loading, error]);

  const handleProfileField = (key) => (e) => {
    const value = e?.target?.value ?? "";
    setProfileForm((prev) => ({ ...prev, [key]: value }));
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
        mobile: mobile || undefined,
        personalAndShippingAddress: {
          city: profileForm.city.trim() || undefined,
          state: profileForm.state.trim() || undefined,
          country: profileForm.country.trim() || undefined,
          alternateEmail: email || undefined,
        },
        affiliation: {
          schoolOrCollege: profileForm.instituteName.trim() || undefined,
        },
      };

      const tasks = [];
      if (Object.keys(updateData).length > 0) {
        tasks.push(updateClub(primaryClub._id, updateData));
      }
      // Update profile even if club didn't change; backend can ignore undefineds.
      tasks.push(updateProfileApi(profilePayload));
      await Promise.all(tasks);

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
                  src={avatarUrl(displayName || primaryClub?.name)}
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
                      city: primaryClub?.city || primaryClub?.address?.city || "",
                      state: primaryClub?.state || primaryClub?.address?.state || "",
                      country: primaryClub?.country || primaryClub?.address?.country || "",
                      email: primaryClub?.alternateEmail || primaryClub?.email || "",
                      mobile: primaryClub?.mobile || primaryClub?.phone || "",
                      instituteName: primaryClub?.instituteName || primaryClub?.schoolOrCollege || "",
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
              <button
                onClick={handleShare}
                className="bg-slate-800 p-2.5 rounded-lg border border-slate-600 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                title="Share profile"
              >
                <Share2 size={18} />
              </button>
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
