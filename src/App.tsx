import { useRef, useState, useEffect } from "react"
import { CronJob } from 'cron'
import moment from "moment"

import gsap from "gsap"
import { useGSAP } from "@gsap/react"
gsap.registerPlugin(useGSAP)

function App() {
  const highlighterWhite = useRef(null)
  const highlighterBlack = useRef(null)
  const [persentage, setPercentage] = useState(0)
  const [date, setDate] = useState(new Date())

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet'
    link.href = `https://cdn.fonts.net/kit/${import.meta.env.VITE_MONOTYPE_CSS_TOKEN}.css`
    link.crossOrigin = 'anonymous'

    document.head.appendChild(link)

    return () => {
      document.head.removeChild(link)
    }
  }, [])

  useGSAP(() => {
    const currentYear = new Date().getFullYear()
    const startOfYear = new Date(currentYear, 0, 1, 0, 0, 0).getTime()
    const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59).getTime()
    const duration = 2
    const ease = "expo.out"
    const job = new CronJob('* * * * * *', () => {
      const current = new Date().getTime()
      const percentage = (current - startOfYear) / (endOfYear - startOfYear)
      const screenWidth = window.innerWidth
      const blackWidth = screenWidth * percentage
      const whiteWidth = screenWidth - blackWidth
      setPercentage(percentage)
      setDate(new Date(current))
      gsap.to(highlighterBlack.current, { width: blackWidth, duration, ease })
      gsap.to(highlighterWhite.current, { width: whiteWidth, duration, ease })
    })
    job.start()
  })

  return (<>
    <div className="absolute w-screen h-screen flex flex-col justify-between mix-blend-difference select-none">
      <div className="flex justify-between">
        <div></div>
        <div className="text-right font-dinnext-regular text-white/30 p-2">
          <div>Make by <a href="https://astrian.moe" target="_blank" className="underline">Astrian</a></div>
          <div><a href="https://github.com/Astrian/pcoy" target="_blank" className="underline">Sourcecode</a></div>
        </div>
      </div>
      <div className="w-screen flex justify-between items-end text-white">
        <div>
          <div className="text-5xl font-dinnext-medium">
            <div>{moment(date).year()}</div>
            <div>{moment(date).format('MMMM')}</div>
            <div>{moment(date).date()}</div>
          </div>
          <div className="text-9xl font-dinnext-regular">{moment(date).format('HH:mm:ss')}</div>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-5xl font-dinnext-medium">{new Date().getFullYear()} has passed</div>
          <div className="text-9xl font-dinnext-regular">{(persentage * 100).toFixed(4)}%</div>
        </div>
      </div>
    </div>
    <div className="flex h-screen w-screen justify-center items-center ">
      <div className="bg-black w-0 h-full" ref={highlighterBlack} />
      <div className="bg-white w-screen h-full" ref={highlighterWhite} />
    </div>
  </>)
}

export default App
