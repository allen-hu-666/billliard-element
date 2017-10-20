const BilliardElement = require('../dist/billiard-element.export.min.js').BilliardElement;

document.addEventListener('DOMContentLoaded', function () {
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
    billiard.drive(5000,320);
});