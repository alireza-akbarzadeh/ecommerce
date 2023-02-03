import { Stack } from '@mui/material'
import { useIntl } from 'react-intl'
import sellerLandingMessages from '../../SellerLanding.messages'
import Title from '../title'
import QuestionAccordion from './questionAccordion'

function SixSection() {
  const { formatMessage } = useIntl()

  const questions: {
    title: string
    description: string
  }[] = [
    {
      title: formatMessage(sellerLandingMessages.question1Title),
      description: formatMessage(sellerLandingMessages.question1Description),
    },
    {
      title: formatMessage(sellerLandingMessages.question2Title),
      description: formatMessage(sellerLandingMessages.question2Description),
    },
    {
      title: formatMessage(sellerLandingMessages.question3Title),
      description: formatMessage(sellerLandingMessages.question3Description),
    },
    {
      title: formatMessage(sellerLandingMessages.question4Title),
      description: formatMessage(sellerLandingMessages.question4Description),
    },
    {
      title: formatMessage(sellerLandingMessages.question5Title),
      description: formatMessage(sellerLandingMessages.question5Description),
    },
    {
      title: formatMessage(sellerLandingMessages.question6Title),
      description: formatMessage(sellerLandingMessages.question6Description),
    },
  ]
  return (
    <Stack py={12} display="flex" flexDirection="column">
      <Stack pb={10}>
        <Title title={formatMessage(sellerLandingMessages.question)} />
      </Stack>
      {questions.map((question, index) => (
        <Stack py={2.5} key={index}>
          <QuestionAccordion title={question.title}>{question.description}</QuestionAccordion>
        </Stack>
      ))}
    </Stack>
  )
}

export default SixSection
