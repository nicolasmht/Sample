export default class SoundAnalyser {

    /**
        Implementation:

        var context = new (window.AudioContext || window.webkitAudioContext)(); // Création de l'instance
        var analyser = context.createAnalyser();
        var frequencyData = new Uint8Array(analyser.frequencyBinCount);

        let ambiantSound = new SoundAnalyser(context,sound.mp3, analyser)
     */

    constructor(context,url,analyser) {
        // var frequencyDataLength = frequencyData.length-400;// - Aigue
        var width, height, rectWidth = null;
        var soundBuffer = null;
        var gainNode = context.createGain();

        function onLoadSound(data) {
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
            this.source = context.createBufferSource(); // Creates a sound source
            source.buffer = soundBuffer; // Source to play
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

    onStop() {
        this.gainNode.gain.value = 0;
        this.gainNode.disconnect(context.destination);//Deco
    }
};