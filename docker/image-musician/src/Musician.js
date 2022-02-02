/*
 This program simulates a "smart" thermometer, which publishes the measured temperature
 on a multicast group. Other programs can join the group and receive the measures. The
 measures are transported in json payloads with the following format:

   {"timestamp":1394656712850,"location":"kitchen","temperature":22.5}

 Usage: to start a thermometer, type the following command in a terminal
        (of course, you can run several thermometers in parallel and observe that all
        measures are transmitted via the multicast group):

   node thermometer.js location temperature variation

*/

const {v4: uuidv4} = require('uuid');

var protocol = require('./sensor-protocol');


var uuid = uuidv4();
/*
 * We use a standard Node.js module to work with UDP
 */
var dgram = require('dgram');

/*
 * Let's create a datagram socket. We will use it to send our UDP datagrams 
 */
var s = dgram.createSocket('udp4');


/*
 *Let's define a javascript class for musician. 
 */
function Musician(instrument){
	this.instrument = instrument;

	Musician.prototype.update = function() {
		this.sound = '';
		switch (this.instrument) {
			case 'piano':
				this.sound = 'ti-ta-ti'
				break;
			case 'trumpet':
				this.sound = 'pouet';
				break;
			case 'flute':
				this.sound = 'trulu';
				break;
			case 'violin':
				this.sound = 'gzi-gzi';
				break;
			case 'drum':
				this.sound = 'boum-boum';
				break;
			default:
				console.log(`Instrument not known`);
		}

		var sound = {
			uuid: uuid,
			sound: this.sound
		};

		var payload = JSON.stringify(sound);

		message = new Buffer(payload);
		s.send(message, 0, message.length, protocol.PROTOCOL_PORT, protocol.PROTOCOL_MULTICAST_ADDRESS, function(err, bytes) {
			console.log("Sending payload: " + payload + " via port " + s.address().port);
		});

	}
	setInterval(this.update.bind(this), 1000);
}


/*
 * Let's get the thermometer properties from the command line attributes
 * Some error handling wouln't hurt here...
 */
var instrument = process.argv[2];
//var temp = parseInt(process.argv[3]);
//var variation = parseInt(process.argv[4]);

/*
 * Let's create a new thermoter - the regular publication of measures will
 * be initiated within the constructor
 */
var t1 = new Musician(instrument);
