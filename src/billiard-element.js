const {
    MyEventEmitter
} = require('./my-event-emitter.js');


let prefix = function() {
    var div = document.createElement('div');
    var cssText = '-webkit-transition:all .1s; -moz-transition:all .1s; -o-transition:all .1s; -ms-transition:all .1s; transition:all .1s;';
    div.style.cssText = cssText;
    var style = div.style;
    console.log("asasdsasddaadasdas");
    if (style.webkitTransition) {
        return 'WebkitTransform';
    }
    if (style.MozTransition) {
        return 'MozTransform';
    }
    if (style.oTransition) {
        return 'oTransform';
    }
    if (style.msTransition) {
        return 'msTransform';
    }
    return 'transform';
}();

class TouchDrive {
    constructor(el) {
        this._el = el;
        this._x = 0;
        this._y = 0;
        this._history = [];
        this._ALLOW_HISTORY = 3;
    }
    init(params) {
        this._params = params;
        return this;
    }
    start(event) {
        //event.preventDefault();
        this._x = event.changedTouches[0].clientX;
        this._y = event.changedTouches[0].clientY;
    }
    move(event) {
        event.preventDefault();
        const x = event.changedTouches[0].clientX;
        const y = event.changedTouches[0].clientY;
        const changeX = x - this._x;
        const changeY = y - this._y;
        this._x = x;
        this._y = y;
        let p = this._params;
        p.x += changeX;
        p.y += changeY;
        p.x = p.x < 0 ? 0 : p.x;
        p.y = p.y < 0 ? 0 : p.y;
        p.x = p.x > p.contentWidth ? p.contentWidth : p.x;
        p.y = p.y > p.contentHeight ? p.contentHeight : p.y;
        const res = {
            x: x,
            y: y,
            timeStamp: event.timeStamp
        }
        let history = this._history;
        history.push(res);
        if (history.length > this._ALLOW_HISTORY) {
            history.shift();
        }
        return this;
    }
    end(event) {
        //event.preventDefault();
        let history = this._history;
        const allowHistory = this._ALLOW_HISTORY;
        if (history.length < allowHistory) {
            this._history = [];
            return false;
        };
        //console.log(history.length);
        const last = history[history.length - 1];
        const lastPreviou = history[history.length - 2];
        const changeX = last.x - lastPreviou.x;
        const changeY = last.y - lastPreviou.y;
        const time = last.timeStamp - lastPreviou.timeStamp;
        let speed = Math.sqrt(changeX * changeX + changeY * changeY) * 1000 / time;
        if (speed < 500) {
            this._history = [];
            return false;
        };
        const pi = 3.1415926535898
        let angle = Math.atan2(-changeY, changeX) * 180 / pi;
        if (angle < 0) angle = 360 + angle;
        this._history = [];
        return {
            speed: speed,
            angle: angle
        }
    }
}
class BilliardElement extends MyEventEmitter {
    static create(el, autoStart = true) {
        return new this(el, autoStart);
    }
    constructor(el, autoStart = true) {
        super();
        this._el = el;
        this._initElStyle(el);
        this._interval = null;
        this.status = 'static'; // 'static' | 'moving'
        const body = document.body;
        const contentWidth = body.clientWidth - el.offsetWidth;
        const contentHeight = body.clientHeight - el.offsetHeight;
        const area = this._getMoveArea(el);
        //console.log({el: el});
        this._params = {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            contentWidth: contentWidth,
            contentHeight: contentHeight,
            speed: 0,
            frictionSpeed: 1000,
            moveAngle: 0,
            FPS: 50,
            touchDriveCoefficient: 1,
            autoAttractedByWall: true,
            attractSpeed: 400
        };
        this._moveAreaPadding = {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0
        };
        this._touchDrive = (new TouchDrive(el)).init(this._params);
        el.addEventListener('touchstart', e => {
            this._touchDrive.start(e);
        });
        el.addEventListener('touchmove', e => {
            this._touchDrive.move(e);
            this._updateEl(this._params.x, this._params.y);
        });
        el.addEventListener('touchend', e => {
            let moveRes = this._touchDrive.end(e);
            if (!!moveRes) {
                const speed = moveRes.speed * this._params.touchDriveCoefficient;
                this.drive(speed, moveRes.angle);
            }
        });
    }
    config(con = {}) {
        let p = this._params;
        p.width = con.width || p.width;
        p.height = con.height || p.height;
        p.FPS = con.FPS || p.FPS;
        p.frictionSpeed = con.frictionSpeed || p.frictionSpeed;
        p.touchDriveCoefficient = con.touchDriveCoefficient || p.touchDriveCoefficient;
        const body = document.body;
        if(!!con.width) {
            p.contentWidth = body.clientWidth - con.width;
        }
        if(!!con.height) {
            p.contentHeight = body.clientHeight - con.height;
        }
        p.x = con.top || p.x;
        p.y = con.left || p.y;
        if(!!con.right) p.x = p.contentWidth - con.right;
        if(!!con.bottom) p.y = p.contentHeight - con.bottom;
        this._updateEl(p.x, p.y);
        return this;
    }
    setMoveAreaPadding(con = {}) {
        const body = document.body;
        let padding = this._moveAreaPadding;
        let p = this._params;
        let style = this._el.style;
        style.top = (padding.top = con.top|| padding.top) + 'px';
        style.left = (padding.left = con.left|| padding.left) + 'px';
        padding.bottom = con.bottom|| padding.bottom;
        padding.right = con.right|| padding.right
        p.contentWidth = body.clientWidth - p.width - padding.left - padding.right;
        p.contentHeight = body.clientHeight - p.height - padding.top  - padding.right;
        return this;
    }
    drive(speed, angle) {
        if (typeof speed !== 'number' && typeof angle !== 'number')
            throw 'speed or angle not matching';
        if (this.status === 'moving') return undefined;
        this._params.speed = speed;
        this._params.moveAngle = angle;
        let movePath = this._getMovePath(res => {
            return this._getNextFsMoveInfo(this._params);
        });
        this._move(movePath);
        return this;
    }
    _initElStyle(el) {
        el.style.position = 'fixed';
        el.style.top = "0px";
        el.style.left = "0px";
        return this;
    }
    _getMoveArea(el) {
        const parentEl = document.getElementsByTagName('body')[0];
        const areaWidth = parentEl.offsetWidth - el.offsetWidth;
        const areaHeight = parentEl.offsetHeight - el.offsetHeight;
        return {
            areaWidth: areaWidth,
            areaHeight: areaHeight
        }
    }
    _updateEl(x, y) {
        this._el.style[prefix] = "translate(" + x + "px," + y + 'px)';
        return this;
    }
    _move(animations, resolve) {
        const style = this._el.style;
        const fpsTime = 1000 / this._params.FPS;
        this.status = 'moving';
        this._interval = setInterval(() => {
            const coorChange = animations.pop();
            if (!coorChange) {
                clearInterval(this._interval);
                this.status = 'static';
                return;
            };
            this._updateEl(coorChange.x, coorChange.y);
        }, fpsTime);
        return this;
    }
    _getNextFsMoveInfo(params) {
        const angle = params.moveAngle;
        let endSpeed = params.speed - params.frictionSpeed / params.FPS;
        if (endSpeed <= 0) {
            endSpeed = 0;
            return;
        };
        const averageSpeed = (params.speed + endSpeed) / 2;
        params.speed = endSpeed;
        if (params.x >= params.contentWidth) {
            params.x = params.contentWidth;
            if (angle > 270) {
                params.moveAngle = 180 - params.moveAngle;
            } else {
                params.moveAngle = 180 - params.moveAngle;
            }
        }
        if (params.x <= 0) {
            params.x = 0;
            if (angle > 180) {
                params.moveAngle = 180 - params.moveAngle;
            } else {
                params.moveAngle = 180 - params.moveAngle;
            }
        }
        if (params.y >= params.contentHeight) {
            params.y = params.contentHeight
            if (angle > 270) {
                params.moveAngle = 360 - params.moveAngle;
            } else {
                params.moveAngle = 360 - params.moveAngle;
            }
        }
        if (params.y <= 0) {
            params.y = 0;
            if (angle > 90) {
                params.moveAngle = 360 - params.moveAngle;
            } else {
                params.moveAngle = 360 - params.moveAngle;
            }
        }
        const distance = averageSpeed / params.FPS;
        return this._getXY(params, averageSpeed, params.moveAngle);
    }
    _getXY(params, speed, angle) {
        const pai = 0.017453293;
        const distance = speed / params.FPS;
        const y = -distance * Math.sin(angle * pai);
        const x = distance * Math.cos(angle * pai);
        params.x += x;
        params.y += y;
        params.x = params.x < 0 ? 0 : params.x;
        params.y = params.y < 0 ? 0 : params.y;
        params.x = params.x > params.contentWidth ? params.contentWidth : params.x;
        params.y = params.y > params.contentHeight ? params.contentHeight : params.y;
        return {
            x: params.x,
            y: params.y
        }
    }
    _getMovePath(fn) {
        let movePath = [];
        for (let i = 0; i < 100000; i++) {
            const res = fn();
            if (!res) break;
            movePath.push(res);
        }
        movePath.reverse();
        return movePath;
    }
    _getNextFsAttractInfo(params) {
        let angle = 0;
        if (params.x > params.contentWidth) {
            params.x = params.contentWidth;
            angle = 180;
            params.speed = -params.speed;
        }
        let endSpeed = params.speed + params.attractSpeed / params.FPS;
        if (endSpeed <= 0) {
            endSpeed = 0;
            angle = 0;
            params.speed = -params.speed;
            return;
        };
        const averageSpeed = (params.speed + endSpeed) / 2;
        params.speed = endSpeed;
        return this._getXY(params, averageSpeed, angle);
    }
}

BilliardElement.BilliardElement = BilliardElement;
module.exports = BilliardElement;