import { HBIconButton, HBSelect } from '@hasty-bazar/core'
import {
  Grid,
  List,
  ListItemButton,
  SelectChangeEvent,
  Stack,
  SwipeableDrawer,
  Typography,
  useTheme,
} from '@mui/material'
import { FC } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import SearchMessages from '../Search.messages'

interface IProps {
  setSortDrawerOpen(v: boolean): void
  sortDrawerOpen: boolean
  handleSorting(value: string): void
  sortingItems: { title: string; value: string | number }[]
  sortBy: string
}
const SortFilterResult: FC<IProps> = (props) => {
  const theme = useTheme()
  const { formatMessage } = useIntl()
  return (
    <>
      <Stack
        direction="row"
        sx={{
          display: { xs: 'none', md: 'flex' },
          justifyContent: { sx: 'space-between', sm: 'flex-end' },
        }}
      >
        <Grid item xs={6} container justifyContent="flex-end">
          <HBSelect
            size="small"
            label={formatMessage(SearchMessages.orderingBy)}
            menuItem={[
              {
                title: formatMessage(SearchMessages.orderingDefaultMessage),
                value: 0,
              },
              ...props.sortingItems,
            ]}
            value={props.sortBy ? +props.sortBy : 0}
            onChange={(e: SelectChangeEvent<string>) => props.handleSorting(e.target.value)}
            sx={{
              minWidth: 185,
              height: 36,
              borderRadius: 2,
              '& .MuiInputLabel-root': {
                color: 'grey.900',
              },
            }}
            inputLabelProps={{
              sx: {
                lineHeight: 1.1,
              },
            }}
          />
        </Grid>
      </Stack>

      <SwipeableDrawer
        anchor="bottom"
        open={props.sortDrawerOpen}
        onOpen={() => props.setSortDrawerOpen(true)}
        onClose={() => props.setSortDrawerOpen(false)}
        sx={{ display: { md: 'none' } }}
      >
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item xs={8} sm={8} container justifyContent="space-between" alignItems="center">
            <HBIconButton
              variant="text"
              iconStyle={{
                color: theme.palette.grey[500],
                margin: theme.spacing(0, 1, 0, 2),
                fontSize: '20px',
              }}
              sx={{ display: { md: 'none' } }}
              icon="times"
              onClick={() => props.setSortDrawerOpen(false)}
            />
            <Typography variant="h6">
              <FormattedMessage {...SearchMessages.orderingBy} />
            </Typography>
          </Grid>
        </Grid>
        <Grid>
          <List sx={{ width: '100%', backgroundColor: 'common.white' }}>
            <ListItemButton
              onClick={() => {
                props.handleSorting('')
                props.setSortDrawerOpen(false)
              }}
            >
              <Typography variant="subtitle2">
                {formatMessage(SearchMessages.orderingDefaultMessage)}
              </Typography>
            </ListItemButton>
            {props.sortingItems?.map((item) => (
              <ListItemButton
                key={item.value}
                sx={{ color: props.sortBy === item.value ? 'primary.main' : 'unset' }}
                onClick={() => {
                  props.handleSorting(item?.value?.toString())
                  props.setSortDrawerOpen(false)
                }}
              >
                <Typography variant="subtitle2">{item.title}</Typography>
              </ListItemButton>
            ))}
          </List>
        </Grid>
      </SwipeableDrawer>
    </>
  )
}

export default SortFilterResult
