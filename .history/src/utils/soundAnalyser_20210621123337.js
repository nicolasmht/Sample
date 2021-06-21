export default class SoundAnalyser {

    /**
        Implementation:

        var context = new (window.AudioContext || window.webkitAudioContext)(); // Création de l'instance
        var analyser = context.createAnalyser();
        var frequencyData = new Uint8Array(analyser.frequencyBinCount);

        let ambiantSound = new SoundAnalyser(context,sound.mp3, analyser)
     */

    constructor(context,url, analyser) {
        this.url = url;
        this.analyser = analyser;
        this.gainNode = context.createGain();
        this.soundBuffer = null;


        // var frequencyDataLength = frequencyData.length-400;// - Aigue
        var width, height, rectWidth = null;
        this.loadSound(this.url, this.onLoadSound);

    }

    onError() {
        console.error('Une erreur est survenue lors du decodage du son');
    }

    onSuccess(buffer) {
        this.soundBuffer = buffer;
        let source = context.createBufferSource(); // Creates a sound source
        source.buffer = soundBuffer; // Source to play
        source.connect(this.gainNode); //Connexion au enceinte
        this.gainNode.gain.value = 1;
        this.gainNode.connect(context.destination); //Connexion au enceinte
        source.connect(this.analyser); // relier a l'analyser sur une autre branche
        source.start(0);
    }

    onLoadSound(data) {
        context.decodeAudioData(data, this.onSuccess, this.onError);
    }

    loadSound(url, callback) {
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';

        request.onload = function() {
            callback(request.response)
        }
        request.send();
    }

    setUrl(url) {
        this.url = url;
        this.loadSound(this.url, this.onLoadSound);
    }

    onStop() {
        // gainNode.gain.value = 0;
        // gainNode.disconnect(context.destination);//Deco
    }
};