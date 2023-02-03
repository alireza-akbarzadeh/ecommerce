import { HBExplanationSummary } from '@hasty-bazar/admin-shared/components'
import { HBExplanation } from '@hasty-bazar/admin-shared/containers/HBExplanation'
import { HBHistoryExplanation } from '@hasty-bazar/admin-shared/containers/HBHistoryExplanation'
import Box from '@mui/material/Box'
import { useState } from 'react'
import { useIntl } from 'react-intl'
import MegaMenuPageMessages from '../../MegaMenu.messages'
import TreeStructureForm from './treeStructureForm'
import UploadFile from './uploadFile'

type MainContentExplanationProps = {
  menuItemsData: any
  menuId: string
  action: string
  handleSave: any
}
const MainContentExplanation = ({
  menuItemsData,
  menuId,
  action,
  handleSave,
}: MainContentExplanationProps) => {
  const { formatMessage } = useIntl()
  const [expandedItem, setExpandItems] = useState<boolean>(true)
  const [expandedUpload, setExpandedUpload] = useState<boolean>(true)

  return (
    <>
      <HBExplanation
        expanded={expandedItem}
        onChange={(_, expandedItem) => {
          setExpandItems(expandedItem)
        }}
        sx={{ background: 'common.white' }}
        summary={
          <HBExplanationSummary
            title={formatMessage(MegaMenuPageMessages.treeStructure)}
            icon={'gameStructure'}
          />
        }
        detail={<TreeStructureForm menuItemsData={menuItemsData} />}
      />
      <HBExplanation
        expanded={expandedUpload}
        onChange={(_, expandedUpload) => {
          setExpandedUpload(expandedUpload)
        }}
        sx={{ background: 'common.white' }}
        summary={
          <HBExplanationSummary
            title={formatMessage(MegaMenuPageMessages.menuContent)}
            icon={'listUl'}
          />
        }
        detail={<UploadFile menuId={menuId} action={action} handleSave={handleSave} />}
      />
      <HBHistoryExplanation detail={<Box />} hidden />
    </>
  )
}
export default MainContentExplanation
