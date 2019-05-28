//"houndify" module contains both client-side ("HoundifyClient") and server-side ("HoundifyExpress") parts of SDK
var Houndify = require('houndify');
var wav = require('wav');
var fs = require('fs');
var path = require('path');

//parse arguments
var argv = require('minimist')(process.argv.slice(2));

//config file
var configFile = argv.config || 'config.json';
var config = require(path.join(__dirname, configFile));


// Convert WAV to Speex and stream it to Houndify backend
function compressAndStreamWAV() {
  var voiceRequest;
  var reader = new wav.Reader();

  reader.on('format', function (format) {
    voiceRequest = new Houndify.VoiceRequest({
      clientId:  config.clientId, 
      clientKey: config.clientKey,

      sampleRate: format.sampleRate,
      enableVAD: true,

      //REQUEST INFO JSON
      //see https://houndify.com/reference/RequestInfo
      requestInfo: {
        UserID: "test_user",
        Latitude: 37.388309, 
        Longitude: -121.973968
      },

      onResponse: function(response, info) {
        console.log(response);
      },

      onTranscriptionUpdate: function(trObj) {
        console.log("Partial Transcript:", trObj.PartialTranscript);
      },

      onError: function(err, info) {
        console.log(err);
      }
      
    });
  });

  reader.on('data', function (chunk) {
    var arrayBuffer = new Uint8Array(chunk).buffer;
    var view = new Int16Array(arrayBuffer);
    voiceRequest.write(view);
  });

  reader.on('end', function() { 
    voiceRequest.end(); 
  });

  file.pipe(reader);
}


// Stream full WAV/Opus/Speex audio file to Houndify backend
function streamAudioFile(file) {
  var voiceRequest = new Houndify.VoiceRequest({
      clientId:  config.clientId, 
      clientKey: config.clientKey,

      convertAudioToSpeex: false,
      enableVAD: true,

      //REQUEST INFO JSON
      //see https://houndify.com/reference/RequestInfo
      requestInfo: {
        UserID: "test_user",
        Latitude: 37.388309, 
        Longitude: -121.973968
      },

      onResponse: function(response, info) {
        console.log(response);
      },

      onTranscriptionUpdate: function(trObj) {
        console.log("Partial Transcript:", trObj.PartialTranscript);
      },

      onError: function(err, info) {
        console.log(err);
      }
  });

  file.on('data', function (chunk) {
    voiceRequest.write(chunk);
  });

  file.on('end', function() { 
    voiceRequest.end(); 
  });
}



var audioFile = argv.audio || path.join('test_audio', 'whatistheweatherthere.wav');
var audioFilePath = path.join(__dirname, audioFile);
var file = fs.createReadStream(audioFilePath);


if (audioFile.endsWith(".wav") || audioFile.endsWith(".wave")) {
  compressAndStreamWAV(file);
} 
else {
  streamAudioFile(file);
}


