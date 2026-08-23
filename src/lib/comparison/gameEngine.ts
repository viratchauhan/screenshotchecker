import type { DifferenceRegion, GameState, BoundingBox } from './types';

export class SpotDifferenceGameEngine {
  private regions: DifferenceRegion[] = [];
  private state: GameState;
  private timerInterval: any = null;
  private onStateChange: ((state: GameState) => void) | null = null;

  constructor(
    regions: DifferenceRegion[],
    targetCount = 5,
    onStateChange?: (state: GameState) => void
  ) {
    this.regions = regions;
    this.onStateChange = onStateChange || null;

    const actualTarget = Math.min(regions.length, Math.max(1, targetCount));

    this.state = {
      targetCount: actualTarget,
      foundCount: 0,
      score: 0,
      wrongClicks: 0,
      hintsUsed: 0,
      elapsedSeconds: 0,
      isCompleted: false,
      isPlaying: false,
      discoveredRegionIds: [],
    };
  }

  public start() {
    this.state.isPlaying = true;
    this.state.isCompleted = false;
    this.state.foundCount = 0;
    this.state.score = 0;
    this.state.wrongClicks = 0;
    this.state.hintsUsed = 0;
    this.state.elapsedSeconds = 0;
    this.state.discoveredRegionIds = [];
    this.state.activeHint = undefined;

    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      if (this.state.isPlaying && !this.state.isCompleted) {
        this.state.elapsedSeconds++;
        this.notify();
      }
    }, 1000);

    this.notify();
  }

  public stop() {
    this.state.isPlaying = false;
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  public getState(): GameState {
    return { ...this.state };
  }

  /**
   * Tests a user click at relative coordinates (relX, relY) [0..1]
   */
  public handleClick(relX: number, relY: number): { isCorrect: boolean; region?: DifferenceRegion } {
    if (!this.state.isPlaying || this.state.isCompleted) {
      return { isCorrect: false };
    }

    const hitPadding = 0.04; // 4% hit padding for friendly touch/click detection

    // Search active unfound regions up to targetCount
    const candidateRegions = this.regions.slice(0, this.state.targetCount);

    for (const region of candidateRegions) {
      if (this.state.discoveredRegionIds.includes(region.id)) {
        continue; // Already found
      }

      const { box } = region;
      const minX = Math.max(0, box.x - hitPadding);
      const maxX = Math.min(1, box.x + box.width + hitPadding);
      const minY = Math.max(0, box.y - hitPadding);
      const maxY = Math.min(1, box.y + box.height + hitPadding);

      if (relX >= minX && relX <= maxX && relY >= minY && relY <= maxY) {
        // Correct find!
        this.state.discoveredRegionIds.push(region.id);
        this.state.foundCount++;

        // Add 1000 points + time bonus
        const timeBonus = Math.max(0, 500 - this.state.elapsedSeconds * 2);
        this.state.score += 1000 + timeBonus;

        // Clear active hint if it matched this region
        if (this.state.activeHint?.regionId === region.id) {
          this.state.activeHint = undefined;
        }

        if (this.state.foundCount >= this.state.targetCount) {
          this.state.isCompleted = true;
          this.state.isPlaying = false;
          this.stop();
        }

        this.notify();
        return { isCorrect: true, region };
      }
    }

    // Wrong click
    this.state.wrongClicks++;
    this.state.score = Math.max(0, this.state.score - 50);
    this.notify();
    return { isCorrect: false };
  }

  /**
   * Progressive Hint System (Hint 1 -> Hint 2 -> Hint 3)
   */
  public useHint(): { level: number; text: string; regionId?: string } {
    if (!this.state.isPlaying || this.state.isCompleted) {
      return { level: 0, text: 'Game is not currently active.' };
    }

    // Find first undiscovered region
    const candidateRegions = this.regions.slice(0, this.state.targetCount);
    const unfound = candidateRegions.find((r) => !this.state.discoveredRegionIds.includes(r.id));

    if (!unfound) {
      return { level: 0, text: 'All differences already found!' };
    }

    let currentLevel: 1 | 2 | 3 = 1;
    if (this.state.activeHint && this.state.activeHint.regionId === unfound.id) {
      currentLevel = Math.min(3, (this.state.activeHint.level + 1)) as 1 | 2 | 3;
    }

    this.state.hintsUsed++;

    // Broad area for Level 1
    const broadArea: BoundingBox = {
      x: Math.max(0, unfound.box.x - 0.12),
      y: Math.max(0, unfound.box.y - 0.12),
      width: Math.min(1, unfound.box.width + 0.24),
      height: Math.min(1, unfound.box.height + 0.24),
      pixelX: 0,
      pixelY: 0,
      pixelWidth: 0,
      pixelHeight: 0,
    };

    let text = '';
    if (currentLevel === 1) {
      text = `Hint 1: Look around the ${unfound.locationName}.`;
      this.state.score = Math.max(0, this.state.score - 100);
    } else if (currentLevel === 2) {
      text = `Hint 2: Pay close attention to ${unfound.title.toLowerCase()} in the ${unfound.locationName}.`;
      this.state.score = Math.max(0, this.state.score - 250);
    } else {
      text = `Hint 3: Exact location highlighted!`;
      this.state.score = Math.max(0, this.state.score - 500);
    }

    this.state.activeHint = {
      level: currentLevel,
      regionId: unfound.id,
      text,
      broadArea,
      exactBox: unfound.box,
    };

    this.notify();
    return { level: currentLevel, text, regionId: unfound.id };
  }

  private notify() {
    if (this.onStateChange) {
      this.onStateChange(this.getState());
    }
  }
}
