import { useCallback, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { extractBulkMembershipResponse, prepareMembershipsForPayment } from '../utils/membershipPaymentFlow'

/**
 * Reusable flow: create membership(s) via bulk API -> open MembershipPaymentModal.
 * You provide the "create" and "refetch" functions so this hook stays UI/feature agnostic.
 */
export function useMembershipCreateAndPay({
  createBulkMembership,
  refetchMembers, // optional async fn
  onOpenPaymentModal, // fn({ membershipsForPayment, currencySnapshot })
  getCurrencySnapshot, // fn() => 'INR' | 'USD' | ...
}) {
  const [payingKey, setPayingKey] = useState(null) // string | null

  const start = useCallback(async ({ membersPayload, payingId = null, successToast }) => {
    if (!Array.isArray(membersPayload) || membersPayload.length === 0) {
      toast.error('No members selected for membership creation.', {
        position: 'top-right',
        autoClose: 3000,
        theme: 'dark',
      })
      return { ok: false }
    }

    const currencySnapshot = String(getCurrencySnapshot?.() || 'INR').toUpperCase()

    try {
      if (payingId != null) setPayingKey(String(payingId))

      const response = await createBulkMembership({ members: membersPayload })
      const { createdMemberships, failedUsers } = extractBulkMembershipResponse(response)

      const membershipsForPayment = prepareMembershipsForPayment({
        membersPayload,
        createdMemberships,
        failedUsers,
      })

      if (typeof refetchMembers === 'function') {
        try {
          await refetchMembers()
        } catch (e) {
          // best-effort only
          console.warn('Refetch members failed after membership creation:', e)
        }
      }

      if (successToast) {
        toast.success(successToast, { position: 'top-right', autoClose: 3000, theme: 'dark' })
      }

      if (membershipsForPayment.length === 0) {
        toast.warning('Membership created but could not be prepared for payment. Please contact support.', {
          position: 'top-right',
          autoClose: 4000,
          theme: 'dark',
        })
        return { ok: false, currencySnapshot, membershipsForPayment: [] }
      }

      if (typeof onOpenPaymentModal === 'function') {
        onOpenPaymentModal({ membershipsForPayment, currencySnapshot })
      }

      return { ok: true, currencySnapshot, membershipsForPayment }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to create membership.'
      toast.error(message, { position: 'top-right', autoClose: 4000, theme: 'dark' })
      return { ok: false, error, currencySnapshot }
    } finally {
      setPayingKey(null)
    }
  }, [createBulkMembership, getCurrencySnapshot, onOpenPaymentModal, refetchMembers])

  return useMemo(() => ({ payingKey, start }), [payingKey, start])
}

