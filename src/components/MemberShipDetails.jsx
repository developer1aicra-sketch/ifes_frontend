import React, { useState, useCallback, useEffect, useMemo } from 'react'
import {
  UserPlus,
  Trash2,
//   KeyRound,
  RefreshCw,
  Users,
  Mail,
  Phone,
  User,
//   ArrowRight,
  Search,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  DollarSign,
  Edit,
  Loader2,
  CheckCircle2,
  XCircle,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { getMyClubs, addClubMember, getClubMembers, updateClubMember, deleteClubMember } from '../api/clubApi'
import { createBulkMembership } from '../api/membershipApi'
import { fetchCategories } from '../app/categories/categoriesApi'
import { fetchPlans } from '../api/planApi'
import MemberPaymentModal from './MemberPaymentModal'
import BulkPaymentModal from './BulkPaymentModal'
import MembershipPaymentModal from './MembershipPaymentModal'
import { CurrencySelect } from './common/CurrencySelect'
import { useMembershipCreateAndPay } from '../hooks/useMembershipCreateAndPay'
import { extractBulkMembershipResponse, prepareMembershipsForPayment } from '../utils/membershipPaymentFlow'

// ---------------------------------------------------------------------------
// Constants & utilities
// ---------------------------------------------------------------------------

const INITIAL_FORM = {
  fullname: '',
  emailId: '',
  mobileNo: '',
  categoryId: '',
  planId: '',
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MEMBERS_PER_PAGE = 10

const ALLOWED_CATEGORY_NAMES = new Set(['student', 'professional'])

function normalizeCategoryName(name) {
  return String(name || '').trim().toLowerCase()
}

function getAllowedCategories(categories) {
  return (Array.isArray(categories) ? categories : []).filter((cat) =>
    ALLOWED_CATEGORY_NAMES.has(normalizeCategoryName(cat?.name))
  )
}

const PAYMENT_STATUS = Object.freeze({
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
})

function resolveMemberId(member) {
  return member?._id ?? member?.id ?? null
}

function resolveUserId(member) {
  return (
    member?.user_id?._id ||
    member?.user_id?.id ||
    member?.user_id ||
    member?.user?._id ||
    member?.user?.id ||
    member?.userId ||
    member?.userID ||
    null
  )
}

function resolveCategoryId(member) {
  return (
    member?.categoryId?._id ||
    member?.category_id?._id ||
    member?.categoryId ||
    member?.category_id ||
    null
  )
}

function resolvePlanId(member) {
  return (
    member?.planId?._id ||
    member?.plan_id?._id ||
    member?.planId ||
    member?.plan_id ||
    null
  )
}

function normalizePaymentStatus(rawStatus) {
  if (rawStatus == null) return PAYMENT_STATUS.PENDING

  const s = String(rawStatus).trim().toLowerCase()
  if (!s) return PAYMENT_STATUS.PENDING

  if (['success', 'succeeded', 'paid', 'completed', 'captured', 'verified', 'true'].includes(s)) {
    return PAYMENT_STATUS.SUCCESS
  }

  if (
    ['failed', 'failure', 'declined', 'rejected', 'cancelled', 'canceled', 'error', 'false'].includes(s)
  ) {
    return PAYMENT_STATUS.FAILED
  }

  if (['pending', 'created', 'initiated', 'processing', 'in_progress', 'in progress'].includes(s)) {
    return PAYMENT_STATUS.PENDING
  }

  return PAYMENT_STATUS.PENDING
}

function getMemberPaymentStatus(member) {
  // Try a few common shapes; default to PENDING.
  const statusCandidate =
    member?.paymentStatus ??
    member?.payment_status ??
    member?.payment?.status ??
    member?.payment?.paymentStatus ??
    member?.membership?.paymentStatus ??
    member?.membership?.payment_status ??
    member?.membershipPaymentStatus ??
    member?.latestPaymentStatus ??
    member?.latest_payment_status ??
    (typeof member?.isPaid === 'boolean' ? (member.isPaid ? 'success' : 'pending') : null)

  return normalizePaymentStatus(statusCandidate)
}

function paymentStatusBadgeClasses(status) {
  switch (status) {
    case PAYMENT_STATUS.SUCCESS:
      return 'bg-emerald-500/15 text-emerald-300 border-emerald-600/50'
    case PAYMENT_STATUS.FAILED:
      return 'bg-red-500/15 text-red-300 border-red-600/50'
    case PAYMENT_STATUS.PENDING:
    default:
      return 'bg-amber-500/15 text-amber-200 border-amber-600/40'
  }
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

function validateForm(values) {
  const errors = {}
  if (!values.fullname?.trim()) errors.fullname = 'Full name is required'
  if (!values.emailId?.trim()) errors.emailId = 'Email is required'
  else if (!emailRegex.test(values.emailId)) errors.emailId = 'Invalid email format'
  if (!values.mobileNo?.trim()) errors.mobileNo = 'Mobile number is required'
  else if (!/^\d{10}$/.test(values.mobileNo.trim())) errors.mobileNo = 'Enter a valid 10-digit mobile number'
  return errors
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function AddMemberForm({ formData, setFormData, errors, setErrors, onAddMember, isSubmitting, clubId, isLoadingClubId }) {
  const handleChange = useCallback(
    (field) => (e) => {
      let value = e.target.value

      // Restrict mobile number to digits only and max 10 characters
      if (field === 'mobileNo') {
        value = value.replace(/\D/g, '').slice(0, 10)
      }

      setFormData((prev) => ({ ...prev, [field]: value }))
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
    },
    [errors, setErrors]
  )

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!clubId) {
      toast.error('Club information is not available. Please try again.', {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
      })
      return
    }

    const newErrors = validateForm(formData)
    setErrors(newErrors)
    if (Object.keys(newErrors).length === 0) {
      onAddMember({
        club_id: clubId,
        fullname: formData.fullname.trim(),
        emailId: formData.emailId.trim().toLowerCase(),
        mobileNo: formData.mobileNo.trim(),
        role: 'MEMBER',
      })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-lg"
    >
      <div className="p-6 border-b border-slate-700">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <UserPlus size={20} className="text-blue-400" />
          Add Member
        </h2>
       
        {isLoadingClubId && (
          <p className="text-blue-400 text-xs mt-2 flex items-center gap-2">
            <RefreshCw size={14} className="animate-spin" />
            Loading club information...
          </p>
        )}
        {!clubId && !isLoadingClubId && (
          <p className="text-yellow-400 text-xs mt-2">
            ⚠️ Unable to load club information. Please refresh the page.
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[120px]">
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Full Name <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <User
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
              />
              <input
                type="text"
                value={formData.fullname}
                onChange={handleChange('fullname')}
                placeholder="Enter Full Name"
                disabled={!clubId || isLoadingClubId}
                className={`w-full bg-slate-800 border ${
                  errors.fullname ? 'border-red-500' : 'border-slate-600'
                } text-white rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
              />
            </div>
            {errors.fullname && (
              <p className="text-red-400 text-xs mt-1">{errors.fullname}</p>
            )}
          </div>

          <div className="flex-1 min-w-[140px]">
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Email <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Mail
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
              />
              <input
                type="email"
                value={formData.emailId}
                onChange={handleChange('emailId')}
                placeholder="abc@gmail.com"
                disabled={!clubId || isLoadingClubId}
                className={`w-full bg-slate-800 border ${
                  errors.emailId ? 'border-red-500' : 'border-slate-600'
                } text-white rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
              />
            </div>
            {errors.emailId && (
              <p className="text-red-400 text-xs mt-1">{errors.emailId}</p>
            )}
          </div>

          <div className="flex-1 min-w-[140px]">
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Mobile Number <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Phone
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
              />
              <input
                type="tel"
                inputMode="numeric"
                maxLength={10}
                value={formData.mobileNo}
                onChange={handleChange('mobileNo')}
                placeholder="Enter 10-digit mobile number"
                disabled={!clubId || isLoadingClubId}
                className={`w-full bg-slate-800 border ${
                  errors.mobileNo ? 'border-red-500' : 'border-slate-600'
                } text-white rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
              />
            </div>
            {errors.mobileNo && (
              <p className="text-red-400 text-xs mt-1">{errors.mobileNo}</p>
            )}
          </div>

          <motion.button
            type="submit"
            disabled={isSubmitting || !clubId || isLoadingClubId}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="shrink-0 inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2.5 px-5 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <RefreshCw size={20} className="animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <UserPlus size={20} />
                Add
              </>
            )}
          </motion.button>
        </div>
      </form>
    </motion.div>
  )
}

function MembersList({ 
  members, 
  onDelete, 
  isLoading = false, 
  searchQuery, 
  onSearchChange, 
  currentPage, 
  onPageChange, 
  totalPages, 
  totalMembers, 
  filteredCount, 
  onMemberPayment,
  selectedMembers = [],
  onMemberSelect,
  onSelectAll,
  isAllSelected = false,
  isIndeterminate = false,
  onEditMember,
  categories = [],
  plans = [],
  onCategoryChange,
  onPlanChange,
  updatingMemberId = null,
  payingMemberId = null,
}) {
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-lg"
      >
        <div className="p-8 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-slate-800 border border-slate-700 mb-4">
            <RefreshCw size={28} className="text-blue-400 animate-spin" />
          </div>
          <h3 className="text-lg font-semibold text-slate-300">Loading members...</h3>
          <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">
            Fetching club members from the server.
          </p>
        </div>
      </motion.div>
    )
  }

  if (!members.length && !searchQuery) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-lg"
      >
        <div className="p-8 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-slate-800 border border-slate-700 mb-4">
            <Users size={28} className="text-slate-500" />
          </div>
          <h3 className="text-lg font-semibold text-slate-300">No members yet</h3>
          <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">
            Use the form above to add your first member. They will appear here.
          </p>
        </div>
      </motion.div>
    )
  }

  const startIndex = (currentPage - 1) * MEMBERS_PER_PAGE
  const endIndex = startIndex + MEMBERS_PER_PAGE
  const paginatedMembers = members.slice(startIndex, endIndex)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-lg"
    >
      {/* Header with Search */}
      <div className="p-4 sm:p-6 border-b border-slate-700">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Users size={20} className="text-blue-400" />
            <h2 className="text-lg font-bold text-white">
              Members
              {searchQuery ? (
                <span className="text-slate-400 font-normal ml-2">
                  ({filteredCount} of {totalMembers} found)
                </span>
              ) : (
                <span className="text-slate-400 font-normal ml-2">({totalMembers})</span>
              )}
            </h2>
          </div>
          
          {/* Search Input */}
          <div className="w-full sm:w-auto min-w-[250px]">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search by fullname..."
                className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      {/* No Results Message */}
      {members.length === 0 && searchQuery && (
        <div className="p-8 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-slate-800 border border-slate-700 mb-4">
            <Search size={28} className="text-slate-500" />
          </div>
          <h3 className="text-lg font-semibold text-slate-300">No members found</h3>
          <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">
            No members match "{searchQuery}". Try a different search term.
          </p>
        </div>
      )}

      {/* Members Table */}
      {paginatedMembers.length > 0 && (
        <div className="overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-700 bg-slate-800/50">
                <th className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3 w-12">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={(input) => {
                      if (input) input.indeterminate = isIndeterminate
                    }}
                    onChange={onSelectAll}
                    className="rounded bg-slate-700 border-slate-600 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                    title="Select all members"
                  />
                </th>
                <th className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3">
                  Name
                </th>
                <th className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3">
                  Email
                </th>
                <th className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3">
                  Mobile
                </th>
              
                <th className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3">
                  Category
                </th>
                <th className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3">
                  Plan
                </th>
                <th className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3">
                  Payment Status
                </th>
                <th className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {paginatedMembers.map((member, index) => {
                  const status = getMemberPaymentStatus(member)
                  const isPaid = status === PAYMENT_STATUS.SUCCESS

                  return (
                  <motion.tr
                    key={member.id}
                    layout
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 8 }}
                    transition={{ duration: 0.2 }}
                    className="border-b border-slate-700/80 hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      {!isPaid ? (
                        <input
                          type="checkbox"
                          checked={selectedMembers.some((m) => String(resolveMemberId(m)) === String(resolveMemberId(member)))}
                          onChange={() => onMemberSelect && onMemberSelect(member)}
                          className="rounded bg-slate-700 border-slate-600 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <div className="w-4 h-4" />
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-white">{member.fullname || member.name}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-300 text-sm">{member.emailId || member.email}</td>
                    <td className="px-4 py-3 text-slate-300 text-sm">{member.mobileNo || member.mobile || '-'}</td>
                   
                    <td className="px-4 py-2">
                      <select
                        value={member.categoryId || member.category_id || ''}
                        onChange={(e) => {
                          e.stopPropagation()
                          const val = e.target.value
                          onCategoryChange && onCategoryChange(member, val || null)
                        }}
                        disabled={!!updatingMemberId}
                        className="w-full min-w-[120px] bg-slate-800 border border-slate-600 text-slate-200 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 cursor-pointer disabled:opacity-50"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <option value="">Select category</option>
                        {getAllowedCategories(categories).map((cat) => (
                          <option key={cat._id || cat.id} value={cat._id || cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-2">
                      {(() => {
                        const catId = member.categoryId || member.category_id
                        const plansForCategory = !catId ? [] : plans.filter(
                          (p) => (p.categoryId?._id || p.categoryId) === catId
                        )
                        return (
                          <select
                            value={member.planId || member.plan_id || ''}
                            onChange={(e) => {
                              e.stopPropagation()
                              onPlanChange && onPlanChange(member, e.target.value || null)
                            }}
                            disabled={!!updatingMemberId || !catId}
                            className="w-full min-w-[140px] bg-slate-800 border border-slate-600 text-slate-200 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 cursor-pointer disabled:opacity-50"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <option value="">Select plan</option>
                            {plansForCategory.map((plan) => (
                              <option key={plan._id || plan.id} value={plan._id || plan.id}>
                                {plan.name}
                                {plan.price?.amount != null ? ` — ${plan.price.currency || 'USD'} ${plan.price.amount}` : ''}
                              </option>
                            ))}
                          </select>
                        )
                      })()}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={[
                          'inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-semibold border',
                          paymentStatusBadgeClasses(status),
                        ].join(' ')}
                        title={`Payment status: ${status}`}
                      >
                        {status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {onMemberPayment && !isPaid && (
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.stopPropagation()
                              onMemberPayment(member)
                            }}
                            disabled={
                              !!updatingMemberId ||
                              String(payingMemberId || '') === String(resolveMemberId(member) || '')
                            }
                            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-900/30 border border-blue-700/60 text-blue-200 hover:text-white hover:border-blue-500 hover:bg-blue-800/60 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Create membership & pay"
                          >
                            {String(payingMemberId || '') === String(resolveMemberId(member) || '') ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <>Pay</>
                            )}
                          </motion.button>
                        )}
                        {onDelete && (
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.stopPropagation()
                              onDelete(member)
                            }}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-900/40 border border-red-700/70 text-red-300 hover:text-white hover:border-red-500 hover:bg-red-800/70 transition-colors"
                            title="Delete member"
                          >
                            <Trash2 size={14} />
                          </motion.button>
                        )}
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation()
                            onEditMember && onEditMember(member)
                          }}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:border-blue-500 hover:bg-slate-700 transition-colors"
                          title="Edit member"
                        >
                          <Edit size={14} />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                  )
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="p-4 sm:p-6 border-t border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-slate-400">
            Showing <span className="text-white font-medium">{startIndex + 1}</span> to{' '}
            <span className="text-white font-medium">
              {Math.min(endIndex, members.length)}
            </span>{' '}
            of <span className="text-white font-medium">{members.length}</span> members
          </div>
          
          <div className="flex items-center gap-2">
            <motion.button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              whileHover={{ scale: currentPage === 1 ? 1 : 1.05 }}
              whileTap={{ scale: currentPage === 1 ? 1 : 0.95 }}
              className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-slate-700 disabled:hover:text-slate-400"
              title="Previous page"
            >
              <ChevronLeft size={18} />
            </motion.button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                // Show first page, last page, current page, and pages around current
                const showPage =
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)

                if (!showPage) {
                  // Show ellipsis
                  if (page === currentPage - 2 || page === currentPage + 2) {
                    return (
                      <span key={page} className="px-2 text-slate-500">
                        ...
                      </span>
                    )
                  }
                  return null
                }

                return (
                  <motion.button
                    key={page}
                    onClick={() => onPageChange(page)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:border-blue-500'
                    }`}
                  >
                    {page}
                  </motion.button>
                )
              })}
            </div>

            <motion.button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              whileHover={{ scale: currentPage === totalPages ? 1 : 1.05 }}
              whileTap={{ scale: currentPage === totalPages ? 1 : 0.95 }}
              className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-slate-700 disabled:hover:text-slate-400"
              title="Next page"
            >
              <ChevronRight size={18} />
            </motion.button>
          </div>
        </div>
      )}
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// Edit Member Modal
// ---------------------------------------------------------------------------

function EditMemberModal({
  isOpen,
  member,
  formData,
  setFormData,
  errors,
  setErrors,
  isSubmitting,
  onClose,
  onSubmit,
  categories = [],
  plans = [],
}) {
  if (!isOpen || !member) return null

  const handleChange = useCallback(
    (field) => (e) => {
      let value = e.target.value

      if (field === 'mobileNo') {
        value = value.replace(/\D/g, '').slice(0, 10)
      }

      if (field === 'categoryId') {
        setFormData((prev) => ({ ...prev, categoryId: value, planId: '' }))
      } else {
        setFormData((prev) => ({ ...prev, [field]: value }))
      }
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
    },
    [errors, setErrors, setFormData]
  )

  const plansForCategory = useMemo(() => {
    const catId = formData.categoryId
    if (!catId) return []
    return plans.filter(
      (p) => (p.categoryId?._id || p.categoryId) === catId
    )
  }, [formData.categoryId, plans])

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = validateForm(formData)
    setErrors(newErrors)
    if (Object.keys(newErrors).length === 0) {
      onSubmit()
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Edit size={18} className="text-blue-400" />
              Edit Member
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Update member details and save changes.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white text-sm"
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Full Name <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <User
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
              />
              <input
                type="text"
                value={formData.fullname}
                onChange={handleChange('fullname')}
                placeholder="Enter Full Name"
                className={`w-full bg-slate-800 border ${
                  errors.fullname ? 'border-red-500' : 'border-slate-600'
                } text-white rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors`}
              />
            </div>
            {errors.fullname && (
              <p className="text-red-400 text-xs mt-1">{errors.fullname}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Email <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Mail
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
              />
              <input
                type="email"
                value={formData.emailId}
                onChange={handleChange('emailId')}
                placeholder="abc@gmail.com"
                className={`w-full bg-slate-800 border ${
                  errors.emailId ? 'border-red-500' : 'border-slate-600'
                } text-white rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors`}
              />
            </div>
            {errors.emailId && (
              <p className="text-red-400 text-xs mt-1">{errors.emailId}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Mobile Number <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Phone
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
              />
              <input
                type="tel"
                inputMode="numeric"
                maxLength={10}
                value={formData.mobileNo}
                onChange={handleChange('mobileNo')}
                placeholder="Enter 10-digit mobile number"
                className={`w-full bg-slate-800 border ${
                  errors.mobileNo ? 'border-red-500' : 'border-slate-600'
                } text-white rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors`}
              />
            </div>
            {errors.mobileNo && (
              <p className="text-red-400 text-xs mt-1">{errors.mobileNo}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Category
            </label>
            <select
              value={formData.categoryId || ''}
              onChange={handleChange('categoryId')}
              className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors"
            >
              <option value="">Select category</option>
              {getAllowedCategories(categories).map((cat) => (
                <option key={cat._id || cat.id} value={cat._id || cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Plan
            </label>
            <select
              value={formData.planId || ''}
              onChange={handleChange('planId')}
              disabled={!formData.categoryId}
              className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Select plan</option>
              {plansForCategory.map((plan) => (
                <option key={plan._id || plan.id} value={plan._id || plan.id}>
                  {plan.name}
                  {plan.price?.amount != null ? ` — ${plan.price.currency || 'USD'} ${plan.price.amount}` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-1 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2 px-5 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed text-sm"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Edit size={16} />
                  Save Changes
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Delete Member Modal
// ---------------------------------------------------------------------------

function DeleteMemberModal({
  isOpen,
  member,
  isSubmitting,
  onClose,
  onConfirm,
}) {
  if (!isOpen || !member) return null

  const displayName = member.fullname || member.name || 'this member'

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Trash2 size={18} className="text-red-400" />
              Delete Member
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              This action cannot be undone.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="text-slate-400 hover:text-white text-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Close
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <p className="text-sm text-slate-300">
            Are you sure you want to remove{' '}
            <span className="font-semibold text-white">{displayName}</span> from
            your club?
          </p>
          {(member.emailId || member.email || member.mobileNo || member.mobile) && (
            <div className="bg-slate-800/70 border border-slate-700 rounded-lg px-4 py-3 text-xs text-slate-300 space-y-1">
              {member.emailId || member.email ? (
                <p>
                  <span className="text-slate-400">Email:</span>{' '}
                  {member.emailId || member.email}
                </p>
              ) : null}
              {member.mobileNo || member.mobile ? (
                <p>
                  <span className="text-slate-400">Mobile:</span>{' '}
                  {member.mobileNo || member.mobile}
                </p>
              ) : null}
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <motion.button
              type="button"
              onClick={onConfirm}
              disabled={isSubmitting}
              whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-5 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed text-sm"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 size={16} />
                  Delete Member
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

const MemberShipDetails = ({ setPage, setpage }) => {
  const setpageFn = setPage ?? setpage

  const [formData, setFormData] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [members, setMembers] = useState([])
  const [clubId, setClubId] = useState(null)
  const [isLoadingClubId, setIsLoadingClubId] = useState(true)
  const [isLoadingMembers, setIsLoadingMembers] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const [bulkPaymentModalOpen, setBulkPaymentModalOpen] = useState(false)
  const [selectedMemberForPayment, setSelectedMemberForPayment] = useState(null)
  // Keep selection as IDs so it stays in-sync with latest member edits (category/plan changes).
  const [selectedMemberIds, setSelectedMemberIds] = useState([]) // string[]
  const [memberPaymentAmount, setMemberPaymentAmount] = useState(10) // Default payment amount per member in USD
  const [selectedCurrency, setSelectedCurrency] = useState('INR')
  const [currencyManuallySelected, setCurrencyManuallySelected] = useState(false)
  // Snapshot currency for the "create memberships -> payment" flow.
  // This makes the flow deterministic even if UI state changes.
  const [bulkMembershipCurrencySnapshot, setBulkMembershipCurrencySnapshot] = useState('INR')
  const [editingMember, setEditingMember] = useState(null)
  const [editFormData, setEditFormData] = useState(INITIAL_FORM)
  const [editErrors, setEditErrors] = useState({})
  const [isUpdatingMember, setIsUpdatingMember] = useState(false)
  const [deletingMember, setDeletingMember] = useState(null)
  const [isDeletingMember, setIsDeletingMember] = useState(false)
  const [categories, setCategories] = useState([])
  const [plans, setPlans] = useState([])
  const [isLoadingMeta, setIsLoadingMeta] = useState(true)
  const [updatingMemberId, setUpdatingMemberId] = useState(null)
  const [isSubmittingBulkMembership, setIsSubmittingBulkMembership] = useState(false)
  const [payingMemberId, setPayingMemberId] = useState(null)
  const [createdMembershipsForPayment, setCreatedMembershipsForPayment] = useState([])
  const [membershipPaymentModalOpen, setMembershipPaymentModalOpen] = useState(false)
  const [paymentStatusView, setPaymentStatusView] = useState(null) // { status: 'success'|'failure', context: 'member'|'bulk'|'membership', result }

  const resolvePaymentStatus = (result) => {
    if (!result) return 'failure'
    if (result.verificationFailed) return 'failure'
    if (result.verificationData && result.verificationData.success === false) return 'failure'
    if (result.success === false) return 'failure'
    return 'success'
  }

  // Fetch club_id on component mount
  useEffect(() => {
    const fetchClubId = async () => {
      try {
        setIsLoadingClubId(true)
        const response = await getMyClubs()
        
        // Handle different response structures
        const clubs = response?.data?.data || response?.data || []
        
        if (Array.isArray(clubs) && clubs.length > 0) {
          // Get the first club's _id
          const firstClub = clubs[0]
          const id = firstClub._id || firstClub.id
          
          if (id) {
            setClubId(id)
            console.log('✅ Club ID fetched:', id)
          } else {
            console.error('❌ No _id found in club data:', firstClub)
            toast.error('Club ID not found in response', {
              position: "top-right",
              autoClose: 3000,
              theme: "dark",
            })
          }
        } else {
          console.warn('⚠️ No clubs found in response')
          toast.warning('No club found. Please create a club first.', {
            position: "top-right",
            autoClose: 3000,
            theme: "dark",
          })
        }
      } catch (error) {
        console.error('❌ Error fetching club ID:', error)
        const errorMessage = error.response?.data?.message || error.message || 'Failed to load club information'
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 3000,
          theme: "dark",
        })
      } finally {
        setIsLoadingClubId(false)
      }
    }

    fetchClubId()
  }, [])

  // Fetch categories and plans for membership (category → plan cascading)
  useEffect(() => {
    const fetchMeta = async () => {
      try {
        setIsLoadingMeta(true)
        const [catRes, planRes] = await Promise.all([
          fetchCategories(),
          fetchPlans(),
        ])
        const catData = catRes?.data?.data ?? catRes?.data ?? []
        const planData = planRes?.data?.data ?? planRes?.data ?? []
        setCategories(Array.isArray(catData) ? catData : [])
        setPlans(Array.isArray(planData) ? planData : [])
      } catch (err) {
        console.warn('Failed to load categories/plans:', err)
        setCategories([])
        setPlans([])
      } finally {
        setIsLoadingMeta(false)
      }
    }
    fetchMeta()
  }, [])

  // Fetch club members when clubId is available
  useEffect(() => {
    const fetchClubMembers = async () => {
      if (!clubId) return

      try {
        setIsLoadingMembers(true)
        console.log('📥 Fetching club members for clubId:', clubId)
        
        const response = await getClubMembers(clubId)
        
        // Handle different response structures
        const membersData = response?.data?.data || response?.data || []
        
        if (Array.isArray(membersData)) {
          // Transform the API response to match our component's expected format
          const transformedMembers = membersData.map((member) => ({
            id: member._id || member.id,
            fullname:
              member.fullname ||
              member.user?.fullName ||
              member.user?.fullname ||
              member.user_id?.fullname ||
              member.name ||
              'N/A',
            emailId:
              member.emailId ||
              member.user?.email ||
              member.user_id?.email ||
              member.email ||
              'N/A',
            mobileNo:
              member.mobileNo ||
              member.user?.mobile ||
              member.user?.mobileNo ||
              member.user_id?.mobileNo ||
              member.phone ||
              member.mobile ||
              '',
            role: member.role || member.user?.role || 'MEMBER',
            // Normalise to use category/plan IDs (not objects) for stable selection
            categoryId:
              member.categoryId?._id ||
              member.category_id?._id ||
              member.categoryId ||
              member.category_id ||
              null,
            planId:
              member.planId?._id ||
              member.plan_id?._id ||
              member.planId ||
              member.plan_id ||
              null,
            ...member, // Keep original data for reference
          }))
          
          setMembers(transformedMembers)
          // console.log('✅ Club members fetched:', transformedMembers.length)
        } else {
          console.warn('⚠️ Invalid members data structure:', membersData)
          setMembers([])
        }
      } catch (error) {
        console.error('❌ Error fetching club members:', error)
        const errorMessage = error.response?.data?.message || error.message || 'Failed to load club members'
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 3000,
          theme: "dark",
        })
        setMembers([])
      } finally {
        setIsLoadingMembers(false)
      }
    }

    fetchClubMembers()
  }, [clubId])

  const handleAddMember = useCallback(async (memberData) => {
    if (!clubId) {
      toast.error('Club ID is not available', {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
      })
      return
    }

    try {
      setIsSubmitting(true)
      
      console.log('📤 Adding member with payload:', memberData)
      
      const response = await addClubMember(memberData)
      
      console.log('✅ Member added successfully:', response.data)
      
      // Add member to local state for immediate UI update
      const newMember = {
        id: response?.data?.data?._id || `member-${Date.now()}`,
        fullname: memberData.fullname,
        emailId: memberData.emailId,
        mobileNo: memberData.mobileNo,
        role: memberData.role,
        ...response?.data?.data,
      }
      
      setMembers((prev) => [newMember, ...prev])
      
      // Optionally refetch all members to ensure consistency
      // This ensures we have the latest data from the server
      try {
        const membersResponse = await getClubMembers(clubId)
        const membersData = membersResponse?.data?.data || membersResponse?.data || []
        if (Array.isArray(membersData)) {
          const transformedMembers = membersData.map((member) => ({
            id: member._id || member.id,
            fullname:
              member.fullname ||
              member.user?.fullName ||
              member.user?.fullname ||
              member.user_id?.fullname ||
              member.name ||
              'N/A',
            emailId:
              member.emailId ||
              member.user?.email ||
              member.user_id?.email ||
              member.email ||
              'N/A',
            mobileNo:
              member.mobileNo ||
              member.user?.mobile ||
              member.user?.mobileNo ||
              member.user_id?.mobileNo ||
              member.phone ||
              member.mobile ||
              '',
            role: member.role || member.user?.role || 'MEMBER',
            categoryId:
              member.categoryId?._id ||
              member.category_id?._id ||
              member.categoryId ||
              member.category_id ||
              null,
            planId:
              member.planId?._id ||
              member.plan_id?._id ||
              member.planId ||
              member.plan_id ||
              null,
            ...member,
          }))
          setMembers(transformedMembers)
        }
      } catch (refetchError) {
        console.warn('⚠️ Error refetching members after add:', refetchError)
        // Keep the optimistic update even if refetch fails
      }
      setFormData(INITIAL_FORM)
      
      toast.success('Member added successfully!', {
        position: "top-right",
        autoClose: 2000,
        theme: "dark",
      })
    } catch (error) {
      console.error('❌ Error adding member:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Failed to add member'
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
      })
    } finally {
      setIsSubmitting(false)
    }
  }, [clubId])

  const handleDeleteMember = useCallback((member) => {
    setDeletingMember(member)
  }, [])

  const handleConfirmDeleteMember = useCallback(async () => {
    if (!deletingMember) return

    const memberId = deletingMember._id || deletingMember.id
    if (!memberId) {
      toast.error('Member ID not found. Cannot delete member.', {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
      })
      return
    }

    try {
      setIsDeletingMember(true)
      console.log('🗑 Deleting member:', memberId)
      await deleteClubMember(memberId)

      setMembers((prev) =>
        prev.filter((m) => m.id !== memberId && m._id !== memberId)
      )
      // Selection is tracked as IDs (selectedMemberIds), so remove deleted member ID from the selection.
      setSelectedMemberIds((prev) => prev.filter((id) => String(id) !== String(memberId)))

      toast.success('Member deleted successfully!', {
        position: "top-right",
        autoClose: 2000,
        theme: "dark",
      })

      setDeletingMember(null)
    } catch (error) {
      console.error('❌ Error deleting member:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete member'
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
      })
    } finally {
      setIsDeletingMember(false)
    }
  }, [deletingMember])

  const handleCloseDeleteModal = useCallback(() => {
    if (isDeletingMember) return
    setDeletingMember(null)
  }, [isDeletingMember])

  const handleUpgrade = () => {
    if (setpageFn) {
      setpageFn('upgrade')
    } else {
      window.location.href = '/membership'
    }
  }

  const refetchMembers = useCallback(async () => {
    if (!clubId) return
    const membersResponse = await getClubMembers(clubId)
    const membersData = membersResponse?.data?.data || membersResponse?.data || []
    if (!Array.isArray(membersData)) return
    const transformedMembers = membersData.map((member) => ({
      id: member._id || member.id,
      fullname:
        member.fullname ||
        member.user?.fullName ||
        member.user?.fullname ||
        member.user_id?.fullname ||
        member.name ||
        'N/A',
      emailId:
        member.emailId ||
        member.user?.email ||
        member.user_id?.email ||
        member.email ||
        'N/A',
      mobileNo:
        member.mobileNo ||
        member.user?.mobile ||
        member.user?.mobileNo ||
        member.user_id?.mobileNo ||
        member.phone ||
        member.mobile ||
        '',
      role: member.role || member.user?.role || 'MEMBER',
      categoryId:
        member.categoryId?._id ||
        member.category_id?._id ||
        member.categoryId ||
        member.category_id ||
        null,
      planId:
        member.planId?._id ||
        member.plan_id?._id ||
        member.planId ||
        member.plan_id ||
        null,
      ...member,
    }))
    setMembers(transformedMembers)
  }, [clubId])

  const { start: startMembershipCreateAndPay } = useMembershipCreateAndPay({
    createBulkMembership,
    refetchMembers,
    getCurrencySnapshot: () => selectedCurrency,
    onOpenPaymentModal: ({ membershipsForPayment, currencySnapshot }) => {
      setBulkMembershipCurrencySnapshot(currencySnapshot)
      setCreatedMembershipsForPayment(membershipsForPayment)
      requestAnimationFrame(() => setMembershipPaymentModalOpen(true))
    },
  })

  // Handle member "membership + payment" flow from the list (creates a membership, then opens Razorpay payment modal).
  const handleMemberPayment = useCallback(async (member) => {
    const memberId = resolveMemberId(member)
    const userId = resolveUserId(member)
    const categoryId = resolveCategoryId(member)
    const planId = resolvePlanId(member)

    if (!memberId || !userId) {
      toast.error('Member ID not found. Cannot create membership.', {
        position: 'top-right',
        autoClose: 3000,
        theme: 'dark',
      })
      return
    }

    if (!categoryId || !planId) {
      toast.warning('Assign category and plan for this member, then click Pay again.', {
        position: 'top-right',
        autoClose: 3500,
        theme: 'dark',
      })
      return
    }

    setPayingMemberId(memberId)
    try {
      await startMembershipCreateAndPay({
        payingId: memberId,
        membersPayload: [{ user_id: userId, category_id: categoryId, plan_id: planId }],
        successToast: 'Membership created. Opening payment...',
      })
    } finally {
      setPayingMemberId(null)
    }
  }, [startMembershipCreateAndPay])

  // Handle payment success
  const handlePaymentSuccess = useCallback((paymentResult) => {
    const finalStatus = resolvePaymentStatus(paymentResult)
    setPaymentStatusView({
      status: finalStatus,
      context: 'member',
      result: paymentResult,
    })

    if (finalStatus === 'success') {
      console.log('Member payment successful:', paymentResult)
      
      toast.success(`Payment successful for ${selectedMemberForPayment?.fullname || selectedMemberForPayment?.name}!`, {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
      })

      // Optionally refresh members list or update member status
      if (clubId) {
        // Refetch members to get updated payment status
        const refetchMembers = async () => {
          try {
            const response = await getClubMembers(clubId)
            const membersData = response?.data?.data || response?.data || []
            if (Array.isArray(membersData)) {
              const transformedMembers = membersData.map((member) => ({
                id: member._id || member.id,
                fullname:
                  member.fullname ||
                  member.user?.fullName ||
                  member.user?.fullname ||
                  member.user_id?.fullname ||
                  member.name ||
                  'N/A',
                emailId:
                  member.emailId ||
                  member.user?.email ||
                  member.user_id?.email ||
                  member.email ||
                  'N/A',
                mobileNo:
                  member.mobileNo ||
                  member.user?.mobile ||
                  member.user?.mobileNo ||
                  member.user_id?.mobileNo ||
                  member.phone ||
                  member.mobile ||
                  '',
                role: member.role || member.user?.role || 'MEMBER',
                ...member,
              }))
              setMembers(transformedMembers)
            }
          } catch (error) {
            console.warn('Error refetching members after payment:', error)
          }
        }
        refetchMembers()
      }
    } else {
      const message =
        paymentResult?.verificationError ||
        paymentResult?.errorMessage ||
        'Payment failed or verification was unsuccessful. Please try again.'
      toast.error(message, {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
      })
    }
  }, [selectedMemberForPayment, clubId])

  const handleClosePaymentModal = useCallback(() => {
    setPaymentModalOpen(false)
    setSelectedMemberForPayment(null)
  }, [])

  const handleEditMemberOpen = useCallback((member) => {
    setEditingMember(member)
    setEditFormData({
      fullname: member.fullname || member.name || '',
      emailId: member.emailId || member.email || '',
      mobileNo: member.mobileNo || member.mobile || '',
      categoryId: member.categoryId || member.category_id || '',
      planId: member.planId || member.plan_id || '',
    })
    setEditErrors({})
  }, [])

  const handleEditMemberClose = useCallback(() => {
    setEditingMember(null)
    setEditFormData(INITIAL_FORM)
    setEditErrors({})
  }, [])

  const handleEditMemberSave = useCallback(async () => {
    if (!editingMember) return

    const payload = {
      fullname: editFormData.fullname.trim(),
      emailId: editFormData.emailId.trim().toLowerCase(),
      mobileNo: editFormData.mobileNo.trim(),
    }
    if (editFormData.categoryId) payload.categoryId = editFormData.categoryId
    if (editFormData.planId) payload.planId = editFormData.planId

    const memberId = editingMember._id || editingMember.id
    if (!memberId) {
      toast.error('Member ID not found. Cannot update member.', {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
      })
      return
    }

    try {
      setIsUpdatingMember(true)
      console.log('📤 Updating member:', memberId, payload)

      await updateClubMember(memberId, payload)

      // Optimistically update local state
      setMembers((prev) =>
        prev.map((m) =>
          (m.id === memberId || m._id === memberId)
            ? { ...m, ...payload }
            : m
        )
      )

      toast.success('Member updated successfully!', {
        position: "top-right",
        autoClose: 2000,
        theme: "dark",
      })

      handleEditMemberClose()
    } catch (error) {
      console.error('❌ Error updating member:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update member'
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
      })
    } finally {
      setIsUpdatingMember(false)
    }
  }, [editingMember, editFormData, handleEditMemberClose])

  const handleCategoryChange = useCallback(async (member, categoryId) => {
    const memberId = member._id || member.id
    if (!memberId) return
    const payload = { categoryId: categoryId || null, planId: null }
    try {
      setUpdatingMemberId(memberId)
      await updateClubMember(memberId, payload)
      setMembers((prev) =>
        prev.map((m) =>
          (m.id === memberId || m._id === memberId)
            ? { ...m, categoryId: categoryId || null, planId: null }
            : m
        )
      )
      toast.success('Category updated.', { position: 'top-right', autoClose: 2000, theme: 'dark' })
    } catch (err) {
      console.error('Update category failed:', err)
      toast.error(err.response?.data?.message || err.message || 'Failed to update category', {
        position: 'top-right', autoClose: 3000, theme: 'dark',
      })
    } finally {
      setUpdatingMemberId(null)
    }
  }, [])

  const handlePlanChange = useCallback(async (member, planId) => {
    const memberId = member._id || member.id
    if (!memberId) return
    const payload = { planId: planId || null }
    try {
      setUpdatingMemberId(memberId)
      await updateClubMember(memberId, payload)
      setMembers((prev) =>
        prev.map((m) =>
          (m.id === memberId || m._id === memberId)
            ? { ...m, planId: planId || null }
            : m
        )
      )
      toast.success('Plan updated.', { position: 'top-right', autoClose: 2000, theme: 'dark' })
    } catch (err) {
      console.error('Update plan failed:', err)
      toast.error(err.response?.data?.message || err.message || 'Failed to update plan', {
        position: 'top-right', autoClose: 3000, theme: 'dark',
      })
    } finally {
      setUpdatingMemberId(null)
    }
  }, [])

  // Filter members based on search query
  const filteredMembers = useMemo(() => {
    if (!searchQuery.trim()) {
      return members
    }
    
    const query = searchQuery.toLowerCase().trim()
    return members.filter((member) => {
      const fullname = (member.fullname || member.name || '').toLowerCase()
      return fullname.includes(query)
    })
  }, [members, searchQuery])

  const planPriceById = useMemo(() => {
    const map = new Map()
    ;(plans || []).forEach((p) => {
      const id = p?._id ?? p?.id
      if (!id) return
      const rawAmount = p?.price?.amount ?? p?.amount ?? null
      const amount = rawAmount != null ? Number(rawAmount) : NaN
      if (!Number.isFinite(amount)) return
      const currency = p?.price?.currency ?? p?.currency ?? 'INR'
      map.set(String(id), { amount, currency })
    })
    return map
  }, [plans])

  // Compute totals specifically for the memberships that are about to be paid for.
  // This avoids relying on selection/filter state (which can be cleared before opening the modal).
  const membershipPaymentPricing = useMemo(() => {
    const items = Array.isArray(createdMembershipsForPayment) ? createdMembershipsForPayment : []
    let total = 0
    let currency = null
    let missingPriceCount = 0

    items.forEach((m) => {
      const planId =
        (typeof m?.plan_id === 'object' ? (m?.plan_id?._id ?? m?.plan_id?.id) : (m?.plan_id ?? m?.planId)) ??
        null
      if (!planId) {
        missingPriceCount += 1
        return
      }
      const entry = planPriceById.get(String(planId))
      if (!entry) {
        missingPriceCount += 1
        return
      }
      if (currency == null) currency = entry.currency || 'INR'
      else if (currency !== entry.currency) currency = 'MIXED'
      total += entry.amount
    })

    return {
      total,
      currency: currency ?? 'INR',
      mixedCurrency: currency === 'MIXED',
      missingPriceCount,
      memberCount: items.length,
    }
  }, [createdMembershipsForPayment, planPriceById])

  const selectedMembers = useMemo(() => {
    if (!selectedMemberIds.length) return []
    const idSet = new Set(selectedMemberIds.map(String))
    return members.filter((m) => idSet.has(String(resolveMemberId(m))))
  }, [members, selectedMemberIds])

  const payableMembers = selectedMembers.length > 0 ? selectedMembers : filteredMembers

  const pricingSummary = useMemo(() => {
    let total = 0
    let currency = null
    let missingPriceCount = 0

    payableMembers.forEach((m) => {
      const planId =
        m?.planId?._id ||
        m?.plan_id?._id ||
        m?.planId ||
        m?.plan_id ||
        null
      if (!planId) {
        missingPriceCount += 1
        return
      }
      const entry = planPriceById.get(String(planId))
      if (!entry) {
        missingPriceCount += 1
        return
      }
      if (currency == null) currency = entry.currency || 'INR'
      else if (currency !== entry.currency) currency = 'MIXED'
      total += entry.amount
    })

    return {
      total,
      currency: currency ?? 'INR',
      mixedCurrency: currency === 'MIXED',
      memberCount: payableMembers.length,
      missingPriceCount,
    }
  }, [payableMembers, planPriceById])

  // Auto-select currency only when plan prices share the same currency.
  // If currencies are mixed, require an explicit user selection.
  useEffect(() => {
    if (!pricingSummary.mixedCurrency && pricingSummary.currency && !currencyManuallySelected) {
      setSelectedCurrency(pricingSummary.currency)
    }
  }, [pricingSummary.mixedCurrency, pricingSummary.currency, currencyManuallySelected])

  const formatMoney = useCallback((amount, currency) => {
    const n = Number(amount || 0)
    const pretty = n.toLocaleString(undefined, { maximumFractionDigits: 2 })
    const c = String(currency || '').toUpperCase()
    if (c === 'INR') return `₹${pretty}`
    if (c === 'USD') return `$${pretty}`
    if (c) return `${c} ${pretty}`
    return pretty
  }, [])

  // Member selection handlers
  const handleMemberSelect = useCallback((member) => {
    const memberId = resolveMemberId(member)
    if (!memberId) return
    setSelectedMemberIds((prev) => {
      const id = String(memberId)
      const set = new Set(prev.map(String))
      if (set.has(id)) set.delete(id)
      else set.add(id)
      return Array.from(set)
    })
  }, [])

  const handleSelectAll = useCallback(() => {
    const filteredIds = filteredMembers
      .map((m) => String(resolveMemberId(m)))
      .filter(Boolean)

    setSelectedMemberIds((prev) => {
      const prevSet = new Set(prev.map(String))
      const allSelected = filteredIds.length > 0 && filteredIds.every((id) => prevSet.has(id))
      return allSelected ? [] : filteredIds
    })
  }, [filteredMembers])

  const handleCreateBulkMembership = useCallback(async () => {
    if (selectedMemberIds.length === 0) {
      toast.warning('Select one or more members using the checkboxes, then assign category and plan to each.', {
        position: 'top-right',
        autoClose: 4000,
        theme: 'dark',
      })
      return
    }

    // IMPORTANT: Build payload from the latest members state (not stale selected objects).
    const idSet = new Set(selectedMemberIds.map(String))
    const currentSelectedMembers = members.filter((m) => idSet.has(String(resolveMemberId(m))))

    const membersPayload = currentSelectedMembers
      .filter((m) => {
        const userId = resolveUserId(m)
        const categoryId = resolveCategoryId(m)
        const planId = resolvePlanId(m)
        return userId && categoryId && planId
      })
      .map((m) => ({
        user_id: resolveUserId(m),
        category_id: resolveCategoryId(m),
        plan_id: resolvePlanId(m),
      }))

    if (membersPayload.length === 0) {
      toast.warning('Each selected member must have a category and plan assigned. Use the dropdowns in the table.', {
        position: 'top-right',
        autoClose: 4000,
        theme: 'dark',
      })
      return
    }

    try {
      // Lock currency once creation+payment pipeline starts.
      setBulkMembershipCurrencySnapshot(selectedCurrency)
      setIsSubmittingBulkMembership(true)
      const response = await createBulkMembership({ members: membersPayload })

      const { createdMemberships, failedUsers } = extractBulkMembershipResponse(response)
      const membershipsForPayment = prepareMembershipsForPayment({
        membersPayload,
        createdMemberships,
        failedUsers,
      })

      if (membershipsForPayment.length !== membersPayload.length) {
        toast.warning(
          `Prepared ${membershipsForPayment.length} of ${membersPayload.length} membership(s) for payment. Only prepared memberships will be charged.`,
          { position: 'top-right', autoClose: 4500, theme: 'dark' }
        )
      }

      if (createdMemberships.length === 0) {
        toast.warning('Memberships were created but none returned for payment. Please contact support.', {
          position: 'top-right',
          autoClose: 4000,
          theme: 'dark',
        })
      }

      toast.success(
        membershipsForPayment.length > 0
          ? `Bulk membership processed for ${membersPayload.length} member(s). Opening payment...`
          : `Bulk membership processed for ${membersPayload.length} member(s).`,
        {
          position: 'top-right',
          autoClose: 3000,
          theme: 'dark',
        }
      )
      setSelectedMemberIds([])
      await refetchMembers()
      if (membershipsForPayment.length > 0) {
        setCreatedMembershipsForPayment(membershipsForPayment)
        requestAnimationFrame(() => setMembershipPaymentModalOpen(true))
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to create bulk membership.'
      toast.error(message, {
        position: 'top-right',
        autoClose: 4000,
        theme: 'dark',
      })
    } finally {
      setIsSubmittingBulkMembership(false)
    }
  }, [selectedMemberIds, members, clubId, refetchMembers])

  const isAllSelected = useMemo(() => {
    if (filteredMembers.length === 0) return false
    const filteredIds = filteredMembers
      .map((m) => String(resolveMemberId(m)))
      .filter(Boolean)
    if (filteredIds.length === 0) return false
    const set = new Set(selectedMemberIds.map(String))
    return filteredIds.every((id) => set.has(id))
  }, [filteredMembers, selectedMemberIds])

  const isIndeterminate = useMemo(() => {
    const filteredIds = filteredMembers
      .map((m) => String(resolveMemberId(m)))
      .filter(Boolean)
    if (filteredIds.length === 0) return false
    const set = new Set(selectedMemberIds.map(String))
    const selectedInFilter = filteredIds.filter((id) => set.has(id)).length
    return selectedInFilter > 0 && selectedInFilter < filteredIds.length
  }, [filteredMembers, selectedMemberIds])

  // Calculate pagination
  const totalPages = Math.ceil(filteredMembers.length / MEMBERS_PER_PAGE)
  const totalMembers = members.length
  const filteredCount = filteredMembers.length

  // Reset to page 1 when search query changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  // Reset to page 1 when members change
  useEffect(() => {
    setCurrentPage(1)
  }, [members.length])

  const handleSearchChange = useCallback((value) => {
    setSearchQuery(value)
  }, [])

  const handlePageChange = useCallback((page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      // Scroll to top of members list
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [totalPages])

  return (
    <div className=" mx-auto space-y-6">
      {paymentStatusView && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`border rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
            paymentStatusView.status === 'success'
              ? 'bg-emerald-900/40 border-emerald-600/70'
              : 'bg-red-900/40 border-red-600/70'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              {paymentStatusView.status === 'success' ? (
                <CheckCircle2 className="text-emerald-400" size={28} />
              ) : (
                <XCircle className="text-red-400" size={28} />
              )}
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-white">
                {paymentStatusView.status === 'success' ? 'Payment Successful' : 'Payment Failed'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-200 mt-1">
                {paymentStatusView.status === 'success'
                  ? 'Your payment has been completed and verified via our payment gateway.'
                  : 'Your payment could not be completed or verification failed. No amount will be captured for this transaction.'}
              </p>
              {paymentStatusView?.result?.razorpayPaymentId && (
                <p className="text-[11px] sm:text-xs text-slate-300 mt-1">
                  Transaction reference:{" "}
                  <span className="font-mono">
                    {paymentStatusView.result.razorpayPaymentId}
                  </span>
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            {paymentStatusView.status === 'failure' &&   (
              <button
                type="button"
                onClick={() => {
                  setPaymentStatusView(null)
                }}
                className="px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-white bg-slate-800 border border-slate-600 hover:bg-slate-700 transition-colors w-full sm:w-auto"
              >
                Dismiss
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setPaymentStatusView(null)
              }}
              className="px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-slate-900 bg-white hover:bg-slate-100 transition-colors w-full sm:w-auto"
            >
              Back to members
            </button>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <div className="lg:col-span-2">
          <AddMemberForm
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            setErrors={setErrors}
            onAddMember={handleAddMember}
            isSubmitting={isSubmitting}
            clubId={clubId}
            isLoadingClubId={isLoadingClubId}
          />
        </div>
      </div>

      {/* Compact Payment Gateway */}
      {members.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900 border border-slate-700 rounded-lg overflow-visible shadow-md"
        >
          <div className="p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              {/* Left: Selection & Amount Display */}
              <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-3">
               

                {/* Selected count for bulk actions */}
                  {/* {selectedMembers.length > 0 && (
                    <span className="text-xs text-slate-400">
                      <span className="text-blue-400 font-medium">{selectedMembers.length}</span> selected for bulk membership / payment
                    </span>
                  )} */}

                {/* Fixed Amount Display */}
                {/* <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Amount per Member:</span>
                  <span className="text-sm font-semibold text-white">${memberPaymentAmount}</span>
                </div> */}

                {/* Total Display */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Total:</span>
                  <span className="text-lg font-bold text-blue-400">
                    {formatMoney(
                      pricingSummary.total,
                      pricingSummary.mixedCurrency ? selectedCurrency : pricingSummary.currency
                    )}
                  </span>
                  <span className="text-xs text-slate-500">
                    ({pricingSummary.memberCount} members
                    {pricingSummary.missingPriceCount > 0 ? `, ${pricingSummary.missingPriceCount} missing plan price` : ''})
                  </span>
                </div>
              </div>

              {/* Right: Create membership + Payment Buttons */}
              <div className="flex items-center gap-3 flex-wrap">
                <motion.button
                  onClick={handleCreateBulkMembership}
                  disabled={
                    selectedMemberIds.length === 0 ||
                    isSubmittingBulkMembership ||
                    (() => {
                      const idSet = new Set(selectedMemberIds.map(String))
                      const currentSelectedMembers = members.filter((m) =>
                        idSet.has(String(resolveMemberId(m)))
                      )
                      return (
                        currentSelectedMembers.filter(
                          (m) =>
                            resolveUserId(m) &&
                            resolveCategoryId(m) &&
                            resolvePlanId(m)
                        ).length === 0
                      )
                    })()
                  }
                  whileHover={{ scale: selectedMemberIds.length === 0 || isSubmittingBulkMembership ? 1 : 1.02 }}
                  whileTap={{ scale: selectedMemberIds.length === 0 || isSubmittingBulkMembership ? 1 : 0.98 }}
                  className="inline-flex items-center gap-2 bg-slate-700 hover:bg-slate-600 border border-slate-600 text-white font-semibold py-2 px-4 rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm whitespace-nowrap"
                >
                  {isSubmittingBulkMembership ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <UserPlus size={16} />
                      Pay All
                      {selectedMemberIds.length > 0 && (
                        <span className="bg-slate-600 text-slate-200 text-xs font-medium px-2 py-0.5 rounded">
                          {selectedMemberIds.length}
                        </span>
                      )}
                    </>
                  )}
                </motion.button>
                {/* <motion.button
                  onClick={() => {
                    if (selectedMembers.length === 0 && filteredMembers.length > 0) {
                      setSelectedMembers([...filteredMembers])
                      setTimeout(() => setBulkPaymentModalOpen(true), 100)
                    } else {
                      setBulkPaymentModalOpen(true)
                    }
                  }}
                  disabled={filteredMembers.length === 0}
                  whileHover={{ scale: filteredMembers.length === 0 ? 1 : 1.02 }}
                  whileTap={{ scale: filteredMembers.length === 0 ? 1 : 0.98 }}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2 px-4 rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm whitespace-nowrap"
                >
                  <CreditCard size={16} />
                  Pay for {selectedMembers.length > 0 ? selectedMembers.length : filteredMembers.length} Member{selectedMembers.length !== 1 && selectedMembers.length > 0 ? 's' : filteredMembers.length !== 1 ? 's' : ''} - ${selectedMembers.length > 0 ? selectedMembers.length * memberPaymentAmount : filteredMembers.length * memberPaymentAmount}
                </motion.button> */}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <MembersList 
        members={filteredMembers}
        onDelete={handleDeleteMember} 
        isLoading={isLoadingMembers}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        totalPages={totalPages}
        totalMembers={totalMembers}
        filteredCount={filteredCount}
        onMemberPayment={handleMemberPayment}
        selectedMembers={selectedMembers}
        onMemberSelect={handleMemberSelect}
        onSelectAll={handleSelectAll}
        isAllSelected={isAllSelected}
        isIndeterminate={isIndeterminate}
        onEditMember={handleEditMemberOpen}
        categories={categories}
        plans={plans}
        onCategoryChange={handleCategoryChange}
        onPlanChange={handlePlanChange}
        updatingMemberId={updatingMemberId}
        payingMemberId={payingMemberId}
      />

      {/* Individual Payment Modal */}
      <MemberPaymentModal
        isOpen={paymentModalOpen}
        onClose={handleClosePaymentModal}
        memberData={selectedMemberForPayment}
        amount={memberPaymentAmount}
        currency={selectedCurrency}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Bulk Payment Modal */}
      <BulkPaymentModal
        isOpen={bulkPaymentModalOpen}
        onClose={() => {
          setBulkPaymentModalOpen(false)
          setSelectedMemberIds([])
        }}
        selectedMembers={selectedMembers}
        amountPerMember={memberPaymentAmount}
        currency={selectedCurrency}
        onPaymentSuccess={(paymentResult) => {
          const finalStatus = resolvePaymentStatus(paymentResult)
          setPaymentStatusView({
            status: finalStatus,
            context: 'bulk',
            result: paymentResult,
          })

          if (finalStatus === 'success') {
            console.log('Bulk payment successful:', paymentResult)
            
            toast.success(`Bulk payment successful for ${paymentResult.memberCount} member(s)!`, {
              position: "top-right",
              autoClose: 3000,
              theme: "dark",
            })

            // Refresh members list
            if (clubId) {
              const refetchMembers = async () => {
                try {
                  const response = await getClubMembers(clubId)
                  const membersData = response?.data?.data || response?.data || []
                  if (Array.isArray(membersData)) {
                    const transformedMembers = membersData.map((member) => ({
                      id: member._id || member.id,
                      fullname:
                        member.fullname ||
                        member.user?.fullName ||
                        member.user?.fullname ||
                        member.user_id?.fullname ||
                        member.name ||
                        'N/A',
                      emailId:
                        member.emailId ||
                        member.user?.email ||
                        member.user_id?.email ||
                        member.email ||
                        'N/A',
                      mobileNo:
                        member.mobileNo ||
                        member.user?.mobile ||
                        member.user?.mobileNo ||
                        member.user_id?.mobileNo ||
                        member.phone ||
                        member.mobile ||
                        '',
                      role: member.role || member.user?.role || 'MEMBER',
                      ...member,
                    }))
                    setMembers(transformedMembers)
                    setSelectedMemberIds([]) // Clear selection after payment
                  }
                } catch (error) {
                  console.warn('Error refetching members after bulk payment:', error)
                }
              }
              refetchMembers()
            }
          } else {
            const message =
              paymentResult?.verificationError ||
              paymentResult?.errorMessage ||
              'Bulk payment failed or verification was unsuccessful. Please try again.'
            toast.error(message, {
              position: "top-right",
              autoClose: 3000,
              theme: "dark",
            })
          }
        }}
      />

      {/* Membership Payment Modal (after bulk membership creation) */}
      <MembershipPaymentModal
        isOpen={membershipPaymentModalOpen}
        onClose={() => {
          setMembershipPaymentModalOpen(false)
          setCreatedMembershipsForPayment([])
        }}
        createdMemberships={createdMembershipsForPayment}
        currency={bulkMembershipCurrencySnapshot}
        baseAmountRupees={membershipPaymentPricing?.mixedCurrency ? null : membershipPaymentPricing?.total}
        baseCurrency={membershipPaymentPricing?.mixedCurrency ? null : membershipPaymentPricing?.currency}
        isBaseAmountAvailable={
          !membershipPaymentPricing?.mixedCurrency &&
          membershipPaymentPricing?.missingPriceCount === 0 &&
          (membershipPaymentPricing?.total ?? 0) > 0
        }
        onPaymentSuccess={(result) => {
          const finalStatus = resolvePaymentStatus(result)
          setPaymentStatusView({
            status: finalStatus,
            context: 'membership',
            result,
          })

          if (finalStatus === 'success' && clubId) {
            getClubMembers(clubId)
              .then((response) => {
                const membersData = response?.data?.data || response?.data || []
                if (Array.isArray(membersData)) {
                  const transformedMembers = membersData.map((member) => ({
                    id: member._id || member.id,
                    fullname:
                      member.fullname ||
                      member.user?.fullName ||
                      member.user?.fullname ||
                      member.user_id?.fullname ||
                      member.name ||
                      'N/A',
                    emailId:
                      member.emailId ||
                      member.user?.email ||
                      member.user_id?.email ||
                      member.email ||
                      'N/A',
                    mobileNo:
                      member.mobileNo ||
                      member.user?.mobile ||
                      member.user?.mobileNo ||
                      member.user_id?.mobileNo ||
                      member.phone ||
                      member.mobile ||
                      '',
                    role: member.role || member.user?.role || 'MEMBER',
                    categoryId:
                      member.categoryId?._id ||
                      member.category_id?._id ||
                      member.categoryId ||
                      member.category_id ||
                      null,
                    planId:
                      member.planId?._id ||
                      member.plan_id?._id ||
                      member.planId ||
                      member.plan_id ||
                      null,
                    ...member,
                  }))
                  setMembers(transformedMembers)
                }
              })
              .catch((err) => console.warn('Error refetching members after membership payment:', err))
          }
          if (finalStatus === 'failure') {
            const message =
              result?.verificationError ||
              result?.errorMessage ||
              'Membership payment failed or verification was unsuccessful. Please try again.'
            toast.error(message, {
              position: "top-right",
              autoClose: 3000,
              theme: "dark",
            })
          }
          setMembershipPaymentModalOpen(false)
          setCreatedMembershipsForPayment([])
        }}
      />

      <DeleteMemberModal
        isOpen={!!deletingMember}
        member={deletingMember}
        isSubmitting={isDeletingMember}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDeleteMember}
      />

      <EditMemberModal
        isOpen={!!editingMember}
        member={editingMember}
        formData={editFormData}
        setFormData={setEditFormData}
        errors={editErrors}
        setErrors={setEditErrors}
        isSubmitting={isUpdatingMember}
        onClose={handleEditMemberClose}
        onSubmit={handleEditMemberSave}
        categories={categories}
        plans={plans}
      />
    </div>
  )
}

export default MemberShipDetails
