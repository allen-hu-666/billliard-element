export interface ConfigInterface {
    x?: number;
    y?: number;
    FPS?: number;
    frictionSpeed?: number;
    touchDriveCoefficient?: number;
}

type BilliardStaus = 'moving' | 'static';

export declare class BilliardElement {

    readonly status: BilliardStaus;

    constructor(el: any, autoStart: boolean = true);

    // if(this.status === 'moving') this operation will not function and return void;
    drive(speed: number, angle: number): BilliardElement | void;

    config(config: ConfigInterface): BilliardElement;
}