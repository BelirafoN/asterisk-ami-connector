/**
 * Created by Alex Voronyansky <belirafon@gmail.com> 
 * Date: 26.04.2016
 * Time: 13:47
 */
"use strict";

var EventEmitter = require('events').EventEmitter,
    AmiEventsStream = require('asterisk-ami-events-stream');

/**
 * Ami Connection
 */
class AmiConnection extends EventEmitter{

    constructor(socket){
        super();

        Object.assign(this, {
            _socket: socket,
            _amiEventsStream: new AmiEventsStream()
        });

        this._socket
            .on('end', () => this.emit('end'))
            .on('error', error => this.emit('error', error))
            .on('close', () => {
                this._socket.unpipe(this._amiEventsStream);
                this.emit('close');
            });

        this._socket
            .pipe(this._amiEventsStream)
            .on('amiEvent', event => this.emit('event', event))
            .on('amiResponse', response => this.emit('response', response))
            .on('data', chunk => this.emit('data', chunk));
    }

    /**
     *
     * @returns {AmiConnection}
     */
    close(){
        this.emit('close');
        if(this._socket){
            this._socket.unpipe(this._amiEventsStream);
            this._socket.end();
            this._socket
                .removeAllListeners('end')
                .removeAllListeners('close')
                .removeAllListeners('errorLog');
        }
        return this;
    }
}

module.exports = AmiConnection;