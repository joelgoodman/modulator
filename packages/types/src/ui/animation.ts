/**
 * @fileoverview Animation System Types for Modulator UI
 * @module @modulator/types/ui/animation
 * @description
 * Defines comprehensive animation types and interfaces for the Modulator UI system,
 * supporting smooth transitions, dynamic effects, and accessibility features.
 * 
 * @remarks
 * The animation system is built with performance and accessibility in mind, supporting:
 * - Hardware-accelerated animations
 * - Reduced motion preferences
 * - Frame rate optimization
 * - Grouped and sequenced animations
 * - Performance monitoring
 */

/**
 * Standard easing functions
 * @remarks
 * Common easing functions for creating natural and smooth animations.
 * Each easing function provides a different acceleration curve.
 * 
 * @example
 * ```typescript
 * const timing: AnimationTiming = {
 *   duration: 300,
 *   easing: 'ease-in-out'
 * };
 * ```
 */
export type EasingFunction =
  | 'linear'
  | 'ease'
  | 'ease-in'
  | 'ease-out'
  | 'ease-in-out'
  | 'cubic-bezier';

/**
 * Animation timing parameters
 * @remarks
 * Controls the timing aspects of an animation, including duration,
 * delay, and easing function. Supports custom cubic bezier curves
 * for precise control over animation progression.
 * 
 * @example
 * ```typescript
 * const timing: AnimationTiming = {
 *   duration: 300,
 *   delay: 100,
 *   easing: 'cubic-bezier',
 *   cubicBezier: [0.4, 0, 0.2, 1]
 * };
 * ```
 */
export interface AnimationTiming {
  /** Duration in milliseconds */
  duration: number;
  /** Delay before animation starts (ms) */
  delay?: number;
  /** Easing function to use */
  easing: EasingFunction;
  /** Custom cubic bezier parameters if easing is 'cubic-bezier' */
  cubicBezier?: [number, number, number, number];
}

/**
 * Animation properties that can be animated
 * @remarks
 * Defines the CSS properties that can be animated. These properties
 * are optimized for performance and support hardware acceleration
 * where possible.
 * 
 * @example
 * ```typescript
 * const animatableProps: AnimatableProperty[] = [
 *   'opacity',
 *   'transform',
 *   'backgroundColor'
 * ];
 * ```
 */
export type AnimatableProperty =
  | 'opacity'
  | 'transform'
  | 'backgroundColor'
  | 'color'
  | 'width'
  | 'height'
  | 'margin'
  | 'padding'
  | 'borderWidth'
  | 'borderColor'
  | 'borderRadius'
  | 'boxShadow'
  | 'filter';

/**
 * Animation state
 * @remarks
 * Represents the current state of an animation, used for
 * tracking progress and controlling playback.
 * 
 * @example
 * ```typescript
 * const state: AnimationState = 'running';
 * // Animation states: idle, running, paused, finished
 * ```
 */
export type AnimationState =
  | 'idle'
  | 'running'
  | 'paused'
  | 'finished'
  | 'cancelled';

/**
 * Animation direction
 * @remarks
 * Controls the playback direction of the animation.
 * Supports forward, reverse, and alternating playback.
 * 
 * @example
 * ```typescript
 * const direction: AnimationDirection = 'alternate';
 * // Animation will play forward then reverse
 * ```
 */
export type AnimationDirection =
  | 'normal'
  | 'reverse'
  | 'alternate'
  | 'alternate-reverse';

/**
 * Animation fill mode
 * @remarks
 * Determines how styles are applied before and after the animation.
 * Controls whether animation effects persist after completion.
 * 
 * @example
 * ```typescript
 * const fillMode: AnimationFillMode = 'forwards';
 * // Animation styles will be retained after completion
 * ```
 */
export type AnimationFillMode =
  | 'none'
  | 'forwards'
  | 'backwards'
  | 'both';

/**
 * Keyframe definition
 * @remarks
 * Defines a single keyframe in an animation sequence, including
 * timing offset, properties to animate, and optional easing.
 * 
 * @example
 * ```typescript
 * const keyframe: KeyframeDefinition = {
 *   offset: 0.5,
 *   properties: {
 *     opacity: 0.5,
 *     transform: 'scale(1.2)'
 *   },
 *   easing: 'ease-out'
 * };
 * ```
 */
export interface KeyframeDefinition {
  /** Progress point (0-1) where this keyframe occurs */
  offset: number;
  /** Properties to animate at this keyframe */
  properties: Partial<Record<AnimatableProperty, string | number>>;
  /** Optional easing for this keyframe */
  easing?: EasingFunction;
}

/**
 * Motion preference type
 * @remarks
 * Represents user's motion preferences, supporting accessibility
 * features like reduced motion.
 * 
 * @example
 * ```typescript
 * const preference: MotionPreference = 'reduce';
 * // User prefers reduced motion
 * ```
 */
export type MotionPreference = 'no-preference' | 'reduce' | 'forced-reduce';

/**
 * Accessibility configuration
 * @remarks
 * Configuration for making animations accessible, including
 * support for reduced motion preferences and alternatives.
 * 
 * @example
 * ```typescript
 * const config: AnimationAccessibilityConfig = {
 *   respectMotionPreferences: true,
 *   defaultMotionPreference: 'no-preference',
 *   reducedMotionAlternative: {
 *     skip: false,
 *     timing: { duration: 0 }
 *   },
 *   isEssential: false,
 *   ariaDescription: 'Fades in content smoothly'
 * };
 * ```
 */
export interface AnimationAccessibilityConfig {
  /** Whether to respect user's motion preferences */
  respectMotionPreferences: boolean;
  /** Default motion preference if user's is not available */
  defaultMotionPreference: MotionPreference;
  /** Alternative animation for reduced motion */
  reducedMotionAlternative?: {
    /** Whether to skip the animation entirely */
    skip?: boolean;
    /** Alternative timing configuration */
    timing?: AnimationTiming;
    /** Alternative properties to animate */
    properties?: Partial<Record<AnimatableProperty, string | number>>;
  };
  /** Whether this animation is essential for functionality */
  isEssential?: boolean;
  /** ARIA description of the animation */
  ariaDescription?: string;
}

/**
 * Performance optimization configuration
 * @remarks
 * Configuration for optimizing animation performance through
 * hardware acceleration, frame rate control, and batching.
 * 
 * @example
 * ```typescript
 * const config: AnimationPerformanceConfig = {
 *   useHardwareAcceleration: true,
 *   gpuProperties: ['transform', 'opacity'],
 *   frameRate: {
 *     target: 60,
 *     adaptive: true
 *   },
 *   useRAF: true,
 *   batchUpdate: true
 * };
 * ```
 */
export interface AnimationPerformanceConfig {
  /** Whether to use GPU acceleration */
  useHardwareAcceleration: boolean;
  /** Properties to force GPU acceleration */
  gpuProperties?: AnimatableProperty[];
  /** Frame rate configuration */
  frameRate?: {
    /** Target frame rate */
    target: number;
    /** Whether to adapt based on device capabilities */
    adaptive: boolean;
  };
  /** Whether to use requestAnimationFrame */
  useRAF: boolean;
  /** Whether to batch DOM updates */
  batchUpdate?: boolean;
  /** Whether to enable performance debugging */
  enableDebug?: boolean;
}

/**
 * Animation event types
 * @remarks
 * Events emitted during the animation lifecycle, useful for
 * tracking progress and handling animation states.
 * 
 * @example
 * ```typescript
 * element.addEventListener('animationstart', (event) => {
 *   console.log('Animation started:', event.detail);
 * });
 * ```
 */
export type AnimationEventType =
  | 'start'
  | 'finish'
  | 'cancel'
  | 'pause'
  | 'resume'
  | 'iteration';

/**
 * Animation event detail
 * @remarks
 * Detailed information about animation events, including
 * timing, performance metrics, and current state.
 * 
 * @example
 * ```typescript
 * const detail: AnimationEventDetail = {
 *   animation: config,
 *   type: 'animationupdate',
 *   state: 'running',
 *   timestamp: Date.now(),
 *   performance: {
 *     elapsedTime: 150,
 *     frameRate: 60,
 *     droppedFrames: 0
 *   }
 * };
 * ```
 */
export interface AnimationEventDetail {
  /** Animation configuration */
  animation: AnimationConfig;
  /** Event type */
  type: AnimationEventType;
  /** Current animation state */
  state: AnimationState;
  /** Event timestamp */
  timestamp: number;
  /** Current iteration for repeating animations */
  currentIteration?: number;
  /** Performance metrics */
  performance?: {
    /** Duration since animation start */
    elapsedTime: number;
    /** Actual vs target frame rate */
    frameRate: number;
    /** Number of frames dropped */
    droppedFrames: number;
  };
  /** User's motion preference */
  motionPreference?: MotionPreference;
}

/**
 * Animation configuration
 * @remarks
 * Complete configuration for an animation, including timing,
 * direction, accessibility, and performance settings.
 * 
 * @example
 * ```typescript
 * const config: AnimationConfig = {
 *   name: 'fadeIn',
 *   timing: { duration: 300, easing: 'ease-out' },
 *   direction: 'normal',
 *   fillMode: 'forwards',
 *   iterations: 1,
 *   accessibility: {
 *     respectMotionPreferences: true
 *   },
 *   keyframes: [
 *     { offset: 0, properties: { opacity: 0 } },
 *     { offset: 1, properties: { opacity: 1 } }
 *   ]
 * };
 * ```
 */
export interface AnimationConfig {
  /** Animation name */
  name: string;
  /** Timing configuration */
  timing: AnimationTiming;
  /** Animation direction */
  direction: AnimationDirection;
  /** Fill mode */
  fillMode: AnimationFillMode;
  /** Number of iterations (0 = infinite) */
  iterations: number;
  /** Accessibility configuration */
  accessibility: AnimationAccessibilityConfig;
  /** Performance optimization */
  performance?: AnimationPerformanceConfig;
  /** Animation keyframes */
  keyframes: KeyframeDefinition[];
}

/**
 * Animation group configuration
 * @remarks
 * Configuration for grouped animations, supporting parallel,
 * sequential, and staggered execution of multiple animations.
 * 
 * @example
 * ```typescript
 * const group: AnimationGroupConfig = {
 *   name: 'cardEntrance',
 *   animations: [fadeIn, slideUp, scale],
 *   sequencing: 'staggered',
 *   staggerDelay: 100,
 *   waitForAll: true
 * };
 * ```
 */
export interface AnimationGroupConfig {
  /** Group name */
  name: string;
  /** Animations in the group */
  animations: AnimationConfig[];
  /** How animations should be sequenced */
  sequencing: 'parallel' | 'sequential' | 'staggered';
  /** Delay between animations if staggered */
  staggerDelay?: number;
  /** Whether to wait for all animations to complete */
  waitForAll: boolean;
}

/**
 * Animation manager configuration
 * @remarks
 * Global configuration for the animation system, including
 * defaults, performance settings, and event handling.
 * 
 * @example
 * ```typescript
 * const config: AnimationManagerConfig = {
 *   defaultTiming: { duration: 300, easing: 'ease' },
 *   useHardwareAcceleration: true,
 *   maxConcurrentAnimations: 10,
 *   defaultFillMode: 'forwards',
 *   accessibility: {
 *     respectMotionPreferences: true
 *   },
 *   events: {
 *     emitPerformanceEvents: true,
 *     eventThrottleMs: 100
 *   }
 * };
 * ```
 */
export interface AnimationManagerConfig {
  /** Default timing for all animations */
  defaultTiming: AnimationTiming;
  /** Whether to use hardware acceleration by default */
  useHardwareAcceleration: boolean;
  /** Maximum number of concurrent animations */
  maxConcurrentAnimations: number;
  /** Default fill mode for animations */
  defaultFillMode: AnimationFillMode;
  /** Global accessibility configuration */
  accessibility: AnimationAccessibilityConfig;
  /** Global performance configuration */
  performance?: AnimationPerformanceConfig;
  /** Event configuration */
  events?: {
    /** Whether to emit performance events */
    emitPerformanceEvents: boolean;
    /** Minimum interval between events (ms) */
    eventThrottleMs?: number;
  };
}
