# billliard-element

## DEMO
[https://elon-hu.github.io/billliard-element/](https://elon-hu.github.io/billliard-element/) 
You can move and launch it   
notice: Touch is only supported by mobile phone or phone mode in chrome  
## Speciality

* easy to use 
* very light(7k)
* esay to customize
* support commonjs, AMD and typescript
* very fluent when element move
* all element can use it.

## Install
```javascript
    sudo npm i billliard-element --save
```
## Initial Position
    You can set initial position by css, like this:
```css
    #billiard-element {
        width: 50px;
        height: 70px;
        position: fixed; 
        /* if you haven't set "position: fixed", the plug will force it and could cause an accident */
        left: 40px;
        top: 40px;
    }
```
## Example

### Without Framework
```javascript
    // import directly，this way create a global variable named "BilliardElement"
    <script src="./node_modules/billiard-element/dist/billiard-element.min.js"></script>
    var BilliardElement = window.BilliardElement;
    // by commonjs
    var BilliardElement = require('billiard-element');
    // by AMD or typescript
    import { BilliardElement } from 'billiard-element';

    <div id="billiard-ball" style="width: 50px;height: 50px;background-color: green;">
    </div>

    var element = document.getElementById('billiard-ball');
    var billiardEl = new BilliardElement(element);
    billiardEl.setConfig({
        FPS: 50,
        frictionSpeed: 1000
    });
    billiardEl.drive(5000,320);// give a driving force
```
### For angular2
```javascript
    import { NgModule } from '@angular/core';
    import { BilliardElementModule } from 'billiard-element/angular';

    @NgModule({
        imports: [
            BilliardElementModule
        ]
    })
    export class AppModule { }
    // and use the directive
    <div billiard-element>
    </div>
```
 if you want config it, fllow the setup
```javascript
    import { Component } from '@angular/core';
    import { BilliardElement, BilliardConfigInterface } from 'billiard-element';

    export class AppComponent {
        billiardConfig: BilliardConfigInterface = {
            touchDriveCoefficient: 1,
            frictionSpeed: 2000
        };
        billiardElCreated(billiardEl: BilliardElement) {
            // billiardElCreated event return the instance of BilliardElement
            billiardEl.drive(4000,247);
        }
    }
    <div [billiard-element] = "billiardConfig" (billiardElCreated) = "billiardElCreated($event)">
    </div>
```

## Method of BilliardElement Instance
#### setConfig(config: BilliardConfigInterface);
    Config the instance, BilliardConfigInterface described by next.
#### getConfig(): BilliardConfigInterface;
    Return a mirror of config parms.
#### drive(speed: number, angle: number): BilliardElement | void;
    Drive the element move.   
    First parameter is the driving speed.   
    Second parameter is the direction of movement, for example, value 90 mean 90°.   
    the method not function when element moving, and return void.
#### updateElPosition(): BilliardElement;
    After instance created, if you modify the element style    
    "width", "height", "top", "left", "bottom" and "right".   
    Just use the method to update. 
## BilliardConfigInterface
```javascript
    interface BilliardConfigInterface {
        moveAreaMarginLeft?: number; // default: 0
        moveAreaMarginRight?: number; // default: 0
        moveAreaMarginTop?: number; // default: 0
        moveAreaMarginBottom?: number;
        /* 
            default moving area of element is fullscreen,
            the parms above is for constom it.
        */
        FPS?: number; // default: 50
        /* 
            Fps of animation. 
            The higher the fps value, the fluent it is, and cost more device performance.
        */
        frictionSpeed?: number; // default: 1000
        /* simulate friction */
        touchDriveCoefficient?: number; // default: 1
        /* the speed drive it by touch will multiplied by the value. */
    }
```