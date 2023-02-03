import { HBAutoComplete, HBRadioButton, HBTextField } from '@hasty-bazar/core'
import { Stack, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useIntl } from 'react-intl'
import ReportDailySaleMessages from '../../ReportDailySale.messages'
import { DownloadExcel, IContentChangeInfo } from '../../types/Content'
const ContentChangeInfo = ({
  handleCheckItem,
  statusItems,
  download,
  setDownload,
  components,
}: IContentChangeInfo) => {
  const { formatMessage } = useIntl()

  const outPutList = [
    { value: 'Select', label: formatMessage(ReportDailySaleMessages.selectRows) },
    { value: 'All', label: formatMessage(ReportDailySaleMessages.allRows) },
  ]
  const changeStatus = [
    { value: 'Notified', label: formatMessage(ReportDailySaleMessages.Notified) },
    { value: 'NotNotified', label: formatMessage(ReportDailySaleMessages.notNotified) },
  ]

  return (
    <Stack>
      {components === 'inform' ? (
        <>
          <Box display={'flex'} alignItems="center" gap={1}>
            <HBRadioButton
              value={statusItems}
              checked={statusItems === 'All'}
              name={statusItems}
              onChange={() => handleCheckItem('All')}
            />
            <Typography>{formatMessage(ReportDailySaleMessages.all)}</Typography>
          </Box>
          <Box display={'flex'} alignItems="center" gap={1}>
            <HBRadioButton
              value={statusItems}
              checked={statusItems === 'Notified'}
              name={statusItems}
              onChange={() => handleCheckItem('Notified')}
            />
            <Typography>{formatMessage(ReportDailySaleMessages.Notified)}</Typography>
          </Box>
          <Box display={'flex'} alignItems="center" gap={1}>
            <HBRadioButton
              value={statusItems}
              checked={statusItems === 'NotNotified'}
              name={statusItems}
              onChange={() => handleCheckItem('NotNotified')}
            />
            <Typography>{formatMessage(ReportDailySaleMessages.notNotified)}</Typography>
          </Box>
        </>
      ) : components === 'excel' ? (
        <>
          <Box display={'flex'} alignItems="center" gap={1}>
            <HBRadioButton
              value={statusItems}
              checked={download === 'All'}
              name={statusItems}
              onChange={() => setDownload('All')}
            />
            <Typography>{formatMessage(ReportDailySaleMessages.all)}</Typography>
          </Box>

          <Box display={'flex'} alignItems="center" gap={1}>
            <HBRadioButton
              value={statusItems}
              checked={download === 'Select'}
              name={statusItems}
              onChange={() => setDownload('Select')}
            />
            <Typography>{formatMessage(ReportDailySaleMessages.selectable)}</Typography>
          </Box>
        </>
      ) : (
        <>
          <Box mb={4}>
            <HBAutoComplete
              id="outPutList"
              options={outPutList}
              fullWidth
              onChange={(_, event) => setDownload((event as { value: DownloadExcel }).value)}
              renderInput={(params) => (
                <HBTextField
                  {...params}
                  label={formatMessage(ReportDailySaleMessages.conditionList)}
                />
              )}
            />
          </Box>
          <Box mt={4}>
            <HBAutoComplete
              id="changeStatus"
              options={changeStatus}
              fullWidth
              onChange={(_, event) => setDownload((event as { value: DownloadExcel }).value)}
              renderInput={(params) => (
                <HBTextField
                  {...params}
                  label={formatMessage(ReportDailySaleMessages.changeStatus)}
                />
              )}
            />
          </Box>
        </>
      )}
    </Stack>
  )
}

export default ContentChangeInfo
