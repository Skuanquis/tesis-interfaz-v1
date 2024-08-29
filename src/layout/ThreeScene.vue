<script setup>
import { onMounted, ref } from 'vue';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const threeContainer = ref(null);

onMounted(() => {
    // Escena, cámara, renderizador
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.5, 1000);
    const renderer = new THREE.WebGLRenderer();
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(20, 5, 5);
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    renderer.setSize(window.innerWidth, window.innerHeight);
    threeContainer.value.appendChild(renderer.domElement);

    const loader = new GLTFLoader();
    let model, silla;

    loader.load(
        '/models/modelo1.glb',
        function (gltf) {
            model = gltf.scene;
            model.rotation.y = 1.55556666;
            model.rotation.z = 0;
            model.rotation.x = 0.05;
            scene.add(model);

            // Cargar la silla
            loader.load(
                '/models/mod2.glb',
                function (gltf) {
                    silla = gltf.scene;
                    silla.position.set(-0.2555, 2.3555666, -3.6666);  // Establece la posición deseada en la escena
                    silla.scale.set(1.5, 1.5, 4);

                    // Rotar la silla 180 grados en el eje Y
                    silla.rotation.y = Math.PI;  // 180 grados en radianes es igual a Math.PI

                    scene.add(silla);
                    console.log("La silla se cargó con éxito y se rotó 180°");
                },
                undefined,
                function (error) {
                    console.error('Error al cargar la silla:', error);
                }
            );
        },
        undefined,
        function (error) {
            console.error('Error al cargar el modelo principal:', error);
        }
    );

    // Configurar la posición de la cámara
    camera.position.set(-0.2555, 3.3555666, 0.6666);

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }

    animate();

    // Manejar redimensionado de ventana
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
});
</script>

<style scoped>
.three-container {
    width: 100%;
    height: 100%;
    position: relative;
}
</style>

<template>
    <div ref="threeContainer" class="three-container"></div>
</template>
