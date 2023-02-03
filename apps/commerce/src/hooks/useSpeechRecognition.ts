import { isServer } from '@hasty-bazar-commerce/utils'
import { useEffect, useState } from 'react'

export const useSpeechRecognition = (
  lang?: string,
  continues?: boolean,
  interimResults?: boolean,
) => {
  const [speechRecognitionState, setSpeechRecognitionState] = useState<boolean>()

  useEffect(() => {
    const checkSpeechRecognition =
      global?.window &&
      !isServer() &&
      (window?.speechRecognition || window?.webkitSpeechRecognition)

    if (checkSpeechRecognition) {
      setSpeechRecognitionState(true)
    } else {
      setSpeechRecognitionState(false)
    }
  }, [])

  let speechRecognitionConstructor: any = {}

  if (speechRecognitionState) {
    let SpeechRecognition = window.speechRecognition || window.webkitSpeechRecognition
    speechRecognitionConstructor = new SpeechRecognition()
    speechRecognitionConstructor.lang = lang ?? 'fa-IR'
    speechRecognitionConstructor.continuous = continues ?? false
    speechRecognitionConstructor.interimResults = interimResults ?? false
  }

  return [speechRecognitionConstructor, speechRecognitionState]
}
