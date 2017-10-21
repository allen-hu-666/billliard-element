// @ts-check
const BilliardTouchDrive = require('./billiard-touch-drive.js');

let prefix = function () {
    var div = document.createElement('div');
    var cssText = '-webkit-transition:all .1s; -moz-transition:all .1s; -o-transition:all .1s; -ms-transition:all .1s; transition:all .1s;';
    div.style.cssText = cssText;
    var style = div.style;
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

class BilliardElement {
    static create(el) {
        return new this(el);
    }
    constructor(el) {
        this._el = el;
        el.style.position = 'fixed';
        this._interval = null;
        this.status = 'uninit'; // 'uninit'|'static' | 'moving'
        this._moveStatus = {
            x:0,
            y:0,
            MAX_X: 0,
            MAX_Y: 0,
            FPS: 50,
            speed: 0,
            frictionSpeed: 1000,
            touchDriveCoefficient: 1,
            limit: {
                minX: 0,
                maxX: 0,
                minY: 0,
                maxY: 0
            }
        };
        this._config = {
            moveAreaMarginLeft: 0,
            moveAreaMarginRight: 0,
            moveAreaMarginTop: 0,
            moveAreaMarginBottom: 0,
            FPS: 50,
            frictionSpeed: 1000,
            touchDriveCoefficient: 1,
        };
        this._touchDrive = (new BilliardTouchDrive(el)).init(this._moveStatus);
        el.addEventListener('touchstart', e => {
            this.updateElPosition(false);
            this.status = 'moving';
            this._touchDrive.start(e);
        });
        el.addEventListener('touchmove', e => {
            this._touchDrive.move(e);
            this._updateEl(this._moveStatus.x, this._moveStatus.y);
        });
        el.addEventListener('touchend', e => {
            this.status = 'static';
            let moveRes = this._touchDrive.end(e);
            //console.log(moveRes);
            if (!!moveRes) {
                const speed = moveRes.speed * this._moveStatus.touchDriveCoefficient;
                this.drive(speed, moveRes.angle);
            }
        });
    }
    getConfig() {
        return JSON.parse(JSON.stringify(this._config));
    }
    setConfig(con = {}) {
        let config = this._config;
        for (let i in con) {
            if (!!config[i] || config[i] === 0 || config[i] === false) {
                config[i] = con[i];
            }
        }
        this.updateElPosition();
        this._useConfig();
        return this;
    }
    _useConfig() {
        const config = this._config;
        let moveStatus = this._moveStatus;
        let limit = this._moveStatus.limit;
        moveStatus.FPS = config.FPS;
        moveStatus.frictionSpeed = config.frictionSpeed;
        moveStatus.touchDriveCoefficient = config.touchDriveCoefficient;
        limit.minX = config.moveAreaMarginLeft;
        limit.minY = config.moveAreaMarginTop;
        limit.maxX = moveStatus.MAX_X - config.moveAreaMarginRight;
        limit.maxY = moveStatus.MAX_Y - config.moveAreaMarginBottom;
        return this;
    }
    drive(speed, angle) {
        if (typeof speed !== 'number' && typeof angle !== 'number')
            throw 'speed or angle not matching';
        if (this.status === 'moving') return undefined;
        this.updateElPosition(false);
        let moveStatus = this._moveStatus;
        moveStatus.speed = speed;
        moveStatus.moveAngle = angle;
        let movePath = this._getMovePath(res => {
            return this._getNextFsMoveInfo(moveStatus);
        });
        this._move(movePath);
        return this;
    }
    updateElPosition(force = true) {
        if(this.status!=="uninit" && !force) return;
        const el = this._el;
        let s = this._moveStatus;
        let limit = this._moveStatus.limit;
        s.x = el.offsetLeft;
        s.y = el.offsetTop;
        const body = document.documentElement;
        limit.maxX = s.MAX_X = body.clientWidth - el.offsetWidth;
        limit.maxY = s.MAX_Y = body.clientHeight - el.offsetHeight;
        el.style.left = "0px";
        el.style.top = "0px";
        this.status = "static";
        this._updateEl(s.x, s.y);
        return this;
    }
    _updateEl(x, y) {
        this._el.style[prefix] = "translate(" + x + "px," + y + 'px)';
        return this;
    }
    _move(animations, resolve) {
        const fpsTime = 1000 / this._moveStatus.FPS;
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
        const limit = params.limit;
        let endSpeed = params.speed - params.frictionSpeed / params.FPS;
        if (endSpeed <= 0) {
            endSpeed = 0;
            return;
        };
        const averageSpeed = (params.speed + endSpeed) / 2;
        params.speed = endSpeed;
        if (params.x >= limit.maxX) {
            params.x = limit.maxX;
            if (angle > 270) {
                params.moveAngle = 180 - params.moveAngle;
            } else {
                params.moveAngle = 180 - params.moveAngle;
            }
        }
        if (params.x <= limit.minX) {
            params.x = limit.minX;
            if (angle > 180) {
                params.moveAngle = 180 - params.moveAngle;
            } else {
                params.moveAngle = 180 - params.moveAngle;
            }
        }
        if (params.y >= limit.maxY) {
            params.y = limit.maxY;
            if (angle > 270) {
                params.moveAngle = 360 - params.moveAngle;
            } else {
                params.moveAngle = 360 - params.moveAngle;
            }
        }
        if (params.y <= limit.minY) {
            params.y = limit.minY;
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
        const limit = params.limit;
        const pai = 0.017453293;
        const distance = speed / params.FPS;
        const y = -distance * Math.sin(angle * pai);
        const x = distance * Math.cos(angle * pai);
        params.x += x;
        params.y += y;
        params.x = params.x < limit.minX ? limit.minX : params.x;
        params.y = params.y < limit.minY ? limit.minY : params.y;
        params.x = params.x > limit.maxX ? limit.maxX : params.x;
        params.y = params.y > limit.maxY ? limit.maxY : params.y;
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