import {
  AnimationTiming,
  KeyframeDefinition,
  AnimationConfig,
  AnimationGroupConfig,
  AnimationManagerConfig,
  AnimationAccessibilityConfig,
  AnimationPerformanceConfig,
} from '../animation.js';

// Valid configurations
const validTiming: AnimationTiming = {
  duration: 1000,
  delay: 0,
  easing: 'ease-in-out',
};

const validKeyframe: KeyframeDefinition = {
  offset: 0,
  properties: {
    opacity: '0',
    transform: 'translateX(0)',
  },
  easing: 'ease-in-out',
};

const validAccessibilityConfig: AnimationAccessibilityConfig = {
  respectMotionPreferences: true,
  defaultMotionPreference: 'no-preference',
  reducedMotionAlternative: {
    skip: false,
    timing: validTiming,
    properties: {
      opacity: '1',
    },
  },
  isEssential: false,
  ariaDescription: 'Fade in animation',
};

const validPerformanceConfig: AnimationPerformanceConfig = {
  useHardwareAcceleration: true,
  gpuProperties: ['transform', 'opacity'],
  frameRate: {
    target: 60,
    adaptive: true,
  },
  useRAF: true,
  batchUpdate: true,
  enableDebug: false,
};

const validConfig: AnimationConfig = {
  name: 'fade',
  timing: validTiming,
  direction: 'normal',
  fillMode: 'forwards',
  iterations: 1,
  keyframes: [validKeyframe],
  accessibility: validAccessibilityConfig,
  performance: validPerformanceConfig,
};

// Invalid configurations
// @ts-expect-error - missing required properties and invalid types
const invalidTiming = {
  ...validTiming,
  duration: 'not-a-number',
  easing: 'invalid-easing',
} as AnimationTiming;

// @ts-expect-error - missing required properties and invalid types
const invalidKeyframe = {
  ...validKeyframe,
  offset: 'not-a-number',
  properties: null,
} as KeyframeDefinition;

// @ts-expect-error - missing required properties and invalid types
const invalidConfig = {
  ...validConfig,
  name: 123,
  timing: null,
  direction: 'invalid-direction',
  fillMode: 'invalid-fillmode',
  keyframes: null,
} as AnimationConfig;

// @ts-expect-error - missing required properties and invalid types
const invalidGroupConfig = {
  name: 123,
  animations: [validConfig],
  sequencing: 'invalid-sequence',
  waitForAll: 'not-a-boolean',
} as AnimationGroupConfig;

// @ts-expect-error - missing required properties and invalid types
const invalidManagerConfig = {
  defaultTiming: validTiming,
  useHardwareAcceleration: 'not-a-boolean',
  maxConcurrentAnimations: 'not-a-number',
  defaultFillMode: 'invalid-fillmode',
  accessibility: validAccessibilityConfig,
} as AnimationManagerConfig;
