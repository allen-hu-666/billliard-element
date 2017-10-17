import { NgModule, Directive, ElementRef } from '@angular/core';
import { BilliardElement } from './billiard-element.js';

@Directive({
  selector: '[billiardelement]'
})
class BilliardElementDirective {
  billiard: any;
  constructor(el: ElementRef) {
    this.billiard = new BilliardElement(el.nativeElement);
  }
}

@NgModule({
  declarations: [ BilliardElementDirective ],
  exports: [ BilliardElementDirective ]
})
export class BilliardElementModule { }