const { MyEventEmitter } = require('./my_event_emitter.js');
const Promise = require('es6-promise-promise');
/* 
    100px = 1m;
 */
//class Animation
class BilliardElement extends MyEventEmitter {
    constructor(el) {
        super();
        this._el = el;
        this._elParent = el.parentElement;
        this.width = el.offsetWidth;
        this.height = el.offsetHeight;
        const parentEl = document.getElementsByTagName('body')[0];
        this.contentWidth = parentEl.offsetWidth - this.width;
        this.contentHeight = parentEl.offsetHeight - this.height;
        this._interval = null;
        this._translateX = 200;
        this._translateY = 200;
        this._speed = 500;
        this._moveAngle = 120;
        this.FS = 60;
        let style = this._el.style;
        style.position = 'fixed';
        style.top = "0px";
        style.left = "0px";
        this._params = {
            x: 200,
            y: 200,
            contentWidth: this.contentWidth,
            contentHeight: this.contentHeight,
            speed: 0,
            frictionSpeed: 300,
            moveAngle: 197,
            FS: 60,
            autoAttractedByWall: true,
            attractSpeed: 400
        };
        this._moveStart = false;
        el.addEventListener('mousedown',res=>{
            this._moveStart = true;
        });
        this._elParent.addEventListener('mousemove',res=>{
            if(this._moveStart) {
                this._move(res.clientX,res.clientY);
            }
        });
        this._elParent.addEventListener('mouseup',res=>{
            this._moveStart = false;
            this.emit('mouseup');
        });
        this.launchBilliard(3000);
    }
    launchBilliard(speed) {
        this._params.speed = speed;
        let animations = this._getAnimations(res=>{
            return this._getNextFsMoveInfo(this._params);
        });
        return this._startAnimation(animations);
    }
    _startAnimation(animations) {
        return new Promise((resolve, reject)=>{
            const style = this._el.style;
            this._interval = setInterval(()=>{
                const coorChange = animations.pop();
                if(!coorChange) {
                    clearInterval(this._interval);
                    resolve();
                    return;
                };
                style.WebkitTransform = "translate(" + coorChange.x + "px," + coorChange.y + 'px)';
            },1000/this._params.FS);
        });
    }
    _getNextFsMoveInfo(params) {
        const angle = params.moveAngle;
        let endSpeed = params.speed - params.frictionSpeed/params.FS;
        if(endSpeed <=0 ) {
            endSpeed = 0;
            return;
        };
        const averageSpeed = (params.speed + endSpeed)/2;
        params.speed = endSpeed;
        if(params.x>=params.contentWidth){
            params.x = params.contentWidth;
            if(angle>270){
                params.moveAngle -= 90;
            }else {
                params.moveAngle += 90;
            }
        }
        if(params.x <= 0){
            params.x = 0;
            if(angle>180){
                params.moveAngle += 90;
            }else {
                params.moveAngle -= 90;
            }
        }
        if(params.y>=params.contentHeight){
            params.y=params.contentHeight
            if(angle>270){
                params.moveAngle -= 270;
            }else {
                params.moveAngle -= 90;
            }
        }
        if(params.y <= 0){
            params.y = 0;
            if(angle>90){
                params.moveAngle += 90;
            }else {
                params.moveAngle += 270;
            }
        }
        const distance = averageSpeed/params.FS;
        return this._getXY(params, averageSpeed, params.moveAngle);
    }
    _getXY(params, speed, angle) {
        const pai = 0.017453293;
        const distance = speed/params.FS;
        const y = -distance*Math.sin(angle*pai);
        const x = distance*Math.cos(angle*pai);
        params.x += x;
        params.y += y;
        return {
            x: params.x,
            y: params.y
        }
    }
    _getAnimations(fn) {
        let animations = [];
        for(let i=0;i<100000;i++) {
            const res = fn();
            if(!res) break;
            animations.push(res);
        }
        animations.reverse();
        //console.log(animations);
        return animations;
    }
    _getNextFsAttractInfo(params) {
        let angle = 0;
        if(params.x > params.contentWidth) {
            params.x = params.contentWidth;
            angle = 180;
            params.speed = -params.speed;
        }
        let endSpeed = params.speed + params.attractSpeed/params.FS;
        //console.log(endSpeed);
        if(endSpeed <=0 ) {
            endSpeed = 0;
            angle = 0;
            params.speed = -params.speed;
            return;
        };
        const averageSpeed = (params.speed + endSpeed)/2;
        params.speed = endSpeed;
        return this._getXY(params, averageSpeed, angle);
    }
}

BilliardElement.BilliardElement = BilliardElement;
module.exports = BilliardElement;