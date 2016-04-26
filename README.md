# Asterisk AMI Connector for NodeJS (ES2015) 

This library is a part of **Asterisk's AMI Client** library, which will be release soon.

### Install 

```bash 
$ npm i asterisk-ami-connector
```

### NodeJS versions 

support `>=4.0.0`

### Usage

with promises

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

### Examples 

For examples, please, see `./examples/*` or tests `./test/*`.

### Tests 

comming soon. 

### License 

Licensed under the MIT License 
