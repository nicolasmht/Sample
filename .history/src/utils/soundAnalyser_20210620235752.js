export default class Sound {

    /**
     * src        : path to mp3
     * bpm        : beat per minute
     * offsetTime : remove blank sound at start for beat calculation (in seconds)
     * callback   : ready callback
     * debug      : enable debug display
     */
    constructor(url) {
        var context = new (window.AudioContext || window.webkitAudioContext)(); // Création de l'instance
        var analyser = context.createAnalyser();
        var frequencyData = new Uint8Array(analyser.frequencyBinCount);
        var frequencyDataLength = frequencyData.length-400;// - aigue
        var width, height, rectWidth = null;
        var soundBuffer = null;
        var gainNode = context.createGain();

        function onLoadSound(data) {
            // console.log(data);
            context.decodeAudioData(data, onSuccess, onError);
          }
          function loadSound(url, callback) {
            var request = new XMLHttpRequest();
            request.open('GET', url, true);
            request.responseType = 'arraybuffer';
        
            request.onload = function() {
              callback(request.response)
            }
            request.send();
          }
          function onSuccess(buffer) {
            soundBuffer = buffer;
            var source = context.createBufferSource(); // creates a sound source
            source.buffer = soundBuffer; // source a jouer
            source.connect(gainNode); //Connexion au enceinte
            gainNode.gain.value = 1;
            gainNode.connect(context.destination); //Connexion au enceinte
            source.connect(analyser); // relier a l'analyser sur une autre branche
            source.start(0);
          }
          function onError() {
            console.error('Une erreur est survenue lors du decodage du son');
          }
        loadSound(url, onLoadSound);

    }
};