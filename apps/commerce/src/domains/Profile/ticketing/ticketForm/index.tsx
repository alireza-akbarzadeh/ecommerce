import { useState } from 'react'
import Form from './form/form'
import TicketType, { CaseTypeCaption } from './ticketType'

export enum Steps {
  selectTicketType = 'selectTicketType',
  fillTicketForm = 'fillTicketForm',
}
function TicketForm() {
  const [caseTypeCode, setCaseTypeCode] = useState<CaseTypeCaption>(CaseTypeCaption.Question)
  const [step, setStep] = useState(Steps.selectTicketType)

  const onClickTicketType = (type: CaseTypeCaption) => {
    setCaseTypeCode(type)
    setStep(Steps.fillTicketForm)
  }

  const onBack = (step: Steps) => {
    setStep(step)
  }

  const stepComponent = {
    [Steps.selectTicketType]: <TicketType onClick={onClickTicketType} />,
    [Steps.fillTicketForm]: (
      <Form
        onBack={() => {
          onBack(Steps.selectTicketType)
        }}
        caseTypeCode={caseTypeCode}
      />
    ),
  }
  return <>{stepComponent[step]}</>
}

export default TicketForm
