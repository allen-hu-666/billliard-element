import { Directive, ElementRef } from '@angular/core';
import { BilliardElement } from '../../../src';

@Directive({
  selector: '[billiardelement]',
})
export class BilliardElementDirective {
  //static billiardS: BilliardElementManager;
  billiard: BilliardElement;
  constructor(el: ElementRef) {
    this.billiard = new BilliardElement(el.nativeElement);
    el.nativeElement.style.backgroundColor = 'gray';
  }
}
