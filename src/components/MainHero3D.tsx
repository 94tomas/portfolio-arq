import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const MainHero3D: React.FC = () => {
    const [currentProject, setCurrentProject] = useState('monkey');

    const handleProjectClick = (project: string) => {
        setCurrentProject(project);
    };

    const cubeRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const currentModelRef = useRef<THREE.Group | null>(null);

    // Mapeo de proyectos a modelos
    const projectModelMap: Record<string, string> = {
        'monkey': '/models/monkey.glb',
        'cube': '/models/cube.glb',
        'cone': '/models/cone.glb',
        'cylinder': '/models/cylinder.glb'
    };

    // Efecto para inicializar la escena 3D
    useEffect(() => {
        if (cubeRef.current) {
            const scene = new THREE.Scene();
            sceneRef.current = scene;
            const container = cubeRef.current;
            const width = container.clientWidth;
            const height = container.clientHeight;
            const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer({alpha: true});
            renderer.setSize(width, height);
            container.appendChild(renderer.domElement);

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
            camera.position.y = 2;
            camera.position.z = 4;

            // controls
            const controls = new OrbitControls(camera, renderer.domElement);
            controls.minDistance = 2;
            controls.maxDistance = 10;

            function animate() {
                requestAnimationFrame(animate);
                controls.update();
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

    // Efecto para cargar/cambiar el modelo cuando cambia currentProject
    useEffect(() => {
        if (!sceneRef.current) return;

        const scene = sceneRef.current;
        const loader = new GLTFLoader();
        const modelPath = projectModelMap[currentProject] || projectModelMap['monkey'];

        // Remover el modelo anterior si existe
        if (currentModelRef.current) {
            scene.remove(currentModelRef.current);
            // Limpiar recursos del modelo anterior
            currentModelRef.current.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    child.geometry.dispose();
                    if (Array.isArray(child.material)) {
                        child.material.forEach((mat) => mat.dispose());
                    } else {
                        child.material.dispose();
                    }
                }
            });
            currentModelRef.current = null;
        }

        // Cargar el nuevo modelo
        loader.load(modelPath, (gltf) => {
            const model = gltf.scene;
            currentModelRef.current = model;
            scene.add(model);
            model.position.y = 0;
            model.position.x = 0;
            model.position.z = 0;
        }, undefined, (error) => {
            console.error(`Error loading ${currentProject} model`, error);
        });
    }, [currentProject]);
    return (
        <section id="hero" className='w-full h-screen relative'>

            <div ref={cubeRef} className='w-full h-full bg-gradient-to-b from-black to-transparent'></div>

            {/* menu lateral */}
            <div className='absolute z-50 top-0 left-0 w-80 md:w-96 h-full p-4 -translate-x-[calc(100%-12px)] hover:translate-x-0 transition-all duration-300 after:content-[""] after:absolute after:top-1/2 after:translate-y-[-50%] after:right-0 after:w-3 after:h-42 after:bg-primary after:rounded-r-lg after:z-[-1] after:cursor-pointer'>
                <div className='bg-white/10 backdrop-blur-sm px-10 py-12 rounded-lg flex flex-col justify-between h-full'>
                    <ul className='flex flex-col gap-6 uppercase'>
                        <li className='group/item'>
                            <span className={`block font-bold transition-all duration-300 ${currentProject === 'monkey' ? 'text-primary' : 'text-white/50'}`}>01</span>
                            <div onClick={() => handleProjectClick('monkey')} className={`text-3xl inline-block font-bold cursor-pointer group-hover/item:text-white group-hover/item:pl-2 transition-all duration-300 ${currentProject === 'monkey' ? 'text-white' : 'text-white/50'}`}>
                                Casa de campo
                            </div>
                        </li>
                        <li className='group/item'>
                            <span className={`block font-bold transition-all duration-300 ${currentProject === 'cube' ? 'text-primary' : 'text-white/50'}`}>02</span>
                            <div onClick={() => handleProjectClick('cube')} className={`text-3xl inline-block font-bold cursor-pointer group-hover/item:text-white group-hover/item:pl-2 transition-all duration-300 ${currentProject === 'cube' ? 'text-white' : 'text-white/50'}`}>
                                Edificio residencial
                            </div>
                        </li>
                        <li className='group/item'>
                            <span className={`block font-bold transition-all duration-300 ${currentProject === 'cone' ? 'text-primary' : 'text-white/50'}`}>03</span>
                            <div onClick={() => handleProjectClick('cone')} className={`text-3xl inline-block font-bold cursor-pointer group-hover/item:text-white group-hover/item:pl-2 transition-all duration-300 ${currentProject === 'cone' ? 'text-white' : 'text-white/50'}`}>
                                Casa de lujo
                            </div>
                        </li>
                        <li className='group/item'>
                            <span className={`block font-bold transition-all duration-300 ${currentProject === 'cylinder' ? 'text-primary' : 'text-white/50'}`}>04</span>
                            <div onClick={() => handleProjectClick('cylinder')} className={`text-3xl inline-block font-bold cursor-pointer group-hover/item:text-white group-hover/item:pl-2 transition-all duration-300 ${currentProject === 'cylinder' ? 'text-white' : 'text-white/50'}`}>
                                Edificio comercial
                            </div>
                        </li>
                    </ul>

                    <a href="#proyects" className='text-white bg-primary px-4 py-2 rounded-lg inline-block text-center'>
                        Ver más proyectos
                    </a>
                </div>
            </div>
            
        </section>
    );
};

export default MainHero3D;