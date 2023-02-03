import { BreadCrumbSection } from '@hasty-bazar/admin-shared/components/BreadCrumb'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { HBIcon } from '@hasty-bazar/core'
import { Box, Typography } from '@mui/material'
import { useCallback, useState } from 'react'
import { useIntl } from 'react-intl'
import bulletinRequestsMessages from './bulletinRequests.messages'
import { BulletinRequestsGrid } from './containers'
import BulletinRequestsFilters from './containers/bulletin-requests-filters'

const BulletinRequests = () => {
  const { formatMessage } = useIntl()
  const [actionUrl, setActionUrl] = useState<string | undefined>()

  const breadcrumbs = [
    {
      url: '/',
      title: formatMessage(phrasesMessages.dashboard),
    },
    {
      url: '#',
      title: formatMessage(bulletinRequestsMessages.bulletinRequests),
    },
  ]

  const BulletinRequestsGridMemo = useCallback(
    () => <BulletinRequestsGrid actionUrl={actionUrl} />,
    [actionUrl],
  )
  return (
    <>
      <Box>
        <BreadCrumbSection
          title={formatMessage(bulletinRequestsMessages.bulletinRequests)}
          breadItems={breadcrumbs}
        />
      </Box>
      <Box bgcolor={'background.paper'} px={4} py={4}>
        <Typography variant="h5">
          <HBIcon type="shoppingBasket" />
          {formatMessage(bulletinRequestsMessages.requests)}
        </Typography>
        <BulletinRequestsFilters changeFilter={(actionUrl) => setActionUrl(actionUrl)} />
        <BulletinRequestsGridMemo />
      </Box>
    </>
  )
}
export default BulletinRequests
