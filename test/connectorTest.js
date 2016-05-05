/**
 * Developer: BelirafoN
 * Date: 05.05.2016
 * Time: 11:26
 */

"use strict";

const AmiTestServer = require('asterisk-ami-test-server');
const connectorFactory = require('../lib/index');
const AmiConnection = require('../lib/AmiConnection');
const assert = require('assert');
const CRLF = '\r\n';

describe('Ami connector Internal functioanlity', function(){
    this.timeout(3000);

    let server = null,
        connector = null,
        serverOptions = {
            credentials: {
                username: 'test',
                secret: 'test'
            }
        },
        socketOptions = {
            host: '127.0.0.1',
            port: 5038
        },
        connectorOptions = {
            reconnect: false,
            maxAttemptsCount: null,
            attemptsDelay: 1000
        };

    beforeEach(done => {
        connector = connectorFactory(connectorOptions);
        server = new AmiTestServer(serverOptions);
        server.listen({port: socketOptions.port}).then(done);
    });

    afterEach(done => {
        if(server instanceof AmiTestServer){
            server.close();
            server.removeAllListeners();
            server = null;
        }
        connector = null;
        done();
    });

    it('Connect without reconnection & correct credentials', done => {
        connector.connect('test', 'test', socketOptions).then(() => done());
    });

    it('Connect without reconnection & invalid credentials', done => {
        connector.connect('username', 'secret', socketOptions)
            .catch(error => {
                assert.ok(error instanceof Error);
                assert.equal('ami message: authentication failed', error.message.toLowerCase());
                done();
            });
    });

    it('Connector returns instance of AmiConnection', done => {
        connector.connect('test', 'test', socketOptions).then(amiConnection => {
            assert.ok(amiConnection instanceof AmiConnection);
            done();
        });
    });

});