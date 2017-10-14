const { MyEventEmitter } = require('./my_event_emitter.js');
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
        this.params = {
            x: 200,
            y: 200,
            speed: 5000,
            frictionSpeed: 300,
            moveAngle: 197,
            FS: 60,
            contentWidth: this.contentWidth,
            contentHeight: this.contentHeight
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
        this._start();
    }
    _move(x, y) {
        this._el.style.WebkitTransform = "translate(" + this._translateX + "px," + this._translateY + 'px)';
    }
    _start() {
        this.setAnimation();
        this._interval = setInterval(()=>{
            const coorChange = this.getAnimation();
            if(!coorChange) {
                clearInterval(this._interval);
                this.emit('billardMoveEnd');
                return;
            };
            this._el.style.WebkitTransform = "translate(" + coorChange.x + "px," + coorChange.y + 'px)';
        },1000/this.FS);
    }
    getNextFsInfo(params) {
        //return null;
        //console.log(params);
        const angle = params.moveAngle;
        const endSpeed = params.speed - params.frictionSpeed/params.FS;
        if(endSpeed<=0) return false;
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
        const pai = 0.017453293;
        const y = -distance*Math.sin(params.moveAngle*pai);
        const x = distance*Math.cos(params.moveAngle*pai);
        params.x += x;
        params.y += y;
        return {
            x: params.x,
            y: params.y
        }
    }
    setAnimation() {
        let animation = [];
        for(let i=0;i<9999999;i++) {
            const res = this.getNextFsInfo(this.params);
            if(!res) break;
            animation.push(res);
        }
        animation.reverse();
        this._animarion = animation;
        return animation;
    }
    getAnimation() {
        return this._animarion.pop();
    }
}

BilliardElement.BilliardElement = BilliardElement;
module.exports = BilliardElement;