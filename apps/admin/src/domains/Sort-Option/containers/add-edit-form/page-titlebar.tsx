import HBGridToolbar from 'libs/core/src/components/HBGrigToolbar/HBGrigToolbar'

type PageTitleBarProps = {
  handleRefresh: () => void
}
const PageTitleBar = ({ handleRefresh }: PageTitleBarProps) => {
  return (
    <HBGridToolbar
      searchProps={{ show: false }}
      editProps={{ show: false }}
      deleteProps={{ show: false }}
      statusProps={{ show: false }}
      moreProps={{ show: false }}
      addProps={{ icon: 'check', type: 'submit' }}
      refreshProps={{ onClick: handleRefresh }}
    />
  )
}
export default PageTitleBar
