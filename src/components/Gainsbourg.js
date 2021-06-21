import * as THREE from 'three';

import ChopinPrelude from '../assets/gainsbourg/sounds/Chopin_Prelude.mp3';
import Jtm from '../assets/gainsbourg/sounds/jtm.mp3';

import Charlotte from '../assets/gainsbourg/sounds/charlotte.mp3';
import Aram from '../assets/gainsbourg/sounds/aram.mp3';

import Lemon from '../assets/gainsbourg/sounds/lemon.mp3';
import ChopinEtude from '../assets/gainsbourg/sounds/Chopin_Etude.mp3';

import GainsbourgTheInitials from '../assets/gainsbourg/sounds/bb.mp3';
import Dvorak from '../assets/gainsbourg/sounds/dvorak.mp3';

function Component(scene) {

    let tutorial = document.querySelector('.focus-gainsbourg .tuto');
    let canvas = document.getElementById('mask');
    var ctx = canvas.getContext('2d');

    // Create a radial gradient
    // The inner circle is at x=110, y=90, with radius=30
    // The outer circle is at x=100, y=100, with radius=70
    var gradient = ctx.createRadialGradient(210,60,10, 200,70,50);

    // Add three color stops
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(.9, 'rgba(0, 0, 0, .3)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, .6)');

    // Set the fill style and draw a rectangle
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, window.innerWidth , window.innerWidth * (window.innerWidth / window.innerHeight));

    // Définition des éléments draggables
    var draggableElements = document.getElementsByClassName("draggable");

    for (var i = 0; i < draggableElements.length; i++) {
        dragElement(draggableElements[i]);
    }

    function dragElement(elmnt) {
        var pos1 = 0,
            pos2 = 0,
            pos3 = 0,
            pos4 = 0;

        if (document.getElementById(elmnt.id + "header")) {
            document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
        } else {
            elmnt.onmousedown = dragMouseDown;
        }

        function dragMouseDown(e) {
            e = e || window.event;
            pos3 = parseInt(e.clientX);
            pos4 = parseInt(e.clientY);
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
            return false;
        }

        function elementDrag(e) {
            e = e || window.event;
            pos1 = pos3 - parseInt(e.clientX);
            pos2 = pos4 - parseInt(e.clientY);
            pos3 = parseInt(e.clientX);
            pos4 = parseInt(e.clientY);
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";

            // if(style.top )
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    function CreateSound(paper, stamp, _paperSound, _stampSound) {
        
        let paperSound = new Howl({
            src: [_paperSound.path],
            volume: 0,
            sprite: {
                sample: [_paperSound.start ? _paperSound.start : 0, 30000]
                }
        });

        let stampSound = new Howl({
            src: [_stampSound.path],
            volume: 0,
            sprite: {
                sample: [_stampSound.start ? _stampSound.start : 0, 30000]
                }
        });

        let isMouseover = false;

        paper.addEventListener('mouseover', function () {
            
            if (isMouseover || paperSoundStopped) return;

            paperSound.play('sample');
            paperSound.fade(0, 1, 700);
            isMouseover = true;
        });
        
        paper.addEventListener('mouseout', function () {

            // Stop the sound
            paperSound.once( 'fade', () => { paperSound.stop(); });
            paperSound.fade( paperSound.volume(), 0, 700 );
            isMouseover = false;

            if(paperSoundStopped) {
                stampSound.once( 'fade', () => { stampSound.stop(); });
                stampSound.fade( stampSound.volume(), 0, 700 );
            }
            
        });

        let isInitial = false,
            initialX = 0,
            initialY = 0;

        let paperSoundStopped = false,
            isActive = false;

        document.addEventListener('mousemove', function (e) {

            if (e.target !== paper && !isMouseover) return;

            if (!isInitial) {
                initialX = e.target.offsetLeft;
                initialY = e.target.offsetTop;
                isInitial = true;
            }
            
            const isVisible = detectCollision(stamp, paper);

            if (isVisible && !paperSoundStopped) {

                paperSound.once( 'fade', () => { paperSound.stop(); });
                paperSound.fade( paperSound.volume(), 0, 1000 );

                stampSound.play('sample');
                stampSound.fade(paperSound.volume(), 1, 1000);

                paperSoundStopped = true;  

            } else if (!isVisible && paperSoundStopped) {

                paperSound.play('sample');
                paperSound.fade(paperSound.volume(), 1, 1000);

                stampSound.once( 'fade', () => { stampSound.stop(); });
                stampSound.fade(paperSound.volume(), 0, 1000);

                paperSoundStopped = null;

            }
        });

    }

    function detectCollision(stamp, paper){

        let  rect1 = {x: stamp.offsetTop, y: stamp.offsetLeft, width: stamp.clientWidth, height: stamp.clientHeight}
        let rect2 = {x: paper.offsetTop, y: paper.offsetLeft, width: paper.clientWidth, height: paper.clientHeight}

        if (rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.height + rect1.y > rect2.y) {
            // collision détectée !
            return false;
        }

        return true;
    }


    // Init all sounds
    CreateSound(
        document.querySelector('.clopes'),
        document.querySelector('.dvorak'),
        { path: GainsbourgTheInitials, artist: 'Serge Gainsbourg', title: 'Initials BB', date: '1968'},
        { path: Dvorak, artist: 'Antonín Dvorák', title: 'Symphony No. 9, "From the New World"', date: '1893'},
    );

    CreateSound(
        document.querySelector('.lemon'),
        document.querySelector('.chopin'),
        {path: Lemon, artist: 'Serge Gainsbourg', title: 'Lemon incest', date: '1984'},
        {path: ChopinEtude, artist: 'Frédéric Chopin', title: 'Étude, Op. 10, No. 3 in E Major', date: '1830'},
    );

    CreateSound(
        document.querySelector('.charlotte'),
        document.querySelector('.aram'),
        {path: Charlotte, artist: 'Serge Gainsbourg', title: 'Charlotte for ever', date: '1986'},
        {path: Aram, artist: 'Aram Khatchatourian', title: 'Andantino', date: '1947'}
    );

    CreateSound(
        document.querySelector('.jtm'),
        document.querySelector('.polska'),
        {path: Jtm, artist: 'Serge Gainsbourg', title: `Je t'aime moi non plus`, date: '1969'},
        {path: ChopinPrelude, artist: 'Frédéric Chopin', title: `Prelude, Op. 28, No. 4 in E Minor`, date: '1839'}
    );
    
    // Timecode to milliseconds
    function timecodeToMilliseconds(timecode){
    
      let result = 0;
    
      timecode[0] < 1 ? true : result += (parseInt(timecode[0]) * 60) * 1000;
      result += parseInt(`${timecode[2]}${timecode[3]}`) * 1000;
      return result;
    }

    this.start = () => {

        setTimeout(() => {
            tutorial.classList.add('hide');
        }, 3000 );
    }
    this.stop = () => {

        setTimeout(() => {
            tutorial.classList.remove('hide');
        }, 3000 )
    }

    this.update = function(time) {}

    this.helpers = (gui) => {}

    this.wheel = function(Y) {}

    this.keyup = function(e) {}

    this.mousemove = function(e) {}

}

export default Component;