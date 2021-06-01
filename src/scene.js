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

function Scene(canvas, started = false, scene02) {

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

    /*
     * LIGHTS
     */
    const light = new THREE.DirectionalLight(0xFFFFFF, 1);
    light.position.set(10, 7, 5);
    light.castShadow = true;

    light.shadow.camera.near = 0.1;       // default
    light.shadow.camera.far = 350      // default
    light.shadow.mapSize.width = 256;  // default
    light.shadow.mapSize.height = 256;

    scene.add(light);

    function buildScene() {
        const scene = new THREE.Scene();

        const skyColor = 0xB1E1FF;  // light blue
        const groundColor = 0xff0000;  // brownish orange
        const intensity = 0.05;
        const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
        scene.add(light);

        const target = new THREE.Object3D();
        target.position.set(0, 0, 0);

        // const directionalLightLeft = new THREE.DirectionalLight(0xFFFFFF, 1);
        // const helper = new THREE.DirectionalLightHelper(directionalLightLeft, 5);
        // directionalLightLeft.position.set(10, 7, 5);
        // directionalLightLeft.target = target;

        // directionalLightLeft.castShadow = true;

        
        // const directionalLightRight = new THREE.DirectionalLight(0xffffff, 1);
        // directionalLightRight.position.set(-5, 5, 5);
        // directionalLightRight.target = target;

        // directionalLightLeft.castShadow = true;
        
        // scene.add(directionalLightLeft, helper);
        // scene.add(directionalLightLeft.target, directionalLightRight);
        
        return scene;
    }

    function buildRender({ width, height }) {
        console.log(width)
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true }); 

        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

        renderer.gammaOutput = true;

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
        
        return camera;
    }

    function createComponents(scene) {
        const components = [
            // Inserts all components here
            // new tearCanvas(scene, camera),
            // new daftPunk(scene, camera, interactionManager),
            new scrollTimeline(scene, camera),
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

        const gui = new dat.GUI({ autoPlace: false });
        document.querySelector('.gui').appendChild(gui.domElement);
        components.forEach(components => components.helpers(gui));

        const lightGUI = gui.addFolder('Light');
        lightGUI.add(light.position, 'x');
        lightGUI.add(light.position, 'y');
        lightGUI.add(light.position, 'z');
        lightGUI.add(light, 'intensity');

        lightGUI.add({ 'Shadow quality': 512 }, 'Shadow quality', [512, 1024, 2048, 4096, 8192]).onChange(value => {
            light.shadow.mapSize.width = value;
            light.shadow.mapSize.height = value;
            light.shadow.map.dispose();
            light.shadow.map = null;
        });

        const gridHelper = new THREE.GridHelper(10, 25);
        scene.add(gridHelper);
    }

    this.onWindowResize = function() {
        const { width, height } = canvas;

        screenDimensions.width = width;
        screenDimensions.height = height;

        renderer = buildRender(screenDimensions);
    }

    this.onMouseMove = function(event) {
        components.forEach(component => component.mousemove(event));
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
    });

}

export default Scene;