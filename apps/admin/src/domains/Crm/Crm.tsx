import { BreadCrumbSection } from '@hasty-bazar/admin-shared/components/BreadCrumb'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import React, { useCallback, useState } from 'react'
import { useIntl } from 'react-intl'
import { CrmFilter, CrmGrid } from './containers'
import crmMessages from './crm.message'

export type CrmProps = {
  partyId?: string
}
export default function CrmPage({ partyId }: CrmProps) {
  const { formatMessage } = useIntl()
  const userFilter = partyId ? `?Filter=PartyId_Equal_--PartyId&PartyId=${partyId}` : ''
  const [actionUrl, setActionUrl] = useState<string | undefined>(
    `${process.env.NEXT_PUBLIC_GATEWAY}/Admin/CRM/Tickets${userFilter}`,
  )
  const breadcrumbs = [
    { url: '/', title: formatMessage(phrasesMessages.dashboard) },
    { url: '#', title: formatMessage(crmMessages.crmTitle) },
  ]

  const CrmGridMemo = useCallback(() => <CrmGrid actionUrl={actionUrl} />, [actionUrl])

  return (
    <>
      {!partyId && (
        <BreadCrumbSection title={formatMessage(crmMessages.crmTitle)} breadItems={breadcrumbs} />
      )}
      <CrmFilter changeFilter={(actionUrl) => setActionUrl(actionUrl)} partyId={partyId} />
      <CrmGridMemo />
    </>
  )
}
