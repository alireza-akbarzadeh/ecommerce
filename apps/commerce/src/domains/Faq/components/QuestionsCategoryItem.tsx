import { QuestionCategoryQueryModel } from '@hasty-bazar-commerce/services/catalogApi.generated'
import { Stack, Theme, Typography, useMediaQuery } from '@mui/material'
import { Box } from '@mui/system'
import { FC } from 'react'
import { useFaqContext } from '../context/FaqContext'
import { CategoryItem } from './FaqComponents.styles'

interface IProps {
  item: QuestionCategoryQueryModel
}

const QuestionsCategoryItem: FC<IProps> = ({ item }) => {
  const breakpointDownMd = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  const { categoryId, setCategoryId } = useFaqContext()

  return (
    <CategoryItem
      onClick={() => setCategoryId(item?.id || '')}
      sx={item.id === categoryId ? { borderColor: 'primary.main' } : {}}
    >
      <Box sx={{ mb: { xs: 0, md: 4 }, mr: { xs: 1.5, md: 0 } }}>
        <Stack
          component="img"
          src={`${process.env.NEXT_PUBLIC_CDN}/${item.icon}`}
          width={27}
          height={27}
          alt={item.name || 'Category Icon'}
        />
      </Box>
      <Typography variant="subtitle1" color="grey[900]">
        {item.name}
      </Typography>
    </CategoryItem>
  )
}

export default QuestionsCategoryItem
