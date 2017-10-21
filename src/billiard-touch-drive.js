class BilliardTouchDrive {
    constructor(el) {
        this._el = el;
        this._x = 0;
        this._y = 0;
        this._history = [];
        this._ALLOW_HISTORY = 3;
    }
    init(moveStatus) {
        this._moveStatus = moveStatus;
        return this;
    }
    start(event) {
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
        let s = this._moveStatus;
        let limit = this._moveStatus.limit;
        s.x += changeX;
        s.y += changeY;
        s.x = s.x < limit.minX ? limit.minX : s.x;
        s.y = s.y < limit.minY ? limit.minY : s.y;
        s.x = s.x > limit.maxX ? limit.maxX : s.x;
        s.y = s.y > limit.maxY ? limit.maxY : s.y;
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
        let history = this._history;
        const allowHistory = this._ALLOW_HISTORY;
        if (history.length < allowHistory) {
            this._history = [];
            return false;
        };
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
        const pi = 3.1415926535898;
        let angle = Math.atan2(-changeY, changeX) * 180 / pi;
        if (angle < 0) angle = 360 + angle;
        this._history = [];
        return {
            speed: speed,
            angle: angle
        }
    }
}

BilliardTouchDrive.BilliardTouchDrive = BilliardTouchDrive;
module.exports = BilliardTouchDrive;