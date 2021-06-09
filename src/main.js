import 'regenerator-runtime/runtime';
import * as THREE from 'three';
import Events from 'events';
const events = new Events();

import Scene from './scene';
import Scene02 from './scene02';

import Stats from 'stats-js';
const stats = new Stats();
// document.body.appendChild(stats.dom);

// Detect if developer mode is enabled
const isDev = (window.location.href.indexOf('#dev') > -1) ? true : false;

/*
* SCENE 02
*/
const canvas02 = document.querySelector(".canvas-02");
const scene02 = new Scene02(canvas02);
function resizeCanvas02() {
    canvas02.width = canvas02.style.width = window.innerWidth;
    canvas02.height = canvas02.style.height= window.innerHeight;

    scene02.onWindowResize();
}

function bindEventListeners() {
    window.addEventListener('resize', resizeCanvas02);
    resizeCanvas02();
    window.addEventListener('mousemove', scene02.onMouseMove);
}

function render02() {    
    scene02.update();   
    requestAnimationFrame(render02);
}

bindEventListeners();
render02();

// scene02.helpers();
scene02.setStarted(true);


/*
* SCENE 01
*/
const canvas01 = document.getElementById("canvas");
const scene01 = new Scene(canvas01, true, scene02.getScene());

function resizeCanvas01() {
    canvas01.width = canvas01.style.width = window.innerWidth;
    canvas01.height = canvas01.style.height= window.innerHeight;

    scene01.onWindowResize();
}

function bindEventListeners01() {
    window.addEventListener('resize', resizeCanvas01);
    resizeCanvas01();
    window.addEventListener('mousemove', scene01.onMouseMove);
}

function render01() {    
    scene01.update();
    requestAnimationFrame(render01);
}

bindEventListeners01();
render01();

scene01.helpers();
scene01.setStarted(true);