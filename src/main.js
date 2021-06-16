import 'regenerator-runtime/runtime';
import * as THREE from 'three';
import Events from 'events';
const events = new Events();

import Scene from './scene';

import Stats from 'stats-js';
const stats = new Stats();
// document.body.appendChild(stats.dom);

// Detect if developer mode is enabled
const isDev = (window.location.href.indexOf('#dev') > -1) ? true : false;

if (isDev) {
    document.querySelector('.container-focus').classList.add('full');
}

/*
* SCENE 01
*/
const canvas = document.getElementById("canvas");
const scene = new Scene(canvas, true);

function resizeCanvas01() {
    canvas.width = canvas.style.width = window.innerWidth;
    canvas.height = canvas.style.height= window.innerHeight;

    scene.onWindowResize();
}

function bindEventListeners01() {
    window.addEventListener('resize', resizeCanvas01);
    resizeCanvas01();
    window.addEventListener('mousemove', scene.onMouseMove);
}

function render01() {    
    scene.update();
    requestAnimationFrame(render01);
}

bindEventListeners01();
render01();

scene.helpers();
scene.setStarted(true);