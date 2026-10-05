/**
 * Web Audio API synthesizer for educational sensory feedback.
 * Plays cheerful mathematical tones when scrubbing or hitting quadrant milestones.
 */

class AudioSynthesizer {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private lastMilestoneDeg: number = -1;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public playMilestoneChime(quadrant: number, isPeakOrZero: boolean = false) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Base pitches for quadrants: C5, E5, G5, B5, or pleasant scale
      const freqs = [523.25, 659.25, 783.99, 987.77, 1046.5];
      const freq = freqs[(quadrant - 1) % freqs.length] * (isPeakOrZero ? 1.2 : 1.0);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.36);
    } catch {
      // Audio context might be restricted before interaction
    }
  }

  public checkAndPlayAngleSound(deg: number) {
    const roundedDeg = Math.round(deg) % 360;
    const milestoneSteps = [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330, 360];

    const match = milestoneSteps.find((m) => Math.abs(m - roundedDeg) <= 1);
    if (match !== undefined && match !== this.lastMilestoneDeg) {
      this.lastMilestoneDeg = match;
      const isPeak = match === 90 || match === 270 || match === 0 || match === 180 || match === 360;
      const q = match < 90 ? 1 : match < 180 ? 2 : match < 270 ? 3 : 4;
      this.playMilestoneChime(q, isPeak);
    }
  }
}

export const soundFx = new AudioSynthesizer();
