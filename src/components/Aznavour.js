import * as THREE from 'three';
import { TweenMax } from 'gsap/gsap-core';
import Player from './Player';

function Component(scene) {

    
    let player = null;
    let map = document.querySelector('#map');

let originals = document.querySelectorAll('.original')
let samples = document.querySelectorAll('.sample');

samples.forEach((sample) => {

    sample.addEventListener('mouseover', () => {
        sample.classList.add('played');
    });

    sample.addEventListener('mouseout', () => {
        sample.classList.remove('played')
    });

});

originals.forEach((original) => {

    original.addEventListener('mouseover', () => {
        original.classList.add('played');
    });

    original.addEventListener('mouseout', () => {
        original.classList.remove('played')
    });

});


    let ele = document.querySelector('#ct-map');

    ele.scrollLeft = window.innerWidth /2;
    ele.scrollTop = window.innerHeight /2;

    ele.style.cursor = 'grab';

    let pos = { top: 0, left: 0, x: 0, y: 0 };

    const mouseDownHandler = function(e) {
        ele.style.cursor = 'grabbing';
        ele.style.userSelect = 'none';

        pos = {
            left: ele.scrollLeft,
            top: ele.scrollTop,
            // Get the current mouse position
            x: e.clientX,
            y: e.clientY,
        };

        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    };

    const mouseMoveHandler = function(e) {
        // How far the mouse has been moved
        const dx = e.clientX - pos.x;
        const dy = e.clientY - pos.y;

        // Scroll the element
        TweenMax.to(ele, 1.2, {scrollTop: (pos.top - dy), scrollLeft: pos.left - dx});
    };

    const mouseUpHandler = function() {
        ele.style.cursor = 'grab';
        ele.style.removeProperty('user-select');

        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
    };

    // Attach the handler
    ele.addEventListener('mousedown', mouseDownHandler);

//Get the position of element from top of the page
function offsetTop(element, acc = 0) {
    if(element.offsetTop) {
        return offsetTop(element.offsetParent, acc + element.offsetTop)
    }
    return acc + element.offsetTop
}

function offsetLeft(element, acc = 0) {
    if(element.offsetLeft) {
        return offsetLeft(element.offsetParent, acc + element.offsetLeft)
    }
    return acc + element.offsetLeft
}

class Parallax {
    constructor(element) {
        this.element = element

        const ratios = element.dataset?.parallax.split('/');
        this.ratio = parseFloat(ratios[0]);
        this.ratioX = parseFloat(ratios[1]);

        this.onScroll = this.onScroll.bind(this)

        this.onIntersection = this.onIntersection.bind(this)
        this.elementY = offsetTop(this.element) + this.element.offsetHeight / 2
        this.elementX = offsetLeft(this.element) + this.element.offsetWidth / 2
        
        const observer = new IntersectionObserver(this.onIntersection)
        observer.observe(element)
        this.onScroll();
    }

    //Entries its IntersectionObserverEntry []
    onIntersection(entries) {
        for(const entry of entries) {
            if(entry.isIntersecting) {
                document.querySelector('#ct-map').addEventListener('scroll', this.onScroll)

                this.elementY = offsetTop(this.element) + this.element.offsetHeight / 2;
                this.elementX = offsetLeft(this.element) + this.element.offsetWidth / 2;

            } else {
                document.querySelector('#ct-map').removeEventListener('scroll', this.onScroll)
            }
        }
    }

    onScroll() {
        window.requestAnimationFrame(()=> {
            const screenY = document.querySelector('#ct-map').scrollTop + window.innerHeight / 2
            const screenX = document.querySelector('#ct-map').scrollLeft + window.innerWidth / 2

            const diffY = this.elementY - screenY;
            const diffX = this.elementX - screenX;

            this.element.style.setProperty("transform", `translate(${diffX * -1 * this.ratioX}px, ${diffY * -1 * this.ratio}px)`);
        });
    }

    static bind() {
        return Array.from(document.querySelectorAll('[data-parallax]')).map((element)=> {
            return new Parallax(element)
        })
    }
}

Parallax.bind()

let currentSound = null;

function createSound(element, newSound){


    let sound = new Howl({
        src: [newSound.path],
        volume: 0
    });

    element.addEventListener('mouseover', () => {

        if(currentSound === sound) return;

        sound.seek(0);
        player.playSound(newSound);
        sound.play();
        sound.fade(0, 1,1300);
        currentSound = sound;

    });

    element.addEventListener('mouseleave', () => {

        sound.once( 'fade', () => { sound.stop(); });
        sound.fade( sound.volume(), 0, 1000 );

        currentSound = null;
    });
    
}

    createSound(document.querySelector('#sound_01') , {
        path: './sounds/01_Aznavour_parce-que-tu-crois.mp3',
        title: 'Parce Que Tu Crois ',
        artist: 'Charles Aznavour',
        date: '1966'
    });

    createSound(document.querySelector('#sample_01') , {
        path: './sounds/01_Dr-Dre_whats-the-difference.mp3',
        title: `What's the Difference`,
        artist: 'Dr. Dre feat. Eminem and Xzibit',
        date: '1999'
    });

    createSound(document.querySelector('#sound_02') , {
        path: './sounds/02_Aznavour_comme-ils-disent.mp3',
        title: 'Comme ils disent',
        artist: 'Charles Aznavour',
        date: '1972'
    });

    createSound(document.querySelector('#sample_02') , {
        path: './sounds/02_Bad-balance_Goroda.mp3',
        title: `Города`,
        artist: 'Bad Balance',
        date: '2013'
    });

createSound(document.querySelector('#sound_03') , {
    path: './sounds/03_Aznavour_A-ma-fille.mp3',
    title: `A ma fille`,
    artist: 'Charles Aznavour',
    date: '1964'
});

createSound(document.querySelector('#sample_03') , {
    path: './sounds/03_Movimiento-original_En-reconocimiento.mp3',
    title: `En Reconocimiento`,
    artist: 'Movimiento Original',
    date: '2008'
});

createSound(document.querySelector('#sound_04') , {
    path: './sounds/04_Aznavour_she.mp3',
    title: `She`,
    artist: 'Charles Aznavour',
    date: '1974'
});

createSound(document.querySelector('#sample_04') , {
    path: './sounds/04_The-Cure_Hot-hot-hot.mp3',
    title: `Hot hot hot !!!`,
    artist: 'The Cure',
    date: '1987'
});

    this.start = function() {
        // Attach the handler
        player = new Player();
        ele.addEventListener('mousedown', mouseDownHandler);
    }

    this.stop = () => {
        player?.toggle(false);
        currentSound?.stop();
    }

    this.update = function(time) {}

    this.helpers = (gui) => {}

    this.wheel = function(Y) {}

    this.keyup = function(e) {}

    this.mousemove = function(e) {}

}

export default Component;