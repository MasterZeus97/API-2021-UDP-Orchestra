const dgram = require('dgram');
const {v4 :uuidv4} = require('uuid');

const PORT = 1234;
const MULTICAST_ADDRESS = '239.255.22.5';

const socket = dgram.createSocket('udp4');

var arguments = process.argv[2];
var payload = {
    uuid: uuidv4(),
    sound: "vide"
};

var play = function() {
    message = new Buffer.from(JSON.stringify(payload));
    socket.send(message, 0, message.length, PORT, MULTICAST_ADDRESS,
    function() {
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
}

setInterval(play, 1000);
