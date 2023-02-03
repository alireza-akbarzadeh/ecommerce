import { HBDialog, HBForm } from '@hasty-bazar/core'
import { dialogClasses } from '@mui/material'
import { FC, useState } from 'react'
import { ConfirmNewMobileNumber } from '.'
import CurrentMobileNumberOtp from './CurrentMobileNumberOtp'
import NewMobileNumberForm from './NewMobileNumberForm'

interface IChangePhoneNumber {
  open: boolean
  onClose: () => void
  mobileNumberChanged: (mobileNumber: string) => void
}

export interface IChangeMobileNumberForm {
  newMobileNumber: string
  currentMobileNumberOtp: string
  newMobileOtp: string
}

type LevelType = 'newMobile' | 'currentMobileOtp' | 'acceptNewMobileNumber'

type LevelFunctionality = Record<LevelType, number>

const levelFunctionalityInitialState: LevelFunctionality = {
  acceptNewMobileNumber: 0,
  currentMobileOtp: 0,
  newMobile: 0,
}

const ChangePhoneNumberDialog: FC<IChangePhoneNumber> = (props) => {
  const { onClose, open, mobileNumberChanged } = props
  const [level, setLevel] = useState<LevelType>('newMobile')
  const [levelFunctionalityState, setLevelFunctionalityState] = useState<LevelFunctionality>({
    newMobile: 0,
    acceptNewMobileNumber: 0,
    currentMobileOtp: 0,
  })

  const levels = {
    newMobile: (
      <NewMobileNumberForm
        close={() => reset()}
        requestSuccess={() => setLevel('currentMobileOtp')}
        sendRequestFlag={levelFunctionalityState.newMobile}
      />
    ),
    currentMobileOtp: (
      <CurrentMobileNumberOtp
        close={() => reset()}
        requestSuccess={() => setLevel('acceptNewMobileNumber')}
        sendRequestFlag={levelFunctionalityState.currentMobileOtp}
      />
    ),
    acceptNewMobileNumber: (
      <ConfirmNewMobileNumber
        sendRequestFlag={levelFunctionalityState.acceptNewMobileNumber}
        close={() => reset()}
        requestSuccess={(mobile) => {
          mobileNumberChanged(mobile)
          reset()
        }}
      />
    ),
  }

  const reset = () => {
    setLevelFunctionalityState(levelFunctionalityInitialState)
    setLevel('newMobile')
    onClose()
  }

  return (
    <HBDialog
      maxWidth="xs"
      fullWidth
      open={open}
      hideCloseButton
      onClose={() => reset()}
      sx={{
        [`& .${dialogClasses.paper}`]: {
          minWidth: 320,
        },
      }}
    >
      <HBForm<IChangeMobileNumberForm>
        mode="all"
        onSubmit={(e) => {
          const temp = { ...levelFunctionalityState }
          temp[level] = temp[level] + 1
          setLevelFunctionalityState({ ...temp })
        }}
      >
        {levels[level]}
      </HBForm>
    </HBDialog>
  )
}

export default ChangePhoneNumberDialog
