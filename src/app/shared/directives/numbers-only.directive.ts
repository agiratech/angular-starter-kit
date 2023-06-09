import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[appNumbersOnly]',
})
export class NumbersOnlyDirective {
  // Allow decimal numbers and negative values
  @Input() regex: RegExp = new RegExp(/^-?[0-9]+(\.[0-9]*){0,1}$/g);
  // Allow key codes for special events. Reflect :
  // Backspace, tab, end, home
  private specialKeys: Array<string> = [
    'Enter',
    'Backspace',
    'Delete',
    'Tab',
    'End',
    'Home',
    'ArrowLeft',
    'ArrowRight',
    'ArrowUp',
    'ArrowDown',
  ];
  @Input('min') MIN: any;
  @Input('max') MAX: any;
  @Input('length') MAX_NO_OF_DIGITS: any;
  @Input() canAllowMinus = false;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    if (this.MAX_NO_OF_DIGITS && this.el.nativeElement) {
      this.renderer.setAttribute(
        this.el.nativeElement,
        'maxLength',
        this.MAX_NO_OF_DIGITS
      );
    }
    if (this.canAllowMinus) {
      this.specialKeys.push('-');
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // Allow Backspace, tab, end, and home keys '-', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'
    // metaKey For Mac
    if (
      this.specialKeys.indexOf(event.key) !== -1 ||
      (event.key === 'v' && event.ctrlKey) ||
      (event.key === 'v' && event.metaKey) ||
      (event.key === 'x' && event.ctrlKey) ||
      (event.key === 'x' && event.metaKey) ||
      (event.key === 'c' && event.ctrlKey) ||
      (event.key === 'a' && event.ctrlKey)
    ) {
      return;
    }
    /**
     * This condition is user to allow only numbers with out checking min and max values
     */
    if (!this.MIN && !this.MAX) {
      let current: string = this.el.nativeElement.value;
      let next: string = current.concat(event.key);
      if (next && !String(next).match(this.regex)) {
        event.preventDefault();
      }
    }

    /**
     * This condition is user to allow only numbers with checking min and max values
     */
    if (this.MIN !== undefined && this.MAX !== undefined) {
      let current: string = this.el.nativeElement.value;
      let next: string = current.concat(event.key);
      if (
        Number(next) <= Number(this.MAX) &&
        Number(next) >= Number(this.MIN)
      ) {
        if (next && !String(next).match(this.regex)) {
          event.preventDefault();
        }
      } else {
        event.preventDefault();
      }
    }
  }

  @HostListener('paste', ['$event']) blockPaste(event: any) {
    // Ensure that it is a number and stop the paste
    if (
      event.clipboardData.getData('Text').match(/[^\d\.?\d]/) &&
      !event.clipboardData.getData('Text').match(this.regex)
    ) {
      event.preventDefault();
    }
  }
}
