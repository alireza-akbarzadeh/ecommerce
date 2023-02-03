import { FC } from 'react'
import { QuestionsCategory, QuestionsList, SearchQuestions } from './containers'
import { FaqProvider } from './context'

const FaqPage: FC = () => {
  return (
    <FaqProvider>
      <QuestionsCategory />
      <SearchQuestions />
      <QuestionsList />
    </FaqProvider>
  )
}

export default FaqPage
