/**
 * Created by Alex Voronyansky <belirafon@gmail.com> 
 * Date: 26.04.2016
 * Time: 13:47
 */
"use strict";

const EventEmitter = require('events').EventEmitter;
const amiUtils = require('asterisk-ami-event-utils');
const AmiEventsStream = require('asterisk-ami-events-stream');

/**
 * Ami Connection
 */
class AmiConnection extends EventEmitter{

    constructor(socket){
        super();

        Object.assign(this, {
            _isEstablished: true,
            _socket: socket,
            _amiEventsStream: new AmiEventsStream()
        });

        this._socket
            .on('error', error => this.emit('error', error))
            .on('close', () => this.close());

        this._socket.pipe(this._amiEventsStream)
            .on('amiEvent', event => this.emit('event', event))
            .on('amiResponse', response => this.emit('response', response))
            .on('data', chunk => this.emit('data', chunk))
            .on('error', error => this.emit('error', error));
    }

    /**
     *
     * @returns {AmiConnection}
     */
    close(){
        this._isEstablished = false;
        this.emit('close');
        if(this._socket){
            this._socket.unpipe(this._amiEventsStream);
            this._socket
                .removeAllListeners('end')
                .removeAllListeners('close')
                .removeAllListeners('errorLog')
                .destroy();
        }
        return this;
    }

    /**
     *
     * @param message
     */
    write(message){
        let messageStr = typeof message === 'string' ?
            amiUtils.fromString(message) : amiUtils.fromObject(message);

        return this._socket.write(messageStr);
    }

    /**
     *
     * @returns {boolean}
     */
    get isEstablished(){
        return this._isEstablished;
    }
}

module.exports = AmiConnection;