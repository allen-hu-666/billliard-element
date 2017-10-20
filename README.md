# billliard-element

### DEMO
[https://elon-hu.github.io/billliard-element/](https://elon-hu.github.io/billliard-element/)
notice: you just touch it on mobile phone or use phone mode in chrome
### Speciality（特性）

* easy to use 
* essy to fork

### Install（安装）

```javascript
    sudo npm i billliard-element --save
```
### Import（包含）
```javascript
    <script src="./node_modules/billiard-element/dist/billiard-element.min.js"></script>
    or
    var BilliardElement = require('billiard-element');
    or
    import { BilliardElement } from 'billiard-element';
```
### Usage（用法）

```javascript
    <div id="billiard-ball"
        style="
        width:50px;
        height: 50px;
        text-align: center;
        line-height: 50px;
        color: #fff;
        font-size: 14px; 
        border-radius: 50%;
        background-color: green;">
        elment
    </div>

    var billiardEl = document.getElementById('billiard-ball');
    //console.log(window.BilliardElement);
    var BilliardElement = window.BilliardElement;
    var billiard = new BilliardElement(billiardEl);
    billiard.config({
        FPS: 50,
        frictionSpeed: 1000,
        x: 300,
        y: 300,
        touchDriveCoefficient: 1
    });
    billiard.drive(5000,320);// give a driving force
```
### Notice(注意)
you just touch is