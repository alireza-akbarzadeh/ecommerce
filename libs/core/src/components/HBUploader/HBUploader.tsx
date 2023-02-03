import { Typography } from '@mui/material'
import { ForwardedRef, forwardRef, ReactNode, useCallback, useEffect, useState } from 'react'
import Dropzone, { DropzoneOptions, DropzoneRef, DropzoneState, useDropzone } from 'react-dropzone'
import { byteConvertor } from '../../utils/numbers'
import { HBIcon } from '../HBIcon'
import { useHBUploaderStyle } from './HBUploader.styles'

export interface HBUploaderProps extends DropzoneOptions {
  classes?: Partial<typeof useHBUploaderStyle>
  label?: string
  openLabel?: string
  icon?: ReactNode
  children?: (dropzoneState: DropzoneState) => ReactNode | ReactNode
}

export interface FileProps extends File {
  path?: string
}

const HBUploader = forwardRef(
  <T extends DropzoneRef>(props: HBUploaderProps, ref: ForwardedRef<T>) => {
    const [myFiles, setMyFiles] = useState<FileProps[]>([])

    const onDrop = useCallback(
      (acceptedFiles: FileProps[]) => {
        setMyFiles([...myFiles, ...acceptedFiles])
      },
      [myFiles],
    )

    const { getRootProps, getInputProps, acceptedFiles, isFileDialogActive } = useDropzone({
      ...props,
      onDrop,
    })

    useEffect(() => {
      setMyFiles(acceptedFiles)
    }, [acceptedFiles])

    const files = myFiles.map((file: FileProps, index) => {
      return (
        <li key={index}>
          <div>
            <Typography variant="body1" component="span">
              {file.path} -
            </Typography>
            <Typography variant="caption" component="span">
              {byteConvertor(file.size)}
            </Typography>
          </div>
          <button onClick={() => removeFile(file)}>
            <HBIcon size="medium" type="times" />
          </button>
        </li>
      )
    })

    const { classes, children, ...otherProps } = props
    const innerClasses = useHBUploaderStyle({ classes })

    function removeFile(file: FileProps) {
      const newFiles = [...myFiles]
      newFiles.splice(newFiles.indexOf(file), 1)
      setMyFiles(newFiles)
    }

    return (
      <Dropzone ref={ref} {...otherProps}>
        {(dropzoneState) => (
          <div>
            <div {...getRootProps({ className: innerClasses.root })}>
              <input {...getInputProps()} />
              <div className={innerClasses.description}>
                {(typeof children === 'function' ? children?.(dropzoneState) : children) ?? (
                  <>
                    <Typography variant="h6" component="p">
                      {!isFileDialogActive ? props.label : props.openLabel ?? props.label}
                    </Typography>
                    {props.icon ?? <HBIcon size="medium" type="cloudUpload" />}
                  </>
                )}
              </div>
            </div>
            <ul className={innerClasses.files}>{files}</ul>
          </div>
        )}
      </Dropzone>
    )
  },
)

HBUploader.displayName = 'HBUploader'
HBUploader.defaultProps = {}

export default HBUploader
