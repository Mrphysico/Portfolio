import * as Tone from 'tone';

class ToneAudioEngine {
  private isInitialized = false;
  private isPlaying = false;
  private synth: Tone.PolySynth | null = null;
  private reverb: Tone.Reverb | null = null;
  private filter: Tone.Filter | null = null;
  private loop: Tone.Loop | null = null;

  public async init() {
    if (this.isInitialized) return;

    await Tone.start();
    this.reverb = new Tone.Reverb({ decay: 4, wet: 0.5 }).toDestination();
    this.filter = new Tone.Filter(800, 'lowpass').connect(this.reverb);

    this.synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'sine' },
      envelope: {
        attack: 0.8,
        decay: 1.2,
        sustain: 0.6,
        release: 2.0,
      },
    }).connect(this.filter);

    this.synth.volume.value = -16; // Safe ambient volume

    const notes = ['C3', 'G3', 'D4', 'A4', 'E4', 'B4'];
    let step = 0;

    this.loop = new Tone.Loop((time) => {
      const note = notes[step % notes.length];
      this.synth?.triggerAttackRelease(note, '2n', time);
      step++;
    }, '1n');

    this.isInitialized = true;
  }

  public async toggle(): Promise<boolean> {
    if (!this.isInitialized) {
      await this.init();
    }

    if (this.isPlaying) {
      Tone.getTransport().stop();
      this.isPlaying = false;
    } else {
      Tone.getTransport().start();
      this.loop?.start(0);
      this.isPlaying = true;
    }

    return this.isPlaying;
  }

  public updateFilter(freq: number) {
    if (this.filter) {
      const clamped = Math.max(200, Math.min(4000, freq));
      this.filter.frequency.rampTo(clamped, 0.2);
    }
  }

  public getStatus() {
    return this.isPlaying;
  }
}

export const toneAudio = new ToneAudioEngine();
