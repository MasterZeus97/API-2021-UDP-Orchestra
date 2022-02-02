/*
 This program simulates a "data collection station", which joins a multicast
 group in order to receive measures published by thermometers (or other sensors).
 The measures are transported in json payloads with the following format:

   {"timestamp":1394656712850,"location":"kitchen","temperature":22.5}

 Usage: to start the station, use the following command in a terminal

   node station.js

*/

/*
 * We have defined the multicast address and port in a file, that can be imported both by
 * thermometer.js and station.js. The address and the port are part of our simple 
 * application-level protocol
 */
const protocol = require('./sensor-protocol');

/*
 * We use a standard Node.js module to work with UDP
 */
const dgram = require('dgram');


const moment = require('moment');

/* 
 * Let's create a datagram socket. We will use it to listen for datagrams published in the
 * multicast group by thermometers and containing measures
 */
const s = dgram.createSocket('udp4');
s.bind(protocol.PROTOCOL_PORT, function() {
  console.log("Joining multicast group");
  s.addMembership(protocol.PROTOCOL_MULTICAST_ADDRESS);
});

/* 
 * This call back is invoked when a new datagram has arrived.
 */

var tableMusicien = [];

s.on('message', function(msg, source) {

    msg = JSON.parse(msg);

    let addMusician = true;

    for(let i = 0; i < tableMusicien.length; i++){
        if(tableMusicien[i].uuid === msg.uuid){
            tableMusicien[i].lastCall = 0;
            addMusician = false;
        }
    }

    this.instrument = '';

    switch (msg.sound) {
        case 'ti-ta-ti':
            this.instument = 'piano';
            break;
        case 'pouet':
            this.instument = 'trumpet';
            break;
        case 'trulu':
            this.instument = 'flute';
            break;
        case 'gzi-gzi':
            this.instument = 'violin';
        case 'boum-boum':
            this.instument = 'drum';
    }

    if(addMusician){
        let musician = {
            uuid: msg.uuid,
            instrument: this.instrument,
            timestamp: moment()
        };

        tableMusicien.push(musician);
    }



    //var payload = JSON.stringify(sound);



	//console.log("Data has arrived: " + msg + ". Source port: " + source.port);
});

function checkPlaysingMusician(){

    let musicianDelete = [];

    for(let i = 0; i < tableMusicien.length; i++){
        if(tableMusicien[i].lastCall <= 5){
            tableMusicien[i].lastCall++;
        }else{
            musicianDelete.push(i);
        }
    }

    for(let i = 0; i < musicianDelete.length; i++){
        tableMusicien.splice(musicianDelete[i], 1);
    }

    console.log(tableMusicien);

    setTimeout(checkPlaysingMusician, 1000);
}

checkPlaysingMusician();