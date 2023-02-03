import { useEffect, useState } from 'react'

type UseAudioPlayerType = {
  audioRef: React.RefObject<HTMLAudioElement>
}

function useAudioPlayer({ audioRef }: UseAudioPlayerType) {
  const [duration, setDuration] = useState<number>()
  const [curTime, setCurTime] = useState<number>()
  const [playing, setPlaying] = useState(false)
  const [clickedTime, setClickedTime] = useState<number | null>()

  useEffect(() => {
    const setAudioData = () => {
      setDuration(audioRef?.current?.duration!)
      setCurTime(audioRef?.current?.currentTime!)
    }

    const setAudioTime = () => setCurTime(audioRef?.current?.currentTime)
    audioRef?.current?.addEventListener('loadeddata', setAudioData)
    audioRef?.current?.addEventListener('timeupdate', setAudioTime)
    playing ? audioRef?.current?.play() : audioRef?.current?.pause()

    if (clickedTime && clickedTime !== curTime) {
      if (audioRef?.current?.currentTime) {
        audioRef.current.currentTime = clickedTime!
      }
      setClickedTime(null)
    }

    return () => {
      audioRef?.current?.removeEventListener('loadeddata', setAudioData)
      audioRef?.current?.removeEventListener('timeupdate', setAudioTime)
    }
  })

  return {
    curTime,
    duration,
    playing,
    setPlaying,
    setClickedTime,
  }
}

export default useAudioPlayer
