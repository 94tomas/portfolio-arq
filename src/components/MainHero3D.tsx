import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const MainHero3D: React.FC = () => {
    
    const cubeRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (cubeRef.current) {
            const scene = new THREE.Scene();
            const container = cubeRef.current;
            const width = container.clientWidth;
            const height = container.clientHeight;
            const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer({alpha: true});
            renderer.setSize(width, height);
            container.appendChild(renderer.domElement);

            // monkey /models/monkey.glb
            const loader = new GLTFLoader();
            loader.load('/models/model1.glb', (gltf) => {
                scene.add(gltf.scene);
                gltf.scene.position.y = 0;
                gltf.scene.position.x = 0;
                gltf.scene.position.z = 0;
            }, undefined, (error) => {
                console.error('Error loading monkey model', error);
            });

            // luz
            const light = new THREE.DirectionalLight(0xffffff, 5);
            light.position.set(-2, 2, 1);
            light.castShadow = true;
            scene.add(light);
            const light2 = new THREE.DirectionalLight(0xffffff, 10);
            light2.position.set(2, 2, -1);
            light2.castShadow = true;
            scene.add(light2);

            var grid = new THREE.GridHelper(100, 10);
            scene.add(grid);

            camera.position.x = -1.5;
            camera.position.y = 1;
            camera.position.z = 3;

            // controls
            const controls = new OrbitControls(camera, renderer.domElement);

            function animate() {
                requestAnimationFrame(animate);
                renderer.render(scene, camera);
            }
            animate();

            // Función para manejar el redimensionamiento
            function handleResize() {
                if (container) {
                    const newWidth = container.clientWidth;
                    const newHeight = container.clientHeight;
                    camera.aspect = newWidth / newHeight;
                    camera.updateProjectionMatrix();
                    renderer.setSize(newWidth, newHeight);
                }
            }

            // Agregar listener de resize
            window.addEventListener('resize', handleResize);

            // Cleanup: remover el listener cuando el componente se desmonte
            return () => {
                window.removeEventListener('resize', handleResize);
                if (container && renderer.domElement.parentNode) {
                    container.removeChild(renderer.domElement);
                }
                renderer.dispose();
            };
        }
    }, []);
    return (
        <section className='w-full h-screen relative'>

            <div ref={cubeRef} className='w-full h-full bg-gradient-to-b from-black to-transparent'></div>

            {/* menu lateral */}
            <div className='absolute top-0 left-0 w-1/5 h-full bg-white/10 backdrop-blur-sm'>
                <div className='p-12 flex flex-col justify-between h-full'>
                    <ul className='flex flex-col gap-4 uppercase'>
                        <li>
                            <span className='text-[#0976E2] block font-bold'>01</span>
                            <a href="#" className='text-white text-3xl'>
                                Casa de campo
                            </a>
                        </li>
                        <li>
                            <span className='text-[#0976E2] block font-bold'>02</span>
                            <a href="#" className='text-white/80 text-3xl'>
                                Edificio residencial
                            </a>
                        </li>
                        <li>
                            <span className='text-[#0976E2] block font-bold'>03</span>
                            <a href="#" className='text-white/80 text-3xl'>
                                Casa de lujo
                            </a>
                        </li>
                        <li>
                            <span className='text-[#0976E2] block font-bold'>04</span>
                            <a href="#" className='text-white/80 text-3xl'>
                                Edificio comercial
                            </a>
                        </li>
                    </ul>

                    <a href="#" className='text-white bg-[#0976E2] px-4 py-2 rounded-lg inline-block text-center'>
                        Ver más proyectos
                    </a>
                </div>
            </div>
            
        </section>
    );
};

export default MainHero3D;