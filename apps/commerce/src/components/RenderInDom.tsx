import { NoSsr } from '@mui/material'
import { FC, PropsWithChildren } from 'react'
import { createPortal } from 'react-dom'

interface RenderInDomProps {
  containerId:
    | 'after-search-box-in-header'
    | 'before-search-box-in-header'
    | 'summary-cart'
    | 'bottom-navigation-top-box'
    | 'mainHeader'
    | 'containerHeader'
}

const RenderInDom: FC<PropsWithChildren<RenderInDomProps>> = ({ containerId, children }) => {
  if (typeof document !== 'undefined' && document?.getElementById?.(containerId))
    return (
      <NoSsr>
        <div>{createPortal(children, document.getElementById(containerId)!)}</div>
      </NoSsr>
    )

  return null
}

export default RenderInDom
