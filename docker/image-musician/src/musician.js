const dgram = require('dgram');
const uuid = require('uuid');

const PORT = 1234;
const MULTICAST_ADDRESS = '239.255.22.5';

const socket = dgram.createSocket('udp4');

var arguments = process.argv[2];
var payload = {
    uuid: uuid.v1(),
    sound: "vide"
};

var play = function() {
    const message = new Buffer(JSON.stringify(payload));
    socket.send(message, 0, message.length, PORT, MULTICAST_ADDRESS,
    function(err, bytes) {
        console.log("Sending payload: " + message + " via port " + socket.address().port);
    });
}

switch(arguments){
    case "piano":
        payload.sound = "ti-ta-ti";
        break;
    case "trumpet":
        payload.sound = "pouet";
        break;
    case "flute":
        payload.sound = "trulu";
        break;
    case "violin":
        payload.sound = "gzi-gzi";
        break;
    case "drum":
        payload.sound = "boum-boum";
        break;
    default:
        console.log("Instrument non-existant");
        return;
        break;
}

setInterval(play, 1000);
