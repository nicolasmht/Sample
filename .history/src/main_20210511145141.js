import * as THREE from 'three';
import Events from 'events';
const events = new Events();

import Scene from './scene';

import Stats from 'stats-js';
const stats = new Stats();
document.body.appendChild( stats.dom );

const canvas = document.getElementById("canvas");

// Detect if developer mode is enabled
const isDev = (window.location.href.indexOf('#dev') > -1) ? true : false;

const scene = new Scene(canvas);

scene.setStarted(true);

function resizeCanvas() {
    canvas.style.width = '100%';
    canvas.style.height= '100%';
    
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    scene.onWindowResize();
}

function bindEventListeners() {
    window.addEventListener('resize', resizeCanvas);
    // resizeCanvas();
    
    window.addEventListener('mousemove', scene.onMouseMove);
}

function render() {    
    scene.update();   
    requestAnimationFrame(render);
}

bindEventListeners();
render();
scene.helpers();