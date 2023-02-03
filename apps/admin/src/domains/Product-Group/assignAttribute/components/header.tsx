import { HBSwitchController } from '@hasty-bazar/admin-shared/containers/HBSwitchController'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { useIntl } from 'react-intl'
import ProductGroupPageMessages from '../../ProductGroupPage.messages'

const Header = () => {
  const { formatMessage } = useIntl()

  return (
    <Grid container spacing={4} mb={5} sx={{ alignItems: 'center' }}>
      <Grid item xs={12} sm={6}>
        <Typography variant="h4">
          {formatMessage(ProductGroupPageMessages.generalSpecificationOfAttribute)}
        </Typography>
      </Grid>
      <Grid
        item
        xs={12}
        sm={6}
        sx={{ flexGrow: 2, display: 'flex', justifyContent: 'end', alignItems: 'center' }}
      >
        <Typography mr={1}>{formatMessage(ProductGroupPageMessages.attributeStatus)}</Typography>
        <HBSwitchController name={'isActive'} disabled={false} />
      </Grid>
    </Grid>
  )
}
export default Header
