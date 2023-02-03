import { Link as MaterialLink, LinkProps as MaterialLinkProps } from '@mui/material'
import NextLink, { LinkProps } from 'next/link'
import { isNil } from 'ramda'
import { FC, ReactNode } from 'react'

type HBLinkProps = Omit<MaterialLinkProps, 'href'> &
  Pick<LinkProps, 'locale' | 'passHref' | 'shallow'> & {
    href?: LinkProps['href']
  }

const NextCustomLink = ({
  href,
  children,
  ...props
}: Partial<LinkProps> & { children?: ReactNode }): JSX.Element => {
  const isLink = !isNil(href)
  if (!isLink) {
    return <>{children}</>
  }
  return <NextLink {...props} {...{ href, children }} />
}

const HBLink: FC<HBLinkProps> = ({ href, passHref = true, shallow, ...materialLinkProps }) => {
  return (
    <NextCustomLink
      {...{
        href,
        passHref,
        shallow,
      }}
    >
      <MaterialLink
        underline="always"
        style={{ cursor: 'pointer', textDecoration: 'none' }}
        {...materialLinkProps}
      />
    </NextCustomLink>
  )
}
export default HBLink
