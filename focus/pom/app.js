// Create and add sound on pin
function createSound(pin, sunset, sunshine) {

  // Sound 1 - volume on 0 for fade the song at the start
  let sunsetSound = new Howl({
      src: [sunset.path],
      volume: 0,
      sprite: {
        sample: [sunset.start ? sunset.start : 0, 30000]
      }
  });
  
  // Sound 2
  let sunshineSound = new Howl({
      src: [sunshine.path],
      volume: 0,
      sprite: {
        sample: [sunset.start ? sunset.start : 0, 30000]
      }
  });

  let isPlayed = false;

  // When the pin is hover by the mouse
  pin.addEventListener('mouseover', () => {

    // Play sound 1 if the sun is up
    if(sunIsUp && !isPlayed) {

      if(currentSound != sunshineSound)  turnTheDisc(sunshine);
      currentSound = sunshineSound;
      sunshineSound.play('sample');
      currentSound.fade(0, 1, 500);
      isPlayed = true;

    // Play sound 2 if the sun us down
    } else if(!sunIsUp && !isPlayed) {

      if(currentSound != sunsetSound)  turnTheDisc(sunset);
      currentSound = sunsetSound;
      sunsetSound.play('sample');
      currentSound.fade(0, 1, 500);
      isPlayed = true;

    }

  });

  // When the mouse leave the pin
  pin.addEventListener('mouseout', () => {

    isPlayed = false;
    currentSound.fade(1, 0, 1000);

    setTimeout(() => {
      currentSound.stop();
    }, 1000);
  });

}

// Animation

let sunIsUp = true;
let currentSound  = null;

let layer_1 = document.querySelector('#layer-1'), 
    layer_2 = document.querySelector('#layer-2'), 
    layer_3 = document.querySelector('#layer-3'), 
    layer_4 = document.querySelector('#layer-4'), 
    background = document.querySelector('#background'),
    sun = document.querySelector('#sun');

// Timeline for the colors effects
var tl = new TimelineMax({paused: true});
tl.to(layer_1.style, 4, {filter: 'contrast(1.19) brightness(0.82) saturate(0.96)'}, 0);
tl.to(layer_2.style, 4, {filter: 'contrast(1.19) brightness(0.82) saturate(0.96)'}, 0);
tl.to(layer_3.style, 4, {filter: 'contrast(1.19) brightness(0.82) saturate(0.96)'}, 0);
tl.to(layer_4.style, 4, {filter: 'contrast(1.19) brightness(0.82) saturate(0.96)'}, 0);
tl.to(sun, 4, {filter: 'contrast(1.19) brightness(0.82) saturate(0.96)'}, 0);
tl.to(background, 4,{opacity: 1}, 0);

// Create all sounds
let sireneSound = {path: './sounds/sirene/Nana_Sample.mp3', title: 'Nana', date: '2016', artist: 'Polo & Pan', start: 0};
let sireneSample = {path: './sounds/sirene/Os_Tincoas_Cordeiro_Nana_Original.mp3', title: 'Cordeiro De Nanã', date: '1977', artist: 'Os Tincoãs'};
createSound(document.querySelector('#sirene'), sireneSound, sireneSample);

let papillonSound = {path: './sounds/papillon/Zum-Zum_Original.mp3', title: 'Zoom zoom', date: '2017', artist: 'Polo & Pan'};
let papillonSample = {path: './sounds/papillon/Zoom-zoom-Sample.mp3', title: 'Zum-Zum', date: '1970', artist: 'Edu Lobo', start: timecodeToMilliseconds('0:02')};
createSound(document.querySelector('#papillon'), papillonSound, papillonSample);

let mainSound = {path: './sounds/main/Claire_de_lune_Original.mp3', title: 'Pays imaginaire', date: '2017', artist: 'Polo & Pan', start: timecodeToMilliseconds('0:29')};
let mainSample = {path: './sounds/main/Imaginaire_Sample.mp3', title: 'Clair de lune', date: '1903', artist: 'Claude Debussy', start: 125000};
createSound(document.querySelector('#main'), mainSound, mainSample);

let carnivoreSound = {path: './sounds/carnivore/Ani_Couni_Original.mp3', title: 'Ani Kuni', date: '2021', artist: 'Polo & Pan'};
let carnivoreSample = {path: './sounds/carnivore/Ani_kuni_Sample.mp3', title: 'Ani Kuni', date: '?', artist: 'Traditional Folk'};
createSound(document.querySelector('#carnivore'), mainSound, mainSample);


// Vinyle player
let discRotation = 0;
let last = 0;

function turnTheDisc(sound){

  // Animate the vinyle
  last = discRotation;
  discRotation += 360;
  let time = 0;
  let nameChange = false;

  let disc = document.querySelector('#disque');
  //disc.style.transform = `translate(-50%, 50%) rotateZ(${discRotation}deg)`;
  TweenMax.fromTo(disc.style, 1.5,{ transform: `translate(-50%, 50%) rotate(${last}deg)`}, { transform: `translate(-50%, 50%) rotate(${discRotation}deg)`, onUpdate:() => {
    time++;
    if(time > 25 && !nameChange) {

    console.log(time);
    nameChange = true;

    // Edit the title of vinyle
    let title = document.querySelector('#soundTitle');
    title.innerText = sound.title;

    // Edit the date of the vinyle
    let date = document.querySelector('#soundDate');
    date.innerText = sound.date;
    }

  }});
}


// Cursor animation
let cursor = document.querySelector('#cursor');

// When the mouse hover the sun
sun.addEventListener('mouseover', () => {
  cursor.classList.add('drag')
});

// When the mouse leave the sun
sun.addEventListener('mouseout', () => {
  cursor.classList.remove('drag')
});

// Classic cursor
document.addEventListener('mousemove', (e) => {

  cursor.style.left = e.pageX - 15 +'px';
  cursor.style.top = e.pageY - 15 +'px';
  //TweenMax.to(cursor, .0, {left: e.pageX -10, top: e.pageY - 10});
});


// Make the sun draggable
dragElement(sun);

function dragElement(elmnt) {

  let pos2 = 0, pos4 = 0;

  if (document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos2 = pos4 - e.clientY;
    pos4 = e.clientY;
    // set the element's new position:
    if((elmnt.offsetTop - pos2 < innerHeight/2 + elmnt.clientHeight/2 - elmnt.offsetHeight) && (elmnt.offsetTop - pos2 >  0)) {
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";

        let value = (elmnt.offsetTop / elmnt.offsetHeight);

        if(value > .5) {
          sunIsUp = false;
        } else {
          sunIsUp = true;
        }

        TweenMax.to(tl, .7, {progress: value});
    }
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

function updateDisplay(event) {
  pageX.innerText = event.pageX;
  pageY.innerText = event.pageY;
}

document.addEventListener("mousemove", parallaxEffect, false);

function parallaxEffect(event){

  let positions = {x: event.pageX, y: event.pageY}
  let background = document.querySelector('#layer-2');
  let flowers = document.querySelector('#layer-3');
  let fish = document.querySelector('#layer-4');

  TweenMax.to(background, 1, {transform: `translate3d(${-50 + positions.x * parallaxMer.x}%, ${-50 + positions.y * parallaxMer.y}%, 0px)`});
  TweenMax.to(flowers, 1, {transform: `translate3d(${-50 + positions.x * parallaxFlowers.x}%, ${-50 + positions.y * parallaxFlowers.y}%, 0px)`});
  TweenMax.to(fish, 1, {transform: `translate3d(${-50 + positions.x * parallaxFish.x}%, ${-50 + positions.y * parallaxFish.y}%, 0px)`});

}

// Variables
let parallaxFlowers = {x: -.0007, y: 0.0007};
let parallaxMer = {x: 0.006, y: 0.008};
let parallaxFish = {x: 0.006, y: 0.008};


// GUI
let gui = new dat.GUI();
gui.domElement.parentNode.style.zIndex = 200000;

let layer1 = gui.addFolder('Fleurs');
layer1.add(parallaxFlowers, 'x',  -.009, .009, .0001);
layer1.add(parallaxFlowers, 'y', -.009, .009, .0001);

let layer2 = gui.addFolder('Mer');
layer2.add(parallaxMer, 'x', -.009, .009, .0001);
layer2.add(parallaxMer, 'y', -.009, .009, .0001);

let layer3 = gui.addFolder('Poissons');
layer3.add(parallaxFish, 'x', -.009, .009, .0001);
layer3.add(parallaxFish, 'y', -.009, .009, .0001);

// Timecode to milliseconds
function timecodeToMilliseconds(timecode){

  let result = 0;

  timecode[0] < 1 ? true : result += (parseInt(timecode[0]) * 60) * 1000;
  result += parseInt(`${timecode[2]}${timecode[3]}`) * 1000;
  return result;
}