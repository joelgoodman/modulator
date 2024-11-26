# Animation System API

## Overview

The animation system provides type definitions for creating smooth, performant, and accessible animations in the Modulator UI. It supports hardware acceleration, reduced motion preferences, and complex animation sequences while maintaining type safety.

## Core Types

### AnimationTiming

Controls the timing aspects of an animation.

```typescript
interface AnimationTiming {
  /** Duration in milliseconds */
  duration: number;
  /** Optional delay before start */
  delay?: number;
  /** Easing function */
  easing: EasingFunction;
  /** Custom cubic bezier values */
  cubicBezier?: [number, number, number, number];
}
```

### AnimationConfig

Complete configuration for an animation.

```typescript
interface AnimationConfig {
  /** Animation identifier */
  name: string;
  /** Timing configuration */
  timing: AnimationTiming;
  /** Animation direction */
  direction: AnimationDirection;
  /** Fill mode behavior */
  fillMode: AnimationFillMode;
  /** Number of iterations */
  iterations: number;
  /** Accessibility settings */
  accessibility: AnimationAccessibilityConfig;
  /** Performance optimization */
  performance?: AnimationPerformanceConfig;
  /** Keyframe definitions */
  keyframes: KeyframeDefinition[];
}
```

### KeyframeDefinition

Defines a single keyframe in an animation sequence.

```typescript
interface KeyframeDefinition {
  /** Progress point (0-1) */
  offset: number;
  /** Properties to animate */
  properties: Partial<Record<AnimatableProperty, string | number>>;
  /** Optional keyframe-specific easing */
  easing?: EasingFunction;
}
```

## Accessibility

### AnimationAccessibilityConfig

Configuration for making animations accessible.

```typescript
interface AnimationAccessibilityConfig {
  /** Whether to respect reduced motion preferences */
  respectMotionPreferences: boolean;
  /** Default motion preference */
  defaultMotionPreference: MotionPreference;
  /** Alternative for reduced motion */
  reducedMotionAlternative?: {
    /** Skip animation entirely */
    skip?: boolean;
    /** Alternative timing */
    timing?: AnimationTiming;
    /** Alternative properties */
    properties?: Partial<Record<AnimatableProperty, string | number>>;
  };
  /** Whether animation is essential */
  isEssential?: boolean;
  /** Description for screen readers */
  ariaDescription?: string;
}
```

## Performance

### AnimationPerformanceConfig

Configuration for optimizing animation performance.

```typescript
interface AnimationPerformanceConfig {
  /** Enable hardware acceleration */
  useHardwareAcceleration: boolean;
  /** Properties to accelerate */
  gpuProperties?: AnimatableProperty[];
  /** Frame rate control */
  frameRate?: {
    /** Target FPS */
    target: number;
    /** Adapt to device capabilities */
    adaptive: boolean;
  };
  /** Use requestAnimationFrame */
  useRAF: boolean;
  /** Batch DOM updates */
  batchUpdate?: boolean;
  /** Enable performance monitoring */
  enableDebug?: boolean;
}
```

## Usage Examples

### Basic Animation

```typescript
const fadeIn: AnimationConfig = {
  name: 'fadeIn',
  timing: {
    duration: 300,
    easing: 'ease-in-out'
  },
  direction: 'normal',
  fillMode: 'forwards',
  iterations: 1,
  accessibility: {
    respectMotionPreferences: true,
    defaultMotionPreference: 'no-preference',
    reducedMotionAlternative: {
      skip: false,
      timing: { duration: 0 }
    }
  },
  keyframes: [
    { offset: 0, properties: { opacity: 0 } },
    { offset: 1, properties: { opacity: 1 } }
  ]
};
```

### Complex Animation Sequence

```typescript
const cardEntrance: AnimationConfig = {
  name: 'cardEntrance',
  timing: {
    duration: 500,
    easing: 'cubic-bezier',
    cubicBezier: [0.4, 0, 0.2, 1]
  },
  direction: 'normal',
  fillMode: 'forwards',
  iterations: 1,
  accessibility: {
    respectMotionPreferences: true,
    isEssential: false,
    ariaDescription: 'Card slides in and fades up'
  },
  performance: {
    useHardwareAcceleration: true,
    gpuProperties: ['transform', 'opacity'],
    frameRate: {
      target: 60,
      adaptive: true
    }
  },
  keyframes: [
    {
      offset: 0,
      properties: {
        transform: 'translateY(20px)',
        opacity: 0
      }
    },
    {
      offset: 0.6,
      properties: {
        transform: 'translateY(0)',
        opacity: 0.8
      },
      easing: 'ease-out'
    },
    {
      offset: 1,
      properties: {
        transform: 'translateY(0)',
        opacity: 1
      }
    }
  ]
};
```

### Animation Group

```typescript
const groupConfig: AnimationGroupConfig = {
  name: 'listReveal',
  animations: [
    fadeIn,
    {
      name: 'slideIn',
      timing: { duration: 400, delay: 100 },
      // ... other properties
    }
  ],
  sequencing: 'staggered',
  staggerDelay: 50,
  waitForAll: true
};
```

## Best Practices

1. **Performance**
   - Use hardware-accelerated properties (transform, opacity)
   - Batch animations when possible
   - Monitor frame rates and dropped frames
   - Use appropriate easing functions

2. **Accessibility**
   - Always provide reduced motion alternatives
   - Keep animations under 5 seconds
   - Avoid flashing content
   - Provide clear ARIA descriptions

3. **User Experience**
   - Use appropriate timing and easing
   - Maintain visual hierarchy
   - Ensure animations add value
   - Keep interactions predictable

4. **Implementation**
   - Group related animations
   - Use semantic animation names
   - Implement proper cleanup
   - Handle animation interruptions

5. **Testing**
   - Test with reduced motion enabled
   - Verify performance metrics
   - Check accessibility compliance
   - Test across devices and browsers
