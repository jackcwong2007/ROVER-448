/*

    Note: if devices aren't showing up, ping them in 
    terminal and return the program

*/

const ping = require("ping"); 
const find = require('local-devices');
const hosts = [];

find().then(devices => { // find all devices on local network
    console.log(devices);
    /*
    [ devices is shown in this format:
    { name: '?', ip: '192.168.0.10', mac: '...' },
    { name: '...', ip: '192.168.0.17', mac: '...' },
    { name: '...', ip: '192.168.0.21', mac: '...' },
    { name: '...', ip: '192.168.0.22', mac: '...' }
    ]
    */
    devices.forEach((device) => {
        hosts.push(device['ip']);
    })

})

let pings = {}; 
hosts.forEach((host) =>{ //setting each host to a default value of -1 (offline)
    pings[host] = -1;
})

const cfg = {
  timeout: 5 // not sure what reasonable timeout is for rover applications
             // change if necessary
};

const checkPing = (host) => {
    hosts.forEach((host) => { // pings each host
            ping.promise.probe(host, cfg).then((res) => {
            // res.alive is boolean; res.time is the RTT (string ms) for the reply this run
            if (res.alive) {
                pings[host] = res.time;
            } else {
                pings[host] = -1;
            }
        });
    });
    console.log(pings);
}

setInterval(() => {checkPing(hosts)}, 1000);
