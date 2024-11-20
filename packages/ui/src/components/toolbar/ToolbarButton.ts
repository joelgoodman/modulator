import { ToolbarItem, ToolbarContext, ToolbarEventType, EventEmitter } from '@modulator/types';
import styles from '../../styles/components/toolbar.module.css';

/**
 * Button state
 */
export interface ButtonState {
  isActive: boolean;
  isDisabled: boolean;
  isHidden: boolean;
  isHovered: boolean;
  isFocused: boolean;
}

/**
 * Props for toolbar button
 */
export interface ButtonProps {
  /**
   * Toolbar item configuration
   */
  item: ToolbarItem;

  /**
   * Toolbar context
   */
  context?: ToolbarContext;

  /**
   * Initial state
   */
  isActive?: boolean;
  isDisabled?: boolean;
  isHidden?: boolean;
}

/**
 * Toolbar button component
 */
export class ToolbarButton {
  private element: HTMLButtonElement;
  private item: ToolbarItem;
  private state: ButtonState;
  private eventEmitter: EventEmitter;
  private context?: ToolbarContext;

  constructor(props: ButtonProps) {
    this.item = props.item;
    this.context = props.context;
    this.state = {
      isActive: props.isActive ?? false,
      isDisabled: props.isDisabled ?? false,
      isHidden: props.isHidden ?? false,
      isHovered: false,
      isFocused: false,
    };

    this.element = this.createButton();
    this.setupEventListeners();
  }

  /**
   * Get button element
   */
  getElement(): HTMLButtonElement {
    return this.element;
  }

  /**
   * Get button state
   */
  getState(): ButtonState {
    return { ...this.state };
  }

  /**
   * Update button state and context
   */
  setState(updates: Partial<ButtonState> = {}, newContext?: ToolbarContext): void {
    if (newContext) {
      this.context = newContext;
    }

    Object.assign(this.state, updates);
    this.updateButtonState();
    this.emitEvent('button:stateChanged', { state: this.state });
  }

  /**
   * Subscribe to button events
   */
  on(event: string, handler: (event: any) => void): void {
    this.eventEmitter.on(event, handler);
  }

  /**
   * Unsubscribe from button events
   */
  off(event: string, handler: (event: any) => void): void {
    this.eventEmitter.off(event, handler);
  }

  /**
   * Destroy button
   */
  destroy(): void {
    this.element.remove();
    this.eventEmitter.clear();
  }

  private createButton(): HTMLButtonElement {
    const button = document.createElement('button');
    button.className = styles['modulator-toolbar-button'];
    button.setAttribute('type', 'button');
    button.setAttribute('role', 'button');
    button.setAttribute('aria-label', this.item.label);
    button.setAttribute('aria-pressed', String(this.state.isActive));

    if (this.item.shortcut) {
      button.setAttribute('title', `${this.item.label} (${this.item.shortcut})`);
      button.setAttribute('aria-keyshortcuts', this.item.shortcut);
    }

    // Create button content wrapper
    const content = document.createElement('span');
    content.className = styles['modulator-toolbar-button-content'];

    // Add icon if provided
    if (this.item.icon) {
      const icon = document.createElement('span');
      icon.className = styles['modulator-toolbar-button-icon'];
      icon.setAttribute('aria-hidden', 'true');
      icon.innerHTML = this.item.icon;
      content.appendChild(icon);
    }

    // Add label
    const label = document.createElement('span');
    label.className = styles['modulator-toolbar-button-label'];
    label.textContent = this.item.label;
    // Hide label visually if icon is present, but keep it for screen readers
    if (this.item.icon) {
      label.classList.add(styles['sr-only']);
    }
    content.appendChild(label);

    button.appendChild(content);
    return button;
  }

  private setupEventListeners(): void {
    // Mouse events
    this.element.addEventListener('click', this.handleClick.bind(this));
    this.element.addEventListener('mouseenter', () => this.setState({ isHovered: true }));
    this.element.addEventListener('mouseleave', () => this.setState({ isHovered: false }));

    // Keyboard events
    this.element.addEventListener('focus', () => this.setState({ isFocused: true }));
    this.element.addEventListener('blur', () => this.setState({ isFocused: false }));
    this.element.addEventListener('keydown', this.handleKeyDown.bind(this));

    // Handle shortcut if defined
    if (this.item.shortcut) {
      document.addEventListener('keydown', this.handleShortcut.bind(this));
    }
  }

  private handleClick(event: MouseEvent): void {
    event.preventDefault();
    if (!this.state.isDisabled && this.context) {
      this.item.onClick?.(this.context);
      this.emitEvent('button:click', { id: this.item.id });
    }
  }

  private handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (!this.state.isDisabled && this.context) {
        this.item.onClick?.(this.context);
        this.emitEvent('button:click', { id: this.item.id });
      }
    }
  }

  private handleShortcut(event: KeyboardEvent): void {
    if (!this.item.shortcut || !this.context) return;

    const shortcut = this.item.shortcut.toLowerCase();
    const key = event.key.toLowerCase();
    const ctrl = shortcut.includes('ctrl') === event.ctrlKey;
    const shift = shortcut.includes('shift') === event.shiftKey;
    const alt = shortcut.includes('alt') === event.altKey;
    const meta = shortcut.includes('meta') === event.metaKey;

    if (ctrl && shift && alt && meta && key === shortcut.split('+').pop()) {
      event.preventDefault();
      if (!this.state.isDisabled) {
        this.item.onClick?.(this.context);
        this.emitEvent('button:shortcut', { id: this.item.id });
      }
    }
  }

  private updateButtonState(): void {
    // Update button attributes based on state
    this.element.classList.toggle('is-active', this.state.isActive);
    this.element.classList.toggle('is-disabled', this.state.isDisabled);
    this.element.classList.toggle('is-hidden', this.state.isHidden);
    this.element.classList.toggle('is-hovered', this.state.isHovered);
    this.element.classList.toggle('is-focused', this.state.isFocused);

    this.element.setAttribute('aria-pressed', String(this.state.isActive));
    this.element.disabled = this.state.isDisabled;
    this.element.setAttribute('aria-hidden', String(this.state.isHidden));

    // Update states based on item callbacks if context is available
    if (this.context) {
      if (this.item.isActive) {
        this.state.isActive = this.item.isActive(this.context);
      }
      if (this.item.isDisabled) {
        this.state.isDisabled = this.item.isDisabled(this.context);
      }
      if (this.item.isVisible) {
        this.state.isHidden = !this.item.isVisible(this.context);
      }
    }
  }

  private emitEvent(type: string, data: Record<string, unknown> = {}): void {
    this.eventEmitter.emit({
      type: type as ToolbarEventType,
      data: {
        buttonId: this.item.id,
        ...data,
      },
    });
  }
}
