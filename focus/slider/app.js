var sound01 = new Howl({
    src: ['sound01.mp3'],
    loop: true
});

var sound02 = new Howl({
    src: ['sound02.mp3'],
    sprite: {
        sample: [36000, 15000, true]
    }
});

sound02.play('sample');
sound01.play();

let range = document.querySelector("input");
range.addEventListener("input", fadeMusic);

function fadeMusic() {
    sound02.volume( (range.value)/100);
    sound01.volume((100 - range.value)/100);
}


