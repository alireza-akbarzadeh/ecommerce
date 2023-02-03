import HBMegaMenuResponsive from '@hasty-bazar-commerce/components/HBMegaMenu/components/HBMegaMenuResponsive'
import { DefaultLayout } from '@hasty-bazar-commerce/layout'

const megaMenu = () => {
  return <HBMegaMenuResponsive />
}

megaMenu.layout = ({ children }: any) => <DefaultLayout hideFooter>{children}</DefaultLayout>
export default megaMenu
