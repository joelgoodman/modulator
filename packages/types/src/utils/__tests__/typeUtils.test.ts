import { expect } from 'chai';
import {
  isUIComponent,
  isComponentType,
  hasRequiredProps,
} from '../typeUtils.js';

describe('Type Utilities', () => {
  describe('Type Guards', () => {
    describe('isUIComponent', () => {
      it('should return true for valid UI components', () => {
        const component = { type: 'button', props: {} };
        expect(isUIComponent(component)).to.be.true;
      });

      it('should return false for non-components', () => {
        expect(isUIComponent(null)).to.be.false;
        expect(isUIComponent({})).to.be.false;
        expect(isUIComponent({ type: 123 })).to.be.false;
      });
    });

    describe('isComponentType', () => {
      it('should return true for matching component types', () => {
        const button = { type: 'button', props: {} };
        expect(isComponentType(button, 'button')).to.be.true;
      });

      it('should return false for non-matching types', () => {
        const button = { type: 'button', props: {} };
        expect(isComponentType(button, 'input')).to.be.false;
      });
    });

    describe('hasRequiredProps', () => {
      it('should return true when all required props exist', () => {
        const obj = { name: 'test', value: 123 };
        expect(hasRequiredProps(obj, ['name', 'value'])).to.be.true;
      });

      it('should return false when props are missing', () => {
        const obj = { name: 'test' };
        expect(hasRequiredProps(obj, ['name', 'value'])).to.be.false;
      });
    });
  });
});

// Type-level tests using TypeScript's type system
type TestReadonly = DeepReadonly<{ a: { b: number } }>;
// @ts-expect-error - Cannot assign to 'b' because it is a read-only property
const readonlyTest: TestReadonly = { a: { b: 1 } }; readonlyTest.a.b = 2;

type TestPartial = DeepPartial<{ a: { b: number } }>;
const partialTest: TestPartial = {}; // Should compile with no errors

type TestStrictExtract = StrictExtract<'a' | 'b', 'a' | 'c'>;
const extractTest: TestStrictExtract = 'a'; // Should only allow 'a'

type TestExhaustive = AssertExhaustive<'a' | 'b', 'a' | 'b'>;
const exhaustiveTest: TestExhaustive = true; // Should be true

interface TestComponent {
  type: 'test';
  state: { value: number };
}
type TestState = UIStateConstraint<TestComponent>;
const stateTest: TestState = { value: 123 }; // Should compile if state matches

type TestProps = DynamicProps<{ type: 'button' }>;
// Should resolve to button props type
