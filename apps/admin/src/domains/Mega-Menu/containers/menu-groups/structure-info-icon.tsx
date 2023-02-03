import { HBIconButton } from '@hasty-bazar/core'
import { useRouter } from 'next/router'

interface StructureInfoIconProps {
  selectedId: string
}

const StructureInfoIcon = (props: StructureInfoIconProps) => {
  const { selectedId } = props
  const router = useRouter()
  const goToStructureInfoPage = () => {
    router.push(`mega-menu/structure/${selectedId}/add`)
  }
  return (
    <HBIconButton
      type="button"
      icon="gameStructure"
      name="trees"
      variant="text"
      iconSize="medium"
      sx={{ color: 'info.main' }}
      onClick={goToStructureInfoPage}
    />
  )
}
export default StructureInfoIcon
