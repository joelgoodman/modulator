# Component Implementation Checklist

## Component Information

- **Name**: BlockToolbar
- **Package**: @modulator/ui
- **Path**: src/components/toolbar/BlockToolbar.ts

## 1. Type Dependencies (@modulator/types)

- [ ] Required Types:
  - [ ] ToolbarPositionType (from 'plugins/toolbar')
    - [ ] Verify position type literals match requirements
    - [ ] Document usage in position calculations
  - [ ] ToolbarItem (from 'plugins/toolbar')
    - [ ] Verify item structure matches UI needs
    - [ ] Document required vs optional fields
  - [ ] ToolbarGroup (from 'plugins/toolbar')
    - [ ] Verify group management compatibility
    - [ ] Document group hierarchy
  - [ ] ToolbarContext (from 'plugins/toolbar')
    - [ ] Verify context data sufficiency
    - [ ] Document context updates
  - [ ] BlockToolbarConfig (from 'ui/toolbar')
    - [ ] Verify configuration completeness
    - [ ] Document configuration options

## 2. Interface Implementation

- [ ] Implements BlockToolbarInterface:
  - [ ] registerBlockToolbar(config: BlockToolbarConfig)
    - [ ] Parameter validation for required fields
    - [ ] Return type validation (void)
    - [ ] Error handling for duplicate registrations
  - [ ] getBlockToolbarConfig(blockType: string)
    - [ ] Parameter validation for blockType
    - [ ] Return type validation (BlockToolbarConfig | undefined)
    - [ ] Error handling for missing configs
  - [ ] createToolbar(context: ToolbarContext)
    - [ ] Parameter validation for context
    - [ ] Return type validation (HTMLElement)
    - [ ] Error handling for invalid context
  - [ ] updateToolbar(toolbar: HTMLElement, context: ToolbarContext)
    - [ ] Parameter validation for both params
    - [ ] Return type validation (void)
    - [ ] Error handling for invalid toolbar element

## 3. Component Requirements

- [ ] State Management:
  - [ ] Toolbar Registry State
    - [ ] Track registered toolbars
    - [ ] Track active toolbar
    - [ ] Track toolbar positions
  - [ ] Selection State
    - [ ] Track current block selection
    - [ ] Track text selection
  - [ ] UI State
    - [ ] Track toolbar visibility
    - [ ] Track item states
- [ ] Event Handling:
  - [ ] Selection Events
    - [ ] Block selection change
    - [ ] Text selection change
  - [ ] Toolbar Events
    - [ ] Item click
    - [ ] Group collapse/expand
  - [ ] Position Events
    - [ ] Window resize
    - [ ] Scroll
- [ ] DOM Management:
  - [ ] Toolbar Container
    - [ ] Create container element
    - [ ] Position management
    - [ ] Cleanup on unmount
  - [ ] Toolbar Items
    - [ ] Create item elements
    - [ ] Update item states
    - [ ] Handle item interactions

## 4. Dependencies

- [ ] External:
  - [ ] @modulator/core (^1.0.0)
    - [ ] EventEmitter
    - [ ] DOM utilities
  - [ ] @modulator/types (^1.0.0)
    - [ ] All toolbar types
- [ ] Internal:
  - [ ] ToolbarRegistry
    - [ ] Item management
    - [ ] Group management
  - [ ] ToolbarButton
    - [ ] Button creation
    - [ ] State management

## 5. Testing Requirements

- [ ] Unit Tests:
  - [ ] Registration
    - [ ] Valid config registration
    - [ ] Invalid config handling
    - [ ] Duplicate registration
  - [ ] Toolbar Creation
    - [ ] Valid context
    - [ ] Invalid context
    - [ ] Position calculation
  - [ ] Event Handling
    - [ ] Selection events
    - [ ] Item click events
    - [ ] Position updates
- [ ] Integration Tests:
  - [ ] Full Workflow
    - [ ] Block selection to toolbar display
    - [ ] Item interaction to state update
    - [ ] Position updates on scroll/resize

## 6. Documentation

- [ ] JSDoc Comments
  - [ ] Interface implementation
  - [ ] Public methods
  - [ ] Event handlers
- [ ] Usage Examples
  - [ ] Basic toolbar creation
  - [ ] Custom toolbar configuration
  - [ ] Event handling
- [ ] API Documentation
  - [ ] Method signatures
  - [ ] Configuration options
  - [ ] Event types

## 7. Accessibility

- [ ] ARIA Attributes
  - [ ] role="toolbar"
  - [ ] aria-label
  - [ ] aria-controls
  - [ ] aria-expanded
- [ ] Keyboard Navigation
  - [ ] Tab order
  - [ ] Arrow key navigation
  - [ ] Shortcut keys
- [ ] Screen Reader Support
  - [ ] Meaningful labels
  - [ ] State announcements
  - [ ] Error notifications

## Implementation Notes

- Position updates should be debounced to prevent performance issues
- Consider using ResizeObserver for container size changes
- Cache DOM queries for performance
- Use event delegation for toolbar items
- Consider adding position adjustment for viewport boundaries
- Implement proper cleanup to prevent memory leaks
- Consider adding animation options for toolbar appearance/disappearance
