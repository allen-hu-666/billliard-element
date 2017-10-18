document.addEventListener('DOMContentLoaded', function () {
    var billiardEl = document.getElementById('billiard-ball');
    var billiard = new window.BilliardElement(billiardEl);
    billiard.config({
        FPS: 50,
        frictionSpeed: 1000,
        x: 300,
        y: 300,
        touchDriveCoefficient: 1
    });
    billiard.drive(5000,320);
});