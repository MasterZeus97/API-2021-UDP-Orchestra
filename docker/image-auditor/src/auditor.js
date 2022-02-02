const dgram = require('dgram');
const uuid = require('uuid');
const net = require('net');

const PORT_TCP = 2205;
const PORT_UDP = 1234;
const MULTICAST_ADDRESS = '239.255.22.5';

const socket = dgram.createSocket('udp4');
socket.bind(PORT_UDP, function() {
    console.log("Joining multicast group");
    socket.addMembership(MULTICAST_ADDRESS);
});

var activeMusicians = [];
var timeouts = [];
var exists = false;

// This call back is invoked when a new datagram has arrived.
socket.on('message', function(msg, source) {
    var object = JSON.parse(msg);
    for(var i = 0; i < activeMusicians.length; i++){
        if(activeMusicians[i].uuid.toString() == object.uuid){
            clearTimeout(timeouts[i]);
            timeouts[i] = setTimeout(inactiveInstr, 5000, activeMusicians[i].uuid.toString());
            exists = true;
        }
    };

    if(exists){
        exists = false;
    }
    else{
        activeMusicians.push({
            uuid: object.uuid,
            instrument: object.sound,
            activeSince: (new Date()).toJSON()
        });
        timeouts.push(setTimeout(inactiveInstr, 5000, object.uuid.toString()))
    }
});

var inactiveInstr = function(uuid){
    for(var i = 0; i < activeMusicians.length; i++){
        if(activeMusicians[i].uuid.toString() == uuid){
            activeMusicians.splice(i, 1);
            timeouts.splice(i, 1);
        }
    };
}

var server = net.createServer(function(socket) {
	socket.write(JSON.stringify(activeMusicians) + '\r\n');
	socket.pipe(socket);
});

server.listen(PORT_TCP, '127.0.0.1');
