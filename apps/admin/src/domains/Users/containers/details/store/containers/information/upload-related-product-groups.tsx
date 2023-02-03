import userPageMessages from '@hasty-bazar-admin/domains/Users/UserPage.messages'
import { useGetAdminCatalogVendorsGetRelatedGroupsByIdQuery } from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { RoleResult } from '@hasty-bazar/admin-shared/services/idrApi.generated'
import { HBClassesType, HBIcon } from '@hasty-bazar/core'
import { Avatar, Box, List, ListItem, Typography } from '@mui/material'
import { useIntl } from 'react-intl'

type HBPageClassnames =
  | 'container'
  | 'containerTitle'
  | 'containerWrapper'
  | 'list'
  | 'listItems'
  | 'listItemsText'

const classes: HBClassesType<HBPageClassnames> = {
  containerWrapper: ({ spacing }) => ({
    borderRadius: spacing(0.25),
    my: 4,
  }),
  container: ({ palette, spacing }) => ({
    border: 1,
    borderColor: palette.grey[300],
    p: 6,
    position: 'relative',
    borderRadius: spacing(0.25),
  }),
  containerTitle: ({ spacing, palette }) => ({
    position: 'relative',
    display: 'inline-block',
    top: spacing(-8),
    backgroundColor: palette.common.white,
    px: 2,
    color: palette.warning.main,
  }),
  list: ({ spacing, palette }) => ({
    display: 'flex',
    flexDirection: 'row',
    padding: spacing(0, 0, 4, 0),
    overflow: 'auto',
  }),
  listItems: ({ spacing, palette }) => ({
    display: 'flex',
    alignItems: 'center',
    width: 'unset',
    flexDirection: 'column',
    border: `${spacing(0.25)} solid ${palette.grey[500]}`,
    borderRadius: spacing(2),
    minWidth: 200,
    minHeight: 110,
    marginRight: spacing(4),
  }),
  listItemsText: () => ({
    display: 'flex',
    alignItems: 'center',
    flexGrow: 1,
    width: '100%',
    justifyContent: 'space-between',
  }),
}
type UploadRelatedProductGroupsProps = {
  detailsRole: RoleResult
}
const UploadRelatedProductGroups = ({ detailsRole }: UploadRelatedProductGroupsProps) => {
  const { formatMessage } = useIntl()
  const list = [{ number: 123 }, { number: 45 }]

  const { data: { data: relatedGroupsData = [] } = {} } =
    useGetAdminCatalogVendorsGetRelatedGroupsByIdQuery(
      {
        'client-name': 'get-vendor',
        'client-version': '0',
        id: detailsRole.partyRoleId || '',
      },
      {
        skip: !detailsRole.partyRoleId,
      },
    )

  return (
    <Box sx={classes.containerWrapper} bgcolor="common.white">
      <Box sx={classes.container}>
        <Typography sx={classes.containerTitle}>
          {formatMessage(userPageMessages.relatedProductGroups)}
        </Typography>
        <List sx={classes.list}>
          {relatedGroupsData?.map((item: any) => (
            <ListItem sx={classes.listItems}>
              {item.iconPath ? (
                <Avatar src={`${process.env.NEXT_PUBLIC_CDN}/${item.iconPath}`} variant="square" />
              ) : (
                <HBIcon type="postcard" size="large" />
              )}
              <Box sx={classes.listItemsText}>
                <Typography>{item.title}</Typography>
                <Typography color={'primary'}>
                  {item.count}{' '}
                  <Typography component={'span'} color="gray">
                    {formatMessage(userPageMessages.number)}
                  </Typography>
                </Typography>
              </Box>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  )
}

export default UploadRelatedProductGroups
