import { FC, useMemo } from 'react'
import TextWithColor from '../TextWithColor'
import TextWithIcon from '../TextWithIcon'

interface IAttributeHandlerProps {
  attributes: {
    icon?: string | null
    isTop?: boolean
    value?: string | null
    color?: string | null
  }[]
  specialAttributes: { icon?: string | null; valueTitle?: string | null; color?: string | null }[]
}

const AttributeHandler: FC<IAttributeHandlerProps> = (props) => {
  const { attributes, specialAttributes } = props

  const renderAttributes = useMemo(() => {
    const topAttributes = attributes
      ?.filter((i) => i.isTop)
      .slice(0, 3 - (specialAttributes?.length ?? 0))
    const notTopAttribute = attributes
      .filter((i) => !i.isTop)
      .slice(0, 3 - ((specialAttributes?.length ?? 0) + topAttributes.length))

    return [...topAttributes, ...notTopAttribute].map((attr) => {
      return attr.icon ? (
        <TextWithIcon icon={`${process.env.NEXT_PUBLIC_CDN}${attr.icon}`} text={attr.value ?? ''} />
      ) : (
        <TextWithColor color={attr.color ?? ''} text={attr.value ?? ''} />
      )
    })
  }, [attributes, specialAttributes])
  return (
    <>
      {/* special attributes */}
      {specialAttributes?.map((attr) => {
        return attr.icon ? (
          <TextWithIcon
            icon={`${process.env.NEXT_PUBLIC_CDN}${attr.icon}`}
            text={attr.valueTitle ?? ''}
          />
        ) : (
          <TextWithColor color={attr.color ?? ''} text={attr.valueTitle ?? ''} />
        )
      })}

      {/*attributes */}
      {renderAttributes}
    </>
  )
}

export default AttributeHandler
