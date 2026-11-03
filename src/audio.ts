/**
 * Tiny Web Audio synth. No assets, no network: every sound is generated so the
 * game loads instantly and works offline. Browser autoplay rules are respected
 * by only creating the context after the first gesture.
 */

type Sfx = 'shoot' | 'hit' | 'explode' | 'pickup' | 'boss' | 'death' | 'win' | 'lose' | 'ui' | 'missile' | 'shield'

class AudioManager {
  private context: AudioContext | null = null
  private master: GainNode | null = null
  private enabled = true
  private musicEnabled = true
  private musicTimer: number | null = null
  private musicStep = 0

  unlock(): void {
    if (this.context) {
      if (this.context.state === 'suspended') void this.context.resume()
      return
    }
    try {
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!Ctor) return
      this.context = new Ctor()
      this.master = this.context.createGain()
      this.master.gain.value = 0.32
      this.master.connect(this.context.destination)
    } catch {
      this.context = null
    }
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled
    if (!enabled) this.stopMusic()
    else if (this.musicEnabled) this.startMusic()
  }

  setMusic(enabled: boolean): void {
    this.musicEnabled = enabled
    if (enabled) this.startMusic()
    else this.stopMusic()
  }

  private tone(frequency: number, duration: number, type: OscillatorType, volume: number, slide = 0): void {
    if (!this.context || !this.master || !this.enabled) return
    const now = this.context.currentTime
    const oscillator = this.context.createOscillator()
    const gain = this.context.createGain()
    oscillator.type = type
    oscillator.frequency.setValueAtTime(frequency, now)
    if (slide !== 0) oscillator.frequency.exponentialRampToValueAtTime(Math.max(30, frequency + slide), now + duration)
    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, volume), now + 0.012)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration)
    oscillator.connect(gain)
    gain.connect(this.master)
    oscillator.start(now)
    oscillator.stop(now + duration + 0.02)
  }

  private noise(duration: number, volume: number, filterHz: number): void {
    if (!this.context || !this.master || !this.enabled) return
    const samples = Math.floor(this.context.sampleRate * duration)
    const buffer = this.context.createBuffer(1, samples, this.context.sampleRate)
    const data = buffer.getChannelData(0)
    for (let index = 0; index < samples; index += 1) {
      data[index] = (Math.random() * 2 - 1) * (1 - index / samples)
    }
    const source = this.context.createBufferSource()
    source.buffer = buffer
    const filter = this.context.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = filterHz
    const gain = this.context.createGain()
    gain.gain.value = volume
    source.connect(filter)
    filter.connect(gain)
    gain.connect(this.master)
    source.start()
  }

  play(effect: Sfx): void {
    if (!this.enabled) return
    this.unlock()
    switch (effect) {
      case 'shoot':
        this.tone(680 + Math.random() * 120, 0.07, 'square', 0.035, -260)
        break
      case 'hit':
        this.tone(320, 0.06, 'triangle', 0.05, -80)
        break
      case 'explode':
        this.noise(0.32, 0.22, 900)
        this.tone(120, 0.24, 'sawtooth', 0.08, -70)
        break
      case 'pickup':
        this.tone(760, 0.08, 'sine', 0.08, 240)
        this.tone(1140, 0.1, 'sine', 0.05, 120)
        break
      case 'boss':
        this.tone(70, 0.9, 'sawtooth', 0.14, -18)
        this.noise(0.7, 0.14, 320)
        break
      case 'death':
        this.noise(0.7, 0.28, 620)
        this.tone(180, 0.6, 'sawtooth', 0.12, -130)
        break
      case 'win':
        ;[523, 659, 784, 1047].forEach((frequency, index) => {
          window.setTimeout(() => this.tone(frequency, 0.22, 'triangle', 0.09), index * 110)
        })
        break
      case 'lose':
        ;[392, 330, 262].forEach((frequency, index) => {
          window.setTimeout(() => this.tone(frequency, 0.3, 'sine', 0.09), index * 150)
        })
        break
      case 'missile':
        this.noise(0.2, 0.1, 1500)
        break
      case 'shield':
        this.tone(420, 0.18, 'sine', 0.07, 260)
        break
      case 'ui':
        this.tone(560, 0.05, 'square', 0.035, 80)
        break
    }
  }

  startMusic(): void {
    if (!this.enabled || !this.musicEnabled || this.musicTimer !== null) return
    this.unlock()
    if (!this.context) return
    const notes = [110, 130.8, 146.8, 174.6, 196, 174.6, 146.8, 130.8]
    this.musicTimer = window.setInterval(() => {
      if (!this.context || !this.master) return
      const now = this.context.currentTime
      const frequency = notes[this.musicStep % notes.length] as number
      const oscillator = this.context.createOscillator()
      const gain = this.context.createGain()
      oscillator.type = 'sine'
      oscillator.frequency.value = frequency
      gain.gain.setValueAtTime(0.0001, now)
      gain.gain.exponentialRampToValueAtTime(0.03, now + 0.4)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2)
      oscillator.connect(gain)
      gain.connect(this.master)
      oscillator.start(now)
      oscillator.stop(now + 2.3)
      this.musicStep += 1
    }, 1400)
  }

  stopMusic(): void {
    if (this.musicTimer !== null) {
      window.clearInterval(this.musicTimer)
      this.musicTimer = null
    }
  }
}

export const audio = new AudioManager()
