"use client";

/**
 * Cabinet sounds, synthesised rather than shipped. Keeps the payload at zero
 * bytes and means nothing can autoplay before a deliberate gesture, since the
 * AudioContext is only created when the visitor turns sound on.
 */

let ctx: AudioContext | null = null;
let master: GainNode | null = null;

function audio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (ctx) return ctx;

  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!Ctor) return null;

  ctx = new Ctor();
  master = ctx.createGain();
  master.gain.value = 0.16;
  master.connect(ctx.destination);
  return ctx;
}

export function unlockAudio() {
  const c = audio();
  if (c?.state === "suspended") void c.resume();
}

type ToneOptions = {
  freq: number;
  to?: number;
  duration: number;
  type?: OscillatorType;
  gain?: number;
  delay?: number;
};

function tone({
  freq,
  to,
  duration,
  type = "square",
  gain = 1,
  delay = 0,
}: ToneOptions) {
  const c = audio();
  if (!c || !master) return;

  const start = c.currentTime + delay;
  const osc = c.createOscillator();
  const env = c.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  if (to) osc.frequency.exponentialRampToValueAtTime(to, start + duration);

  env.gain.setValueAtTime(0.0001, start);
  env.gain.exponentialRampToValueAtTime(gain, start + 0.008);
  env.gain.exponentialRampToValueAtTime(0.0001, start + duration);

  osc.connect(env).connect(master);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

export function playCoin() {
  tone({ freq: 988, duration: 0.07, gain: 0.5 });
  tone({ freq: 1319, duration: 0.11, gain: 0.45, delay: 0.07 });
}

export function playBlip() {
  tone({ freq: 660, duration: 0.045, gain: 0.22, type: "triangle" });
}

export function playSelect() {
  tone({ freq: 440, to: 880, duration: 0.16, gain: 0.3, type: "sawtooth" });
}

export function playPowerDown() {
  tone({ freq: 740, to: 110, duration: 0.3, gain: 0.26, type: "sawtooth" });
}
