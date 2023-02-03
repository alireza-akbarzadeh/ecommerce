import { SectionByContentQueryResult } from '@hasty-bazar-commerce/services/cmsApi.generated'
import { Container } from '@mui/material'
import { FC, ReactNode, useState } from 'react'
import Store from './containers/storeContainer/Store'
import StoreHeaderContainer from './containers/storeHeaderContainer'
import Views from './containers/viewsContainer/Views'
import { VendorVitrinDesc } from './containers/vitrinContainer/VendorVitrinDesc/VendorVitrinDesc'
import { Vitrin } from './containers/vitrinContainer/Vitrin'
import { VendorToolbar } from './VendorToolbar/VendorToolbar'
interface IProps {
  sections?: SectionByContentQueryResult[] | null
}

export type TabType = 'vitrin' | 'store' | 'views'
export const VendorPage: FC<IProps> = (props) => {
  const [activeTab, setActiveTab] = useState<TabType>('vitrin')

  const renderComponent: Record<TabType, ReactNode> = {
    vitrin: <Vitrin sections={props.sections} />,
    store: <Store />,
    views: <Views />,
  }

  return (
    <Container
      maxWidth="lg"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        p: { xs: 0 },
      }}
    >
      <VendorToolbar activeTab={activeTab} onChangeTab={(tab: TabType) => setActiveTab(tab)} />

      {activeTab === 'store' && <StoreHeaderContainer />}
      {activeTab === 'vitrin' && (
        <VendorVitrinDesc
          isActive={activeTab === 'vitrin'}
          onChangeTab={(tab: TabType) => setActiveTab(tab)}
        />
      )}

      {renderComponent[activeTab]}
    </Container>
  )
}
