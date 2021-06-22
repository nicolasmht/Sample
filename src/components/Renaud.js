import * as THREE from 'three';
import { TimelineMax, Power4, TweenLite, Elastic, Bounce } from 'gsap';
import Player from './Player';

function Component(scene, camera) {

    // Video
    let video = document.querySelector('video');

    //  Vinyle
    let player = null;

    // Spacebar
    let spacebar = document.querySelector('.focus-renaud .spacebar');

    // Sounds
    let booba = new Howl({
        src: ['./renaud/sounds/booba.mp3'],
        volume: 0
    });

    let renaud = new Howl({
        src: ['./renaud/sounds/renaud.mp3'],
    });

    // Timeline
    let imgs = document.querySelectorAll(".focus-renaud img");

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
    timeline.fromTo(imgs[16], .4, {opacity: 0} ,{opacity: 1});
    timeline.fromTo(imgs[17], .4, {opacity: 0} ,{opacity: 1});

    // Variables
    let intervalID = null;
    let spaceDown = false;
    let spaceUp = false;
    let timer = 0;
    let currentImage = 0;
    let renaudPlayed = true;

    // Le temps de l'effet
    const DURATION = 50;
    let videoFrames = null;

    // Interval
    intervalID = setInterval(function() {

        if(spaceDown && timer < DURATION) {
            timer++ * .05;
            if(renaudPlayed) {
                renaudPlayed = false;
                player.playSound({title: 'Pitbull', date: '2006', artist: 'Booba'})
            }
        } else if(!spaceDown && timer > 0) {
            timer-- * .05;
            if(!renaudPlayed) {
                renaudPlayed = true;
                player.playSound({title: 'Mistral Gagnat', date: '1985', artist: 'Renaud'})
            }
        }

        if(spaceDown && currentImage < videoFrames.length -1) {
            videoFrames[currentImage].style.display = "block";
            currentImage++;
        } else if(!spaceDown && currentImage > 0) {
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

            spacebar.classList.add('holding');
            spaceDown = true;
            spaceUp = false;
        }
    });

    document.addEventListener('keyup', function(event) {
        if (event.code == 'Space') {
            spacebar.classList.remove('holding');
            spaceDown = false;
            spaceUp = true;
        }
    });

    let videoContainer = document.querySelector('#video');

    function createVideo(nb){

        return new Promise((resolve, reject) => {

            for(let i = 0; i < nb; i++) {
                let img = document.createElement('img');
                img.src = `./renaud/video/Animation${i < 10 ? '00' + i : '0' + i}.png`
                videoContainer.appendChild(img);
            }

            resolve();

        });
    }

    createVideo(100).then(() => { 
        videoFrames = document.querySelectorAll('#video img')
    });

    this.update = function(time) {}

    this.helpers = (gui) => {}

    this.wheel = function(Y) {}

    this.keyup = function(e) {}

    this.mousemove = function(e) {}

    this.start = function() {

        player = new Player();
        player.playSound({title: 'Mistral Gagnat', date: '1985', artist: 'Renaud'})

        setTimeout(() => {
            spacebar.classList.add('show');
        }, 4000);

        renaud.play();
        booba.play();
    }

    this.stop = function() {

        player?.toggle(false);

        renaud.stop();
        booba.stop();
    }
}

export default Component;