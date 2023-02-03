import { useLazyGetWebIdrPartiesByIdQuery } from '@hasty-bazar-commerce/services/idrApi.generated'
import { useSession } from 'next-auth/react'
import { ApiConstants } from '../constants'
import { NationalCodeStateEnum } from '../enums'

interface useNationalCodeValidatorProps {
  onValid: () => void
  onInvalid: () => void
}
const useNationalCodeValidator = (props: useNationalCodeValidatorProps) => {
  const { onInvalid, onValid } = props
  const { data } = useSession()

  const [checkNationalCode, { isLoading }] = useLazyGetWebIdrPartiesByIdQuery()

  const handleCheckNationalCode = async () => {
    try {
      const payload = await checkNationalCode({
        ...ApiConstants,
        id: data?.user.partyId ?? '0',
      }).unwrap()

      if (payload.data?.nationalCodeStateCode === NationalCodeStateEnum.Published) {
        onValid()
      } else {
        onInvalid()
      }
    } catch {}
  }

  return { handleCheckNationalCode, isLoading }
}

export default useNationalCodeValidator
