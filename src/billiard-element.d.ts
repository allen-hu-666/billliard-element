export declare interface BilliardConfigInterface {
    moveAreaMarginLeft?: number;
    moveAreaMarginRight?: number;
    moveAreaMarginTop?: number;
    moveAreaMarginBottom?: number;
    FPS?: number;
    frictionSpeed?: number;
    touchDriveCoefficient?: number;
}

type BilliardStaus = 'uninit' | 'moving' | 'static';

export declare class BilliardElement {
    
    readonly status: BilliardStaus;

    constructor(el: HTMLElement);

    // if(this.status === 'moving') this operation will not function and return void;
    drive(speed: number, angle: number): BilliardElement | void;

    setConfig(config: BilliardConfigInterface): BilliardElement;

    getConfig(): BilliardConfigInterface;

    updateElPosition(): BilliardElement;
}