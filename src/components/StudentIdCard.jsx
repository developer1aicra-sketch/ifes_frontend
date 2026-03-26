import React, { useEffect, useMemo, useState } from "react";
import { BadgeCheck, QrCode, Award, Shield, Loader2, AlertTriangle } from "lucide-react";
import { getMyMembership } from "../api/membershipApi";
import { INITIAL_DB } from "../constants/userData";

function safeUpper(value) {
  return String(value || "").trim().toUpperCase();
}

function getFullNameFromToken() {
  try {
    if (typeof window === "undefined") return null;
    const token = localStorage.getItem("token");
    if (!token) return null;
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const payloadJson = atob(base64);
    const payload = JSON.parse(payloadJson);
    return (
      payload.full_name ||
      payload.name ||
      (payload.user && (payload.user.full_name || payload.user.name)) ||
      null
    );
  } catch {
    return null;
  }
}

function formatValidUpto(value) {
  if (!value) return "—";
  try {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "—";
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yy = String(d.getFullYear()).slice(-2);
    return `${mm}/${yy}`;
  } catch {
    return "—";
  }
}

function formatDate(value) {
  if (!value) return "—";
  try {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  } catch {
    return "—";
  }
}

export function StudentIdCard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getMyMembership();
        const payload = res?.data;
        const membership = payload?.data ?? payload;
        if (!cancelled) {
          setData(membership || null);
        }
      } catch (err) {
        if (cancelled) return;
        const message =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load student ID details.";
        setError(message);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, []);

  const normalized = useMemo(() => {
    if (!data) return null;
    const category = data.category || "Member";
    return {
      publicMembershipId: data.publicMembershipId,
      category,
      planTitle: data.planTitle,
      planName: data.planName,
      status: safeUpper(data.status),
      paymentStatus: safeUpper(data.paymentStatus),
      startDate: data.startDate,
      endDate: data.endDate,
      createdAt: data.createdAt,
    };
  }, [data]);

  const fullName = getFullNameFromToken() || INITIAL_DB.currentUser.full_name;
  const clubName = INITIAL_DB.club?.name ?? "Technoxian RoboClub";

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto flex items-center justify-center bg-slate-900 border border-slate-800 rounded-2xl p-8">
        <Loader2 className="w-6 h-6 text-cyan-400 animate-spin mr-3" />
        <p className="text-sm text-slate-300">Loading your student ID…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto bg-rose-950/40 border border-rose-700/70 rounded-2xl p-5 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-rose-400 mt-0.5" />
        <div>
          <p className="text-sm text-rose-100 font-semibold">
            Unable to load student ID
          </p>
          <p className="text-xs text-rose-200/80 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (!normalized) {
    return (
      <div className="max-w-3xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-2">
        <p className="text-sm text-slate-100 font-semibold">
          No active membership found.
        </p>
        <p className="text-xs text-slate-400">
          Once your WORSO Student Membership is active, your digital ID card and
          verification QR will appear here.
        </p>
      </div>
    );
  }

  const isStudentBasic = normalized.planName === "Student Basic";
  const memberTypeText = `${safeUpper(normalized.category)} MEMBER`;
  const memberTypeCompact = memberTypeText.length > 16 ? "MEMBER" : memberTypeText;
  const idDigits = (normalized.publicMembershipId || "")
    .replace(/[^0-9]/g, "")
    .slice(-10)
    .padStart(10, "0");
  const cardNumberTop = idDigits.slice(0, 4) || "0000";
  const cardNumberBottom = `${idDigits.slice(4, 6) || "00"} ${idDigits.slice(6, 8) || "00"} ${idDigits.slice(8, 10) || "00"}`;

  // If membership is Student Basic, show a simplified summary instead of full digital card
  if (isStudentBasic) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
            <BadgeCheck size={20} />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white">
              WORSO Student Membership
            </h1>
            <p className="text-sm text-slate-400">
              Your <span className="font-semibold">Student Basic</span> membership is active.
            </p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                Member
              </p>
              <p className="text-sm font-semibold text-slate-100">
                {fullName}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                Plan
              </p>
              <p className="text-sm font-semibold text-slate-100">
                {normalized.planName}
              </p>
              {normalized.planTitle && (
                <p className="text-xs text-slate-400">{normalized.planTitle}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-slate-800 pt-4 mt-2 text-sm">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                Status
              </p>
              <p className="mt-1 text-emerald-300 font-semibold">
                {normalized.status || "ACTIVE"}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                Validity
              </p>
              <p className="mt-1 text-slate-200">
                {formatDate(normalized.startDate)} — {formatDate(normalized.endDate)}
              </p>
            </div>
          </div>

          <div className="mt-3 text-xs text-slate-400">
            Upgrade to{" "}
            <span className="font-semibold text-slate-100">
              Student Premium
            </span>{" "}
            to unlock your full digital ID card with QR verification and advanced
            membership benefits.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-400/40 flex items-center justify-center text-indigo-300">
          <BadgeCheck size={20} />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white">
            WORSO Membership Card
          </h1>
          <p className="text-sm text-slate-400">
            Your personalized WORSO card with membership details and validity.
          </p>
        </div>
      </div>

      <div className="w-full flex flex-col items-center px-0 sm:px-2">
        <section
          className="group relative w-full max-w-md aspect-[1.5/1] overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-600 via-purple-700 to-slate-900 px-4 pt-4 pb-5 sm:px-6 sm:pt-6 sm:pb-7 md:px-8 md:pt-8 md:pb-9 shadow-2xl text-white transition-all duration-500 hover:scale-[1.02] hover:shadow-indigo-500/20"
          aria-label="Membership card"
        >
          <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px] pointer-events-none" aria-hidden />
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-blue-400/20 blur-[80px] transition-all group-hover:bg-blue-400/30 pointer-events-none" aria-hidden />

          <div className="relative flex h-full flex-col justify-between">
            {/* Top: branding + club */}
            <div className="flex flex-shrink-0 items-start justify-between gap-3">
              <div className="space-y-0.5 min-w-0">
                <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] text-indigo-200/80">
                  {normalized.category || "Premium"} Member
                </p>
                <p className="text-lg sm:text-xl md:text-2xl font-black italic tracking-tighter text-white/95">
                  WORSO<span className="text-indigo-300">CARD</span>
                </p>
                <p className="text-[10px] sm:text-xs text-indigo-100/70 truncate">
                  {clubName}
                </p>
              </div>
              <div
                className="relative flex-shrink-0 rounded-xl overflow-hidden border border-white/25 bg-black/50 shadow-inner ring-1 ring-white/10 flex items-center justify-center"
                style={{ width: "4.5rem", height: "4.5rem", aspectRatio: "1" }}
              >
                <span className="relative text-base sm:text-lg font-bold text-white/90 select-none">
                  {safeUpper(fullName || "W")?.slice(0, 2)}
                </span>
              </div>
            </div>

            {/* Middle: membership ID as card number */}
            <div className="min-h-0 flex-shrink space-y-0.5">
              <p className="font-mono text-sm sm:text-base md:text-lg tracking-[0.15em] sm:tracking-[0.2em] text-white/90 break-all">
                {normalized.publicMembershipId
                  ? (() => {
                      const s = String(normalized.publicMembershipId);
                      const chunks = s.match(/.{1,4}/g) || [];
                      return chunks.join(" • ");
                    })()
                  : "—"}
              </p>
            </div>

            {/* Bottom: Card Holder left, Valid Thru right */}
            <div className="flex flex-shrink-0 items-end justify-between gap-4 mt-1">
              <div className="space-y-0.5 min-w-0 flex-1 overflow-visible">
                <p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-indigo-200/60">
                  Card Holder
                </p>
                <p
                  className="font-medium tracking-wide text-white/95 break-words line-clamp-2"
                  title={fullName}
                >
                  {fullName}
                </p>
                <p className="text-[9px] sm:text-[10px] text-indigo-200/70">
                  {normalized.category || "Student"}
                </p>
              </div>
              {/* <div className="text-right flex-shrink-0">
                <p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-indigo-200/60">
                  Valid Thru
                </p>
                <p className="font-mono text-xs sm:text-sm text-white/90">
                  {normalized.endDate
                    ? formatValidUpto(normalized.endDate)
                    : "—"}
                </p>
              </div> */}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default StudentIdCard;

