import * as THREE from 'three';
import Anime from 'animejs';
import * as dat from 'dat.gui';

// Packages
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// Utils
import getNDCCoordinates from './utils/mouse';

// Components
import scrollTimeline from './components/scrollTimeline.js';

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
    const components = createComponents(scene);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = false;

    function buildScene() {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color("#fff");
        
        const light = new THREE.AmbientLight( 0xeeeeee );
        scene.add( light );
        
        return scene;
    }

    function buildRender({ width, height }) {
        console.log(width)
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true }); 
        const DPR = (window.devicePixelRatio) ? window.devicePixelRatio : 1;
        renderer.setPixelRatio(DPR);
        renderer.setSize(width, height);

        return renderer;
    }

    function buildCamera({ width, height }) {
        
        const aspectRatio = width / height;
        const fieldOfView = 60;
        const nearPlane = 1;
        const farPlane = 100;
        const camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
        camera.position.set(0,0,1);
        camera.lookAt(new THREE.Vector2(0, 0));
        
        return camera;
    }

    function createComponents(scene) {
        const components = [
            // Inserts all components here
            new scrollTimeline(scene)
        ];

        return components;
    }

    this.update = function() {

        if (!started) return;

        const deltaTime = clock.getDelta();
        const elapsedTime = clock.getElapsedTime();
        
        controls.update();

        components.forEach(component => component.update(elapsedTime));
        
        renderer.render(scene, camera);
    }

    this.setStarted = function(value) {
        started = value;
    }

    this.helpers = function() {

        const gui = new dat.GUI();

        components.forEach(components => components.helpers(gui));

        const gridHelper = new THREE.GridHelper( 10, 10 );
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

    });

    function changeFloor(event) {
		
	}
    
    window.addEventListener('keyup', (e) => {
        
    })
}

export default Scene;