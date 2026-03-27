export function extractBulkMembershipResponse(response) {
  const createdRaw =
    response?.data?.data?.createdMemberships ??
    response?.data?.createdMemberships ??
    []
  const failedRaw =
    response?.data?.data?.failedUsers ??
    response?.data?.failedUsers ??
    []

  return {
    createdMemberships: Array.isArray(createdRaw) ? createdRaw : [],
    failedUsers: Array.isArray(failedRaw) ? failedRaw : [],
  }
}

/**
 * Build the memberships list we can pass into `MembershipPaymentModal`.
 * Ensures each item has: `_id`, `plan_id`, `category_id`, (and is within requested user_ids).
 */
export function prepareMembershipsForPayment({ membersPayload, createdMemberships, failedUsers }) {
  const payload = Array.isArray(membersPayload) ? membersPayload : []
  const created = Array.isArray(createdMemberships) ? createdMemberships : []
  const failed = Array.isArray(failedUsers) ? failedUsers : []

  const out = []
  const seen = new Set()
  const requestedUserIds = new Set(payload.map((m) => String(m.user_id)))
  const payloadByUserId = new Map(payload.map((m) => [String(m.user_id), m]))

  const pushIfValid = (m) => {
    if (!m) return

    const membershipId = m._id ?? m.id
    const rawPlanId =
      typeof m.plan_id === 'object'
        ? (m.plan_id?._id ?? m.plan_id?.id)
        : (m.plan_id ?? m.planId)
    const rawCategoryId =
      typeof m.category_id === 'object'
        ? (m.category_id?._id ?? m.category_id?.id)
        : (m.category_id ?? m.categoryId)

    const userId =
      (typeof m.user_id === 'object' ? (m.user_id?._id ?? m.user_id?.id) : m.user_id) ??
      (typeof m.user === 'object' ? (m.user?._id ?? m.user?.id) : null) ??
      m.userId ??
      null

    if (userId && !requestedUserIds.has(String(userId))) return

    const payloadForUser = userId != null ? payloadByUserId.get(String(userId)) : undefined
    const planId = rawPlanId ?? payloadForUser?.plan_id ?? null
    const categoryId = rawCategoryId ?? payloadForUser?.category_id ?? null

    if (!membershipId || !planId || !categoryId) return
    const key = String(membershipId)
    if (seen.has(key)) return
    seen.add(key)
    out.push({
      ...m,
      _id: membershipId,
      plan_id: planId,
      category_id: categoryId,
    })
  }

  created.forEach(pushIfValid)
  failed.forEach((fu) => pushIfValid(fu?.membership))

  return out
}

