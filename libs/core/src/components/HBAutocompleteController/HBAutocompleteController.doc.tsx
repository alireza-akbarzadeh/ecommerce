import {
  Box,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
} from '@mui/material'

const HBAutocompleteControllerDoc = () => {
  return (
    <Box dir={'rtl'}>
      <Typography variant="h4" component="h1">
        محتوای مستند
      </Typography>
      <List>
        <ListItem alignItems={'center'}>
          <ListItemText>Options</ListItemText>
          <ListItemSecondaryAction>
            یک آرایه شامل مقادیر ورودی کامپوننت می باشد
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem alignItems={'center'}>
          <ListItemText>label</ListItemText>
          <ListItemSecondaryAction>عنوان نمایشی داخل کامپوننت</ListItemSecondaryAction>
        </ListItem>
        <ListItem alignItems={'center'}>
          <ListItemText>paginationProps</ListItemText>
          <ListItemSecondaryAction>
            در صورت پاس دادن paginationProps دیتا به صورت paginate & virtualize میشود
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem alignItems={'center'}>
          <ListItemText>controllerProps</ListItemText>
          <ListItemSecondaryAction>
            مقادیر react hook form زا داخل این مقدار بگزارید
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem alignItems={'center'}>
          <ListItemText>autoCompleteProps</ListItemText>
          <ListItemSecondaryAction>
            تمامی مقادیر autoComplete در این مقدار قرار میگیرد
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem alignItems={'center'}>
          <ListItemText>textFiledProps</ListItemText>
          <ListItemSecondaryAction>
            تمامی مقادیر textFiledProps در این مقدار قرار میگیرد
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem alignItems={'center'}>
          <ListItemText>field name</ListItemText>
          <ListItemSecondaryAction>
            مقدار ی که به React hook form پاس میدیم و در نهات این مقدار داخل فرم handle submit
            میشینه{' '}
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem alignItems={'center'}>
          <ListItemText>getOptionLabel</ListItemText>
          <ListItemSecondaryAction>
            مقداری که بعد از انتخاب ایتم ها درون input قرار میگرد{' '}
          </ListItemSecondaryAction>
        </ListItem>
      </List>
      <Typography variant="subtitle1" component="h4">
        مستندات بیشتر کامپوننت
      </Typography>
      <a
        href="https://mui.com/material-ui/react-autocomplete/#virtualization"
        target="_blank"
        rel="noreferrer"
      >
        <Typography variant="subtitle1" component="div">
          مستندات autocomplete controller
        </Typography>
      </a>
    </Box>
  )
}

export default HBAutocompleteControllerDoc
