import * as THREE from 'three';
import Anime from 'animejs';

// Packages
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { InteractionManager } from "three.interactive";
import * as dat from 'dat.gui';
import VirtualScroll from 'virtual-scroll';

// Utils
import getNDCCoordinates from './utils/mouse';

// Components
import scrollTimeline from './components/scrollTimeline.js';
import tearCanvas from './components/tearCanvas.js';
import daftPunk from './components/daftPunk.js';
import LaboComponent from './components/Labo';

function Scene(canvas, started = false) {

    const clock = new THREE.Clock();
    
    let state = { floor: 0, currentFloor: 0 };

    let mouse = new THREE.Vector2(0, 0);

    const screenDimensions = {
        width: canvas.width,
        height: canvas.height
    }
    
    const scene = buildScene();
    let renderer = buildRender(screenDimensions);
    const camera = buildCamera(screenDimensions);

    const interactionManager = new InteractionManager(
        renderer,
        camera,
        renderer.domElement
    );

    let Y = 0;
    let lastEventY = 0;
    const scroller = new VirtualScroll({
        mouseMultiplier: 1
    });

    // Init all components
    const components = createComponents(scene);

    // const controls = new OrbitControls(camera, renderer.domElement);
    // controls.enableDamping = true;
    // controls.dampingFactor = 0.25;
    // controls.enableZoom = false;

    function buildScene() {
        const scene = new THREE.Scene();

        const skyColor = 0xB1E1FF;  // light blue
        const groundColor = 0xff0000;  // brownish orange
        const intensity = 1;
        const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
        scene.add(light);
        
        return scene;
    }

    function buildRender({ width, height }) {
        console.log(width)
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true }); 
        renderer.setClearColor(0x808080);
        const DPR = (window.devicePixelRatio) ? window.devicePixelRatio : 1;
        renderer.setPixelRatio(DPR);
        renderer.setSize(width, height);

        return renderer;
    }

    function buildCamera({ width, height }) {
        
        const aspectRatio = width / height;
        const fieldOfView = 60;
        const nearPlane = 0.01;
        const farPlane = 100; 
        const camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
        camera.position.set(0,0,-50);
        // camera.lookAt(new THREE.Vector2(0, 0));
        camera.lookAt(0,0,0);
        
        return camera;
    }

    function createComponents(scene) {
        const components = [
            // Inserts all components here
            // new scrollTimeline(scene, camera),
            // new tearCanvas(scene, camera)
            // new daftPunk(scene, camera),
            new LaboComponent(scene, camera, interactionManager),
        ];

        return components;
    }

    this.update = function() {

        if (!started) return;

        const deltaTime = clock.getDelta();
        const elapsedTime = clock.getElapsedTime();
        
        // controls.update();

        components.forEach(component => component.update(elapsedTime));
        
        renderer.render(scene, camera);
    }

    this.setStarted = function(value) {
        started = value;
    }

    this.helpers = function() {

        const gui = new dat.GUI();

        components.forEach(components => components.helpers(gui));

        const gridHelper = new THREE.GridHelper(10, 25);
        scene.add( gridHelper );
    }

    this.onWindowResize = function() {
        const { width, height } = canvas;

        screenDimensions.width = width;
        screenDimensions.height = height;

        renderer = buildRender(screenDimensions);
    }

    this.onMouseMove = function(event) {
        
    }

    /*
     * Interactions
    */
    window.addEventListener('keyup', (e) => {
        components.forEach(component => component.keyup(e));
    });
    
    window.addEventListener('keyup', (e) => {
        
    });

    scroller.on(event => {
        if (event.y < lastEventY) {
            Y++;
        } else {
            Y = Y > 0 ? Y - 1 : 0;
        }

        lastEventY = event.y;

        components.forEach(component => component.wheel(Y * 0.025));

        // Mutliply Y value
        // tlCamera.progress(Y * 0.025);

    });
}

export default Scene;