/**
 * Created by Alex Voronyansky <belirafon@gmail.com>
 * Date: 26.04.2016
 * Time: 13:47
 */

"use strict";

const co  = require('co');
const net = require('net');
const AmiConnection = require('./AmiConnection');
const AmiAuthError = require('./errors/AmiAuthError');
const AmiEventsStream = require('asterisk-ami-events-stream');
const amiUtils = require('asterisk-ami-event-utils');
const debugLog = require('debug')('amiConnector');
const errorLog = require('debug')('amiConnector:errorLog');

/**
 *
 * @param login
 * @param password
 * @param connectionOptions
 * @returns {Promise}
 */
function createAmiConnection(login, password, connectionOptions){
    return new Promise((resolve, reject) => {
        let amiEvents = new AmiEventsStream(),
            authCommand = {
                Action: 'login',
                Username: login,
                Secret: password
            },
            amiSocket = net.connect(connectionOptions, () => {
                amiSocket
                    .pipe(amiEvents)
                    .on('amiEvent', event => {
                        if(event.Event === 'FullyBooted'){
                            amiSocket
                                .removeAllListeners('error')
                                .removeAllListeners('close')
                                .unpipe(amiEvents);
                            resolve(new AmiConnection(amiSocket));
                        }
                    })
                    .on('amiResponse', response => {
                        !response.Response === 'Success' && reject(new AmiAuthError(`AMI message: ${response.Message}`));
                    })
                    .on('error', reject)
                    .on('close', () => reject(new AmiAuthError('ami auth error')));

                amiSocket.write(amiUtils.fromObject(authCommand));
            });
    });
}

/**
 *
 * @param maxAttemptsCount
 * @param attemptsDelay
 * @returns {Function}
 */
function wrapper(maxAttemptsCount, attemptsDelay){
    return function(login, password, options){
        return co(function* (){
            let currAttemptIndex = 0;

            debugLog('connecting to asterisk ami...');
            while(maxAttemptsCount === null || ++currAttemptIndex <= maxAttemptsCount){
                try{
                    return yield createAmiConnection(login, password, options);

                }catch (error){
                    if(error instanceof AmiAuthError) throw error;

                    errorLog(error.message);
                    yield sleep(attemptsDelay);
                }

                if(maxAttemptsCount === null){
                    debugLog(`reconnecting to ami...`);

                }else{
                    debugLog(`[${currAttemptIndex} of ${maxAttemptsCount}] reconnecting...`);
                }
            }
            throw new AmiAuthError('Reconnection error after max count attempts.');
        });
    }
}

/**
 *
 * @param delay
 * @returns {Promise}
 */
function sleep(delay){
    return new Promise(resolve => setTimeout(resolve, delay));
}

module.exports = function(options){
    options = Object.assign({
        reconnect: false,
        maxAttemptsCount: null,
        attemptsDelay: 1000
    }, options || {});

    return {
        connect: !options.reconnect ? createAmiConnection : wrapper(options.maxAttemptsCount, options.attemptsDelay)
    };
};
