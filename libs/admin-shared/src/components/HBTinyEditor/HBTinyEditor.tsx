import instance from '@hasty-bazar/admin-shared/core/handler'
import { SxProps, Theme, useTheme } from '@mui/material'
import { Editor, IAllProps } from '@tinymce/tinymce-react'
import { forwardRef } from 'react'
import HBTinyEditorRootStyle from './HBTinyEditor.styles'

export type HBTinyEditorProps = {
  value?: string
  onChange: (value?: string) => void
  sx?: SxProps<Theme>
  toolbar?: string
  initialValue?: string
  disabled?: boolean
  isRtl?: boolean
  init?: Omit<
    IAllProps['init'],
    | 'plugins'
    | 'toolbar'
    | 'menubar'
    | 'file_browser_callback_types'
    | 'file_picker_callback'
    | 'paste_data_images'
    | 'directionality'
  >
  id?: string
}

const HBTinyEditor = forwardRef<HTMLInputElement, HBTinyEditorProps>(
  (
    {
      value,
      onChange,
      initialValue,
      sx,
      toolbar = 'bold italic underline forecolor backcolor | ltr rtl | fontsize | alignleft aligncenter alignright alignjustify | bullist numlist | emoticons | link image media fullscreen | undo redo | code',
      init,
      disabled,
      ...otherProps
    },
    ref,
  ) => {
    const theme = useTheme()
    const handleUploadImage = async (event: Event, callback: Function) => {
      if (
        (event.target as HTMLInputElement).files &&
        (event.target as HTMLInputElement)?.files?.length
      ) {
        const files = (event.target as HTMLInputElement).files

        if (files && files.length > 0) {
          const formData = new FormData()
          formData.append('file', files[0])

          const res = await instance
            .post(`${process.env['NEXT_PUBLIC_GATEWAY']}/Admin/CMS/Files`, formData)
            .then((res) => res.data)
            .catch((err) => err)

          if (res?.success) {
            callback(process.env['NEXT_PUBLIC_CDN'] + res.data.path)
          }
        }
      }
    }

    const handleUploadFile = (callback: Function, value: string, meta: Record<string, string>) => {
      if (meta['filetype'] == 'image' || meta['filetype'] == 'media') {
        let input = document.createElement('input')! as HTMLInputElement
        input.setAttribute('type', 'file')
        input.setAttribute('accept', meta['filetype'] == 'image' ? 'image/*' : 'video/*')
        input.click()
        input.onchange = (event: Event) => handleUploadImage(event, callback)
      }
    }

    const handleChangeEditor = (value: string) => {
      onChange(value)
    }

    return (
      <HBTinyEditorRootStyle sx={sx} id="editor_continer">
        <Editor
          apiKey="a0frjfa060qj6ze7b981g7ae064re39q6g5cesm95ceaaasv"
          initialValue={initialValue}
          value={value}
          disabled={disabled}
          init={{
            plugins: 'link image code lists emoticons directionality fullscreen media',
            font_size_formats:
              '12pt 13pt 14pt 16pt 18pt 20pt 30pt 40pt 50pt 60pt 70pt 80pt 90pt 100pt',
            toolbar,
            menubar: false,
            file_browser_callback_types: 'image media',
            file_picker_callback: handleUploadFile,
            paste_data_images: true,
            directionality: theme.direction,
            ...init,
          }}
          onEditorChange={handleChangeEditor}
          {...otherProps}
        />
      </HBTinyEditorRootStyle>
    )
  },
)

export default HBTinyEditor
