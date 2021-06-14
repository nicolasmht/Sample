// Video
let video = document.querySelector('video');

// Sounds
let booba = new Howl({
    src: ['./sounds/booba.mp3'],
    volume: 0
});

let renaud = new Howl({
    src: ['./sounds/renaud.mp3'],
});

renaud.play();
booba.play();

// Timeline
let imgs = document.querySelectorAll("img");

let timeline = new TimelineMax({paused: true});
timeline.fromTo(imgs[0], .4, {opacity: 0} ,{opacity: 1});
timeline.fromTo(imgs[1], .4, {opacity: 0} ,{opacity: 1});
timeline.fromTo(imgs[2], .4, {opacity: 0} ,{opacity: 1});
timeline.fromTo(imgs[3], .4, {opacity: 0} ,{opacity: 1});
timeline.fromTo(imgs[4], .4, {opacity: 0} ,{opacity: 1});
timeline.fromTo(imgs[5], .4, {opacity: 0} ,{opacity: 1});
timeline.fromTo(imgs[6], .4, {opacity: 0} ,{opacity: 1});
timeline.fromTo(imgs[7], .4, {opacity: 0} ,{opacity: 1});
timeline.fromTo(imgs[8], .4, {opacity: 0} ,{opacity: 1});
timeline.fromTo(imgs[9], .4, {opacity: 0} ,{opacity: 1});
timeline.fromTo(imgs[10], .4, {opacity: 0} ,{opacity: 1});
timeline.fromTo(imgs[11], .4, {opacity: 0} ,{opacity: 1});
timeline.fromTo(imgs[12], .4, {opacity: 0} ,{opacity: 1});
timeline.fromTo(imgs[13], .4, {opacity: 0} ,{opacity: 1});
timeline.fromTo(imgs[14], .4, {opacity: 0} ,{opacity: 1});
timeline.fromTo(imgs[15], .4, {opacity: 0} ,{opacity: 1});

// Variables
let intervalID = null;
let spaceDown = false;
let spaceUp = false;
let timer = 0;
let videoTimer = 0;
let currentImage = 0;

// Le temps de l'effet
const DURATION = 50;

// Interval
intervalID = setInterval(function() {

  let videoFrames = document.querySelectorAll('#video img');


    if(spaceDown && timer < DURATION) {
        timer++ * .05;
        videoFrames[currentImage].style.display = "block";
        currentImage++;
    } else if(!spaceDown && timer > 0) {
        timer-- * .05;
        videoFrames[currentImage].style.display = "none";
        currentImage--;
    }

    // Gestion des sons
    booba.volume((timer)/  DURATION);
    renaud.volume((DURATION - timer)/  DURATION);
    
    // Avancement de la timeline
    timeline.progress((timer/ DURATION));


}, 60);

document.addEventListener('keydown', function(event) {
  
  if (event.code == 'Space') {
    spaceDown = true;
    spaceUp = false;
  }
  
});

document.addEventListener('keyup', function(event) {

  if (event.code == 'Space') {
    spaceDown = false;
    spaceUp = true;
  }

});

let videoContainer = document.querySelector('#video');

function createVideo(nb){

  for(let i = 0; i < nb; i++) {

    let img = document.createElement('img');
    img.src=`./video/renaud${i < 10 ? '00' + i : '0' + i}.png`
    videoContainer.appendChild(img);
  }

}

createVideo(100);