import { BreadCrumbSection } from '@hasty-bazar/admin-shared/components/BreadCrumb'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import React from 'react'
import { useIntl } from 'react-intl'
import { MessagesPage } from '../Users/containers/details/messages'
import userPageMessages from '../Users/UserPage.messages'

export default function Messages() {
  const { formatMessage } = useIntl()

  const breadcrumbs = [
    {
      url: '/',
      title: formatMessage(phrasesMessages.dashboard),
    },
    {
      url: '#',
      title: formatMessage(userPageMessages.userMessages),
    },
  ]

  return (
    <>
      <BreadCrumbSection
        title={formatMessage(userPageMessages.userMessages)}
        breadItems={breadcrumbs}
      />
      <MessagesPage />
    </>
  )
}
