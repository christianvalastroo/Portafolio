let audioContext
let lastThunder = 0

function playThunder() {
  const AudioContext = window.AudioContext || window.webkitAudioContext
  if (!AudioContext) return

  try {
    audioContext ||= new AudioContext()
    if (audioContext.state === 'suspended') audioContext.resume()

    const now = audioContext.currentTime
    const duration = 2.45
    const noiseBuffer = audioContext.createBuffer(1, audioContext.sampleRate * duration, audioContext.sampleRate)
    const noise = noiseBuffer.getChannelData(0)

    let brownNoise = 0
    for (let index = 0; index < noise.length; index += 1) {
      const whiteNoise = Math.random() * 2 - 1
      brownNoise = (brownNoise + 0.022 * whiteNoise) / 1.022
      noise[index] = brownNoise * 3.4 + whiteNoise * 0.18
    }

    const compressor = audioContext.createDynamicsCompressor()
    compressor.threshold.value = -20
    compressor.knee.value = 18
    compressor.ratio.value = 7
    compressor.attack.value = 0.003
    compressor.release.value = 0.4
    compressor.connect(audioContext.destination)

    const master = audioContext.createGain()
    master.gain.setValueAtTime(0.74, now)
    master.connect(compressor)

    const crack = audioContext.createBufferSource()
    const crackFilter = audioContext.createBiquadFilter()
    const crackGain = audioContext.createGain()
    crack.buffer = noiseBuffer
    crackFilter.type = 'bandpass'
    crackFilter.frequency.setValueAtTime(1250, now)
    crackFilter.Q.value = 0.7
    crackGain.gain.setValueAtTime(0.0001, now)
    crackGain.gain.exponentialRampToValueAtTime(0.66, now + 0.008)
    crackGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18)
    crack.connect(crackFilter)
    crackFilter.connect(crackGain)
    crackGain.connect(master)
    crack.start(now)
    crack.stop(now + 0.22)

    const rumble = audioContext.createBufferSource()
    const rumbleFilter = audioContext.createBiquadFilter()
    const rumbleGain = audioContext.createGain()
    rumble.buffer = noiseBuffer
    rumbleFilter.type = 'lowpass'
    rumbleFilter.frequency.setValueAtTime(260, now)
    rumbleFilter.frequency.exponentialRampToValueAtTime(48, now + duration)
    rumbleGain.gain.setValueAtTime(0.0001, now)
    rumbleGain.gain.exponentialRampToValueAtTime(0.72, now + 0.045)
    rumbleGain.gain.exponentialRampToValueAtTime(0.22, now + 0.48)
    rumbleGain.gain.exponentialRampToValueAtTime(0.38, now + 0.7)
    rumbleGain.gain.exponentialRampToValueAtTime(0.0001, now + duration)
    rumble.connect(rumbleFilter)
    rumbleFilter.connect(rumbleGain)
    rumbleGain.connect(master)
    rumble.start(now)

    const echo = audioContext.createBufferSource()
    const echoFilter = audioContext.createBiquadFilter()
    const echoGain = audioContext.createGain()
    echo.buffer = noiseBuffer
    echo.playbackRate.value = 0.72
    echoFilter.type = 'lowpass'
    echoFilter.frequency.value = 145
    echoGain.gain.setValueAtTime(0.0001, now + 0.22)
    echoGain.gain.exponentialRampToValueAtTime(0.2, now + 0.32)
    echoGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2)
    echo.connect(echoFilter)
    echoFilter.connect(echoGain)
    echoGain.connect(master)
    echo.start(now + 0.22, 0.08)

    const sub = audioContext.createOscillator()
    const subGain = audioContext.createGain()
    sub.type = 'sine'
    sub.frequency.setValueAtTime(54, now)
    sub.frequency.exponentialRampToValueAtTime(29, now + 1.65)
    subGain.gain.setValueAtTime(0.0001, now)
    subGain.gain.exponentialRampToValueAtTime(0.22, now + 0.035)
    subGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.7)
    sub.connect(subGain)
    subGain.connect(master)
    sub.start(now)
    sub.stop(now + 1.75)
  } catch {
    // Alcuni browser consentono l’audio soltanto dopo il primo clic.
  }
}

export function triggerLightning(target, withSound = true, force = false) {
  const now = Date.now()
  if (!force && now - lastThunder < 420) return
  lastThunder = now

  const bounds = target.getBoundingClientRect()
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.dispatchEvent(new CustomEvent('valastro:lightning', {
      detail: {
        id: now,
        x: bounds.left + bounds.width * 0.72,
        y: bounds.top + bounds.height * 0.52,
      },
    }))
  }

  if (withSound) playThunder()
}
