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
  const [timeFormat, setTimeFormat] = useState(24)

  useEffect(() => {
    const timeFormat = parseInt(localStorage.getItem('timeFormat') ?? '24')
    setTimeFormat(timeFormat)

    const link = document.createElement('link')
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
    const isMobile = window.innerWidth < 1024
    const job = new CronJob('* * * * * *', () => {
      const current = new Date().getTime()
      const percentage = (current - startOfYear) / (endOfYear - startOfYear)
      const screenSize = isMobile ? window.innerHeight : window.innerWidth
      const blackSize = screenSize * percentage
      const whiteSize = screenSize * (1 - percentage)
      setPercentage(percentage)
      setDate(new Date(current))
      gsap.to(highlighterBlack.current, isMobile ? {height: blackSize, duration, ease} : { width: blackSize, duration, ease })
      gsap.to(highlighterWhite.current, isMobile ? {height: whiteSize, duration, ease} : { width: whiteSize, duration, ease })
    })
    job.start()
  })

  function changeTimeFormat() {
    const newTimeFormat = timeFormat === 24 ? 12 : 24
    setTimeFormat(newTimeFormat)
    console.log(`Time format changed to ${newTimeFormat}`)
    localStorage.setItem('timeFormat', `${newTimeFormat}`)
  }

  return (<>
    <div className="absolute w-screen h-screen flex flex-col justify-between mix-blend-difference select-none">

      <div className="w-screen h-screen flex flex-col lg:flex-row justify-between items-end text-white">
        <div className="flex flex-col items-end lg:items-start">
          <div className="lg:text-5xl text-4xl font-dinnext-medium text-right lg:text-left">
            <div>{moment(date).year()}</div>
            <div>{moment(date).format('MMMM')}</div>
            <div>{moment(date).date()}</div>
          </div>
          <div className="font-dinnext-regular cursor-pointer flex" onClick={changeTimeFormat}>
            <div className="lg:text-9xl text-7xl">{moment(date).format(timeFormat === 24 ? 'HH:mm:ss' : 'h:mm:ss')}</div>
            {timeFormat === 12 && <div className="lg:text-6xl text-3xl">{moment(date).format('a')}</div>}
          </div>
        </div>
        <div className="flex flex-col-reverse lg:flex-col gap-8 items-end">
          <div className="font-dinnext-regular mb-4 text-white/30">Made by <a href="https://astrian.moe" target="_blank" className="underline">Astrian</a> &middot; <a href="https://github.com/Astrian/pcoy" target="_blank" className="underline">sourcecode</a></div>
          <div className="flex flex-col items-end">
            
            <div className="lg:text-5xl text-4xl font-dinnext-medium">{new Date().getFullYear()} has passed</div>
            <div className="lg:text-9xl text-7xl font-dinnext-regular">{(persentage * 100).toFixed(4)}%</div>
          </div>
        </div>
      </div>
    </div>
    <div className="flex flex-col lg:flex-row h-screen w-screen justify-center items-center ">
      <div className="bg-black lg:w-0 lg:h-full w-full h-0" ref={highlighterBlack} />
      <div className="bg-white lg:w-screen lg:h-full h-screen w-full" ref={highlighterWhite} />
    </div>
  </>)
}

export default App
