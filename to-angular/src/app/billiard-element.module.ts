import { NgModule, Directive, ElementRef, Input,Output, EventEmitter } from '@angular/core';
import { BilliardElement, BilliardConfigInterface } from '../../../';

@Directive({
    selector: '[billiard-element]'
})
export class BilliardElementDirective {
    billiardEl: BilliardElement;
    @Input("billiard-element") config: BilliardConfigInterface;
    @Output() billiardElCreated: EventEmitter<BilliardElement> = new EventEmitter<BilliardElement>();
    constructor(private el: ElementRef) { }
    ngOnInit() {
        this.billiardEl = new BilliardElement(this.el.nativeElement);
        this.billiardEl.setConfig(this.config);
        this.billiardElCreated.emit(this.billiardEl);
    }
}

@NgModule({
    declarations: [BilliardElementDirective],
    exports: [BilliardElementDirective]
})
export class BilliardElementModule { }