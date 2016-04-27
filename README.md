# Asterisk AMI Connector for NodeJS (ES2015) 

[![Code Climate](https://codeclimate.com/github/BelirafoN/asterisk-ami-connector/badges/gpa.svg)](https://codeclimate.com/github/BelirafoN/asterisk-ami-connector)
[![npm version](https://badge.fury.io/js/asterisk-ami-connector.svg)](https://badge.fury.io/js/asterisk-ami-connector)

This library is a part of **Asterisk's AMI Client** library, which will be release soon.

### Install 

```bash 
$ npm i asterisk-ami-connector
```

### NodeJS versions 

support `>=4.0.0`

### Usage

Base example with promises. 

```javascript
const connector = require('asterisk-ami-connector')({reconnect: true});

connector.connect('login', 'password', {host: '127.0.0.1', port: 5038})
    .then(amiConnection => {
        amiConnection
            .on('event', event  => {
                console.log(event);
                amiConnection.close();
            })
            .on('response', response  => console.log(response))
            .on('close', ()  => console.log('closed'))
            .on('error', error  => console.log(error));
    })
    .catch(error => console.log(error));
```

or using `co` for synchronous code style

```javascript
const connector = require('asterisk-ami-connector')({reconnect: true});
const co = require('co');

co(function*(){
    let amiConnection = yield connector.connect('login', 'password', {host: '127.0.0.1', port: 5038});
    
    amiConnection
        .on('event', event  => {
            console.log(event);
            amiConnection.close();
        })
        .on('response', response  => console.log(response))
        .on('close', ()  => console.log('closed'))
        .on('error', error  => console.log(error));
})
    .catch(error => console.log(error));
```

or with `co` like synchronous style

### Some details about module functionality 

#### Options of connection setup to Asterisk AMI:

* **reconnect** - default is `false`. Reconnection during connection setup.
* **maxAttemptsCount** - default is `null` (infinity). Max count of attempts of reconnection.
* **attemptsDelay** - default is 1000 (ms). Time delay between attempts of reconnection.

#### Method **connect** 

It takes the following parameters:

* **login** - Asterisks AMI login;
* **secret** - Asterisks AMI password;
* **options** - standard options for `net.connect` method.

It always returns *promise*. That promise will be resolved 
with instance of *AmiConnection*, or will be reject with *AmiAuthError*.

####  Class AmiConnection 

It is a class-wrapper for Asterisk's AMI socket, which was inherit from EventEmitter.

Available methods & props:

* **.close()** - close current Asterisk AMI connection;
* **.write(message)** - write message into current Asterisk's AMI socket;
* **.isEstablished** - `true` when connection to Asterisk AMI established;

Available events:

* **event** - it fires when AMI event was received. Handler receives AMI event object.
* **response** - it fires when AMI response was received. Handler receives AMI response object.
* **close** - it fires when AMI connection was closed.
* **error** - it fires when error occurred. Handler receives error.
* **data** - it fires when data was received from AMI socket. Handler receives buffer of received data. 

#### Class AmiAuthError

It class of Asterisk AMI auth-errors, which was inherit from Error.

### Debugging

Use env-variable `DEBUG=*` for print to console of steps of connection establishment.

### Examples 

For examples, please, see `./examples/*` or tests `./test/*`.

### Tests 

comming soon. 

### License 

Licensed under the MIT License 
