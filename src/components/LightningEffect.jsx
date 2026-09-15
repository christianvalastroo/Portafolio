import { useEffect, useState } from 'react'

function LightningEffect() {
  const [strike, setStrike] = useState(null)

  useEffect(() => {
    let timer
    const handleStrike = (event) => {
      setStrike(event.detail)
      window.clearTimeout(timer)
      timer = window.setTimeout(() => setStrike(null), 720)
    }

    window.addEventListener('valastro:lightning', handleStrike)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('valastro:lightning', handleStrike)
    }
  }, [])

  if (!strike) return null

  return (
    <div
      className="lightning"
      key={strike.id}
      style={{ '--strike-x': `${strike.x}px`, '--strike-y': `${strike.y}px` }}
      aria-hidden="true"
    >
      <div className="lightning__sky" />
      <div className="lightning__sky lightning__sky--second" />
      <div className="lightning__bolt lightning__bolt--ghost" />
      <div className="lightning__bolt" />
      <div className="lightning__branch lightning__branch--one" />
      <div className="lightning__branch lightning__branch--two" />
      <div className="lightning__branch lightning__branch--three" />
      <div className="lightning__impact" />
      <div className="lightning__shockwave" />
    </div>
  )
}

export default LightningEffect
