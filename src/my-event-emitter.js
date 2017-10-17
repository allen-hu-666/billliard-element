const { EventEmitter } = require('events');
class MyEventEmitter extends EventEmitter {
    emit() {
        return super.emit.apply(this,arguments);
    }
}
module.exports.MyEventEmitter = MyEventEmitter;