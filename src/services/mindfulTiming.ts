type BreathingType = 'quick' | 'normal' | 'deep' | 'meditation';
type UrgencyLevel = 'immediate' | 'gentle' | 'normal' | 'patient' | 'meditative';

interface BreathingRhythm {
  inhale: number;
  pause: number;
  exhale: number;
}

interface StaggeredTimingItem {
  delay: number;
  item: number;
}

class MindfulTiming {
  private pendingTimeouts: Set<NodeJS.Timeout>;
  private isAppInBackground: boolean;

  constructor() {
    this.pendingTimeouts = new Set();
    this.isAppInBackground = false;
  }

  // Gentle delays for different contexts
  static DELAYS = {
    // UI transitions
    breathe: 300,           // Natural breathing pause
    contemplation: 800,     // Time for contemplation
    reflection: 1200,       // Deeper reflection time
    meditation: 2000,       // Meditative pause

    // User interactions
    gentlePress: 150,       // Soft button press feedback
    thoughtfulAction: 500,  // Time to consider action
    mindfulNavigation: 400, // Navigation with intention

    // Content reveal
    softReveal: 600,        // Gentle content appearance
    staggeredEntry: 200,    // Between staggered animations
    cascadeDelay: 150,      // Cascading reveals

    // System feedback
    acknowledgment: 300,    // System acknowledging user
    confirmation: 700,      // Confirming important actions
    preparation: 1000,      // Preparing for next state

    // Peaceful loading
    gentleWait: 500,        // Brief gentle wait
    patientWait: 1500,      // Patient waiting period
    sereneWait: 3000,       // Serene, unhurried wait
  };

  // Create a mindful delay with cleanup
  private createDelay(duration: number, description = ''): Promise<void> {
    return new Promise((resolve) => {
      const timeoutId = setTimeout(() => {
        this.pendingTimeouts.delete(timeoutId);
        resolve();
      }, duration);
      
      this.pendingTimeouts.add(timeoutId);
    });
  }

  // Wait with contemplative messaging
  async contemplate(
    duration: number = MindfulTiming.DELAYS.contemplation, 
    context = ''
  ): Promise<void> {
    if (this.isAppInBackground) {
      return Promise.resolve();
    }

    const actualDuration = this.adjustForContext(duration, context);
    return this.createDelay(actualDuration);
  }

  // Breathing rhythm delays
  async breathe(type: BreathingType = 'normal'): Promise<void> {
    const breathingRhythms: Record<BreathingType, BreathingRhythm> = {
      quick: { inhale: 300, pause: 100, exhale: 400 },
      normal: { inhale: 500, pause: 200, exhale: 700 },
      deep: { inhale: 800, pause: 400, exhale: 1200 },
      meditation: { inhale: 1000, pause: 500, exhale: 1500 }
    };

    const rhythm = breathingRhythms[type] || breathingRhythms.normal;
    
    // Inhale
    await this.createDelay(rhythm.inhale);
    // Pause
    await this.createDelay(rhythm.pause);
    // Exhale
    await this.createDelay(rhythm.exhale);
  }

  // Staggered timing for multiple elements
  createStaggeredTiming(
    itemCount: number, 
    baseDelay: number = MindfulTiming.DELAYS.staggeredEntry
  ): StaggeredTimingItem[] {
    return Array.from({ length: itemCount }, (_, index) => ({
      delay: index * baseDelay,
      item: index
    }));
  }

  // Wait for peaceful moment before continuing
  async findPeacefulMoment(urgency: UrgencyLevel = 'normal'): Promise<void> {
    const urgencyDelays: Record<UrgencyLevel, number> = {
      immediate: 0,
      gentle: MindfulTiming.DELAYS.gentleWait,
      normal: MindfulTiming.DELAYS.patientWait,
      patient: MindfulTiming.DELAYS.sereneWait,
      meditative: MindfulTiming.DELAYS.meditation * 2
    };

    const delay = urgencyDelays[urgency] || urgencyDelays.normal;
    return this.contemplate(delay, 'peaceful_moment');
  }

  // Adjust timing based on context and user preferences
  private adjustForContext(baseDuration: number, context: string): number {
    // Reduce delays if user seems impatient (future enhancement)
    // For now, return base duration
    return baseDuration;
  }

  // Cleanup method for component unmounting
  cleanup(): void {
    this.pendingTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
    this.pendingTimeouts.clear();
  }

  // Set app background state
  setBackgroundState(isBackground: boolean): void {
    this.isAppInBackground = isBackground;
  }
}

// Singleton instance
const mindfulTiming = new MindfulTiming();

// Helper functions for common use cases
export const contemplate = (duration?: number, context?: string): Promise<void> => 
  mindfulTiming.contemplate(duration, context);

export const breathe = (type?: BreathingType): Promise<void> => 
  mindfulTiming.breathe(type);

export const findPeacefulMoment = (urgency?: UrgencyLevel): Promise<void> => 
  mindfulTiming.findPeacefulMoment(urgency);

export const createStaggeredTiming = (count: number, delay?: number): StaggeredTimingItem[] => 
  mindfulTiming.createStaggeredTiming(count, delay);

export const MINDFUL_DELAYS = MindfulTiming.DELAYS;

export default mindfulTiming;