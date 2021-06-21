export default class SoundAnalyser {

    /**
        Implementation:

        var context = new (window.AudioContext || window.webkitAudioContext)(); // Création de l'instance
        var analyser = context.createAnalyser();
        var frequencyData = new Uint8Array(analyser.frequencyBinCount);

        let ambiantSound = new SoundAnalyser(context,sound.mp3, analyser)
     */

    constructor(context,url, analyser, callback) {
        this.context = context;
        this.url = url;
        this.analyser = analyser;
        this.gainNode = context.createGain();
        this.soundBuffer = null;

        this.callback = callback;

        // var frequencyDataLength = frequencyData.length-400;// - Aigue
        this.loadSound(this.url, this.onLoadSound.bind(this));

    }

    onError() {
        console.error('Une erreur est survenue lors du decodage du son');
    }

    onSuccess(buffer) {
        this.soundBuffer = buffer;
        this.source = this.context.createBufferSource(); // Creates a sound source
        this.source.buffer = this.soundBuffer; // Source to play
        this.source.connect(this.gainNode); //Connexion au enceinte
        this.gainNode.gain.value = 1;
        this.gainNode.connect(this.context.destination); //Connexion au enceinte
        this.source.connect(this.analyser); // relier a l'analyser sur une autre branche

        this.callback(this)
    }

    onLoadSound(data) {
       this.context.decodeAudioData(data, this.onSuccess.bind(this), this.onError.bind(this));
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

    stop() {
        this.gainNode.gain.value = 0;
        this.gainNode.disconnect(this.context.destination);//Deco
        // this.url = url;
        // this.loadSound(this.url, this.onLoadSound.bind(this));
    }
    play() {
        this.source.start(0);
    }
    upVolume() {
        this.gainNode.gain.value = 1;
    }

    // onStop() {
    //     this.gainNode.gain.value = 0;
    //     this.gainNode.disconnect(context.destination);//Deco
    // }
};