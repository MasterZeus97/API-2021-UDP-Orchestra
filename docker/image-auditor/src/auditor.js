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
        var instrument;
        switch(object.sound){
            case "ti-ta-ti":
                instrument = "piano";
                break;
            case "pouet":
                instrument = "trumpet";
                break;
            case "trulu":
                instrument = "flute";
                break;
            case "gzi-gzi":
                instrument = "violin";
                break;
            case "boum-boum":
                instrument = "drum";
                break;
            default:
                console.log("Instrument non-existant");
                return;
        }

        activeMusicians.push({
            uuid: object.uuid,
            instrument: instrument,
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

var server = net.createServer();
server.on('connection', function(conn){
    conn.write(JSON.stringify(activeMusicians));
    conn.end();
});
server.listen(PORT_TCP);
