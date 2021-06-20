import * as THREE from 'three';
import Anime from 'animejs';
import { EffectComposer, EffectPass, RenderPass, BlendFunction, TextureEffect, NoiseTexture } from "postprocessing";

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
import KaleidoscopeComponent from './components/Kaleidoscope';
import RenaudComponent from './components/Renaud';

import NoiseEffect from './noiseEffect';
import OutlineEffect from './outlineEffect';
import TextureGravure from './textures/textures_gravure/test.png';

import KaleidoShader from './components/KaleidoShader';

function Scene(canvas, started = false) {

    const clock = new THREE.Clock();
    
    let state = { floor: 0, currentFloor: 0 };

    let mouse = new THREE.Vector2(0, 0);

    let gui = new dat.GUI({ autoPlace: false });

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

    /*
     * POST PROCESSING
     */

    let noise = { value: 0.05 };
    const noiseFolder = gui.addFolder('Noise');

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    composer.setSize(window.innerWidth, window.innerHeight);

    // NOISE
    const noiseEffect = new NoiseEffect({
        noise: noise.value
    });

    composer.addPass(new EffectPass(camera, noiseEffect));

    noiseFolder.add(noise, "value").onChange(function(v) {
        noiseEffect.uniforms.get('noise').value = v;
    });

    const outlineEffect = new OutlineEffect();
    composer.addPass(new EffectPass(camera, outlineEffect));

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

    // composer.addPass(new EffectPass(camera, new KaleidoShader()));

    let  textureLoader = new THREE.TextureLoader().load(TextureGravure, (t) => {
        // t.encoding = THREE.sRGBEncoding;
        t.wrapS = t.wrapT = THREE.RepeatWrapping;
    });

    const textureEffect = new TextureEffect({
        blendFunction: BlendFunction.EXCLUSION,
        texture: textureLoader,
        aspectCorrection: true,
        uvTransform: true,
        alpha: 0
    });

    composer.addPass(new EffectPass(camera, textureEffect));

    function buildScene() {
        const scene = new THREE.Scene();

        const skyColor = 0xB1E1FF;  // light blue
        const groundColor = 0xff0000;  // brownish orange
        const intensity = 0.01;
        const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
        scene.add(light);

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
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });

        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

        renderer.gammaOutput = true;


        renderer.setClearColor(0x808088,0);
        // renderer.setClearColor(0xDAAD9F);

        const DPR = (window.devicePixelRatio) ? window.devicePixelRatio : 1;
        renderer.setPixelRatio(DPR);
        // renderer.setPixelRatio(1);
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
            new LaboComponent(scene, camera, renderer, interactionManager),

            // new KaleidoscopeComponent(scene, camera, composer)
        ];

        return components;
    }

    this.update = function() {

        if (!started) return;

        const deltaTime = clock.getDelta();
        const elapsedTime = clock.getElapsedTime();
        
        // controls.update();

        components.forEach(component => component.update(elapsedTime));
        // renderer.render(scene, camera);
        composer.render(clock.getDelta());
    }

    this.setStarted = function(value) {
        started = value;
    }

    this.helpers = function() {

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

        components.forEach(component => component.wheel(Y * 0.01, event.y));
    });

}

export default Scene;