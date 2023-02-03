import HBImg from '@hasty-bazar/admin-shared/containers/HBFileUploader/containers/HBImage.style'
import { QuestionCategoryQueryModel } from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { HBIcon } from '@hasty-bazar/core'
import { Box, Paper, styled } from '@mui/material'
import ListItemText from '@mui/material/ListItemText'
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem'
import MenuList from '@mui/material/MenuList'
import Typography from '@mui/material/Typography'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import FaqPageMessages from '../FaqPage.messages'

const HBMenuItem = styled(MenuItem)(({ theme }) => ({
  [`&.${menuItemClasses.root}`]: {
    borderRadius: theme.spacing(2),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  [`&.${menuItemClasses.selected}`]: {
    backgroundColor: 'transparent',
  },
  [`&.${menuItemClasses.selected}:after`]: {
    content: '""',
    position: 'absolute',
    left: 0,
    width: 4,
    height: 40,
    backgroundColor: theme.palette.primary.main,
    borderRadius: theme.spacing(0, 4, 4, 0),
  },
  [`&.${menuItemClasses.gutters}`]: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    paddingRight: theme.spacing(4),
    paddingLeft: theme.spacing(4),
  },
}))
interface questionCategoryProps {
  data: QuestionCategoryQueryModel[]
}
function FaqQuestionCategoryList({ data }: questionCategoryProps) {
  const router = useRouter()

  const { formatMessage } = useIntl()
  return (
    <Paper
      sx={{
        maxWidth: '100%',
        borderRadius: ({ spacing }) => spacing(4),
        border: 1,
        borderColor: 'grey.200',
        p: 6,
      }}
      elevation={0}
    >
      <MenuList>
        <Box py={3} px={4} color="grey.700">
          <Typography variant="body2">
            <HBIcon type="sitemap" size="small" sx={{ mr: 3 }} />
            {formatMessage(FaqPageMessages.questionsCategories)}
          </Typography>
        </Box>
        {data?.map((item) => {
          return (
            <HBMenuItem
              onClick={() => {
                router.replace(`/faq/show/?questionCategoryId=${item.id}`)
              }}
              selected={item.id === router?.query?.questionCategoryId}
            >
              <ListItemText>
                <Typography
                  variant="body2"
                  color={
                    item.id === router?.query?.questionCategoryId ? 'primary.main' : 'grey.500'
                  }
                >
                  {item.name}
                </Typography>
              </ListItemText>
              {item?.icon && (
                <HBImg
                  src={process.env.NEXT_PUBLIC_CDN + String(item?.icon)}
                  sx={{
                    width: 32,
                    height: 32,
                    objectFit: 'cover',
                    borderRadius: ({ spacing }) => spacing(6),
                  }}
                />
              )}
            </HBMenuItem>
          )
        })}
      </MenuList>
    </Paper>
  )
}

export default FaqQuestionCategoryList
