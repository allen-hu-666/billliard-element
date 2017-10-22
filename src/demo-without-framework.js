document.addEventListener('DOMContentLoaded', function () {

    document.addEventListener('touchmove', function(e) {
        e.preventDefault();
    });
    document.addEventListener('touchstart', function(e) {
        e.preventDefault();
    });
    var BilliardElement = window.BilliardElement;
    
    var el1 = document.getElementById('billiard-ball1');
    var billiardEl1 = new BilliardElement(el1);
    billiardEl1.setConfig({
        moveAreaMarginLeft: 50,
        moveAreaMarginRight: 50,
        moveAreaMarginTop: 50,
        moveAreaMarginBottom: 50,
    });
    billiardEl1.drive(5000,313);

    var el2 = document.getElementById('billiard-ball2');
    var billiardEL2 = new BilliardElement(el2);
    billiardEL2.setConfig({
        touchDriveCoefficient: 1,
        frictionSpeed: 2000
    });
    billiardEL2.drive(5000,117);
});