import { useSnackbar, VariantType } from 'notistack'

export default function useToast() {
  const { enqueueSnackbar } = useSnackbar()

  function showToast(message: string, variant: VariantType) {
    enqueueSnackbar(message, { variant })
  }

  return { showToast }
}
