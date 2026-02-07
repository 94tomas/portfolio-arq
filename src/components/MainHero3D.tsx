import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const MainHero3D: React.FC = () => {
    const [currentProject, setCurrentProject] = useState('casadeluxo');
    const [isLoading, setIsLoading] = useState(true);

    const handleProjectClick = (project: string) => {
        setCurrentProject(project);
    };

    const cubeRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const currentModelRef = useRef<THREE.Group | null>(null);

    // Mapeo de proyectos a modelos
    const projectModelMap: Record<string, string> = {
        'casadeluxo': '/models/casadeluxo.glb',
        'casaconcubiertasinclinadas': '/models/casaconcubiertasinclinadas.glb'
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
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            container.appendChild(renderer.domElement);

            // Iluminación ambiente (iluminación base suave)
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
            scene.add(ambientLight);

            // Luz principal (key light) - iluminación principal desde arriba y delante
            const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
            mainLight.position.set(-5, 10, 5);
            mainLight.castShadow = true;
            scene.add(mainLight);

            // Luz de relleno (fill light) - iluminación suave desde el lado opuesto
            const fillLight = new THREE.DirectionalLight(0xffffff, 0.6);
            fillLight.position.set(5, 5, -5);
            scene.add(fillLight);

            // Luz de borde (rim light) - para destacar los bordes del modelo
            const rimLight = new THREE.DirectionalLight(0xffffff, 0.4);
            rimLight.position.set(0, 3, -8);
            scene.add(rimLight);

            // Plano base para los modelos
            const planeGeometry = new THREE.PlaneGeometry(100, 100);
            const planeMaterial = new THREE.MeshStandardMaterial({
                color: 0x1a1a1a,
                metalness: 0.1,
                roughness: 0.8,
                emissive: 0x000000,
                emissiveIntensity: 0
            });
            const plane = new THREE.Mesh(planeGeometry, planeMaterial);
            plane.rotation.x = -Math.PI / 2; // Rotar para que quede horizontal
            plane.position.y = -0.1; // Posicionar ligeramente por debajo del origen
            plane.receiveShadow = true; // Recibir sombras
            scene.add(plane);

            camera.position.x = -18;
            camera.position.y = 10;
            camera.position.z = 25;

            // controls
            const controls = new OrbitControls(camera, renderer.domElement);
            // controls.minDistance = 2;
            // controls.maxDistance = 10;

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

        // Iniciar loading
        setIsLoading(true);

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
        loader.load(
            modelPath, 
            (gltf) => {
                const model = gltf.scene;
                currentModelRef.current = model;
                scene.add(model);
                model.position.y = 0;
                model.position.x = 0;
                model.position.z = 0;
                setIsLoading(false);
            }, 
            (progress) => {
                // Opcional: puedes usar progress para mostrar porcentaje
                // console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%');
            }, 
            (error) => {
                console.error(`Error loading ${currentProject} model`, error);
                setIsLoading(false);
            }
        );
    }, [currentProject]);
    return (
        <section id="hero" className='w-full h-screen relative'>

            <div ref={cubeRef} className='w-full h-full bg-gradient-to-b from-gray-500 to-transparent'></div>

            {/* Loading overlay */}
            {isLoading && (
                <div className='fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md'>
                    <div className='flex flex-col items-center gap-6'>
                        {/* Animación de construcción arquitectónica - Edificio escalonado */}
                        <div className='relative w-32 h-40 flex items-end justify-center'>
                            {/* Base del edificio */}
                            <div className='relative w-20 h-20 border-2 border-primary/50 rounded-t-lg bg-primary/10 overflow-hidden'>
                                <div 
                                    className='absolute bottom-0 left-0 w-full bg-primary/40 rounded-t-lg transition-all duration-500'
                                    style={{
                                        animation: 'build 1.5s ease-in-out infinite',
                                        height: '0%'
                                    }}
                                ></div>
                            </div>
                            {/* Piso 2 */}
                            <div className='absolute bottom-20 left-1/2 -translate-x-1/2 w-16 h-16 border-2 border-primary/50 rounded-t-lg bg-primary/10 overflow-hidden'>
                                <div 
                                    className='absolute bottom-0 left-0 w-full bg-primary/40 rounded-t-lg transition-all duration-500'
                                    style={{
                                        animation: 'build 1.5s ease-in-out 0.3s infinite',
                                        height: '0%'
                                    }}
                                ></div>
                            </div>
                            {/* Piso 3 */}
                            <div className='absolute bottom-32 left-1/2 -translate-x-1/2 w-12 h-12 border-2 border-primary/50 rounded-t-lg bg-primary/10 overflow-hidden'>
                                <div 
                                    className='absolute bottom-0 left-0 w-full bg-primary/40 rounded-t-lg transition-all duration-500'
                                    style={{
                                        animation: 'build 1.5s ease-in-out 0.6s infinite',
                                        height: '0%'
                                    }}
                                ></div>
                            </div>
                            {/* Techo */}
                            <div className='absolute bottom-40 left-1/2 -translate-x-1/2 w-8 h-4 border-2 border-primary/50 rounded-t-lg bg-primary/10 overflow-hidden'>
                                <div 
                                    className='absolute bottom-0 left-0 w-full bg-primary/40 rounded-t-lg transition-all duration-500'
                                    style={{
                                        animation: 'build 1.5s ease-in-out 0.9s infinite',
                                        height: '0%'
                                    }}
                                ></div>
                            </div>
                        </div>
                        {/* Texto de carga */}
                        <div className='text-center'>
                            <p className='text-white text-lg font-semibold mb-2'>Cargando modelo 3D</p>
                            <div className='flex gap-1 justify-center'>
                                <div className='w-2 h-2 bg-primary rounded-full animate-bounce' style={{ animationDelay: '0s' }}></div>
                                <div className='w-2 h-2 bg-primary rounded-full animate-bounce' style={{ animationDelay: '0.2s' }}></div>
                                <div className='w-2 h-2 bg-primary rounded-full animate-bounce' style={{ animationDelay: '0.4s' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* menu lateral */}
            <div className='absolute z-50 top-0 left-0 w-80 md:w-96 h-full p-4 -translate-x-[calc(100%-12px)] hover:translate-x-0 transition-all duration-300 after:content-[""] after:absolute after:top-1/2 after:translate-y-[-50%] after:right-0 after:w-3 after:h-42 after:bg-primary after:rounded-r-lg after:z-[-1] after:cursor-pointer'>
                <div className='bg-black/50 backdrop-blur-sm px-10 py-12 rounded-lg flex flex-col justify-between h-full'>
                    <ul className='flex flex-col gap-6 uppercase'>
                        <li className='group/item'>
                            <span className={`block font-bold transition-all duration-300 ${currentProject === 'casadeluxo' ? 'text-primary' : 'text-white/50'}`}>01</span>
                            <div onClick={() => handleProjectClick('casadeluxo')} className={`text-3xl inline-block font-bold cursor-pointer group-hover/item:text-white group-hover/item:pl-2 transition-all duration-300 ${currentProject === 'casadeluxo' ? 'text-white' : 'text-white/50'}`}>
                                Casa de lujo
                            </div>
                        </li>
                        <li className='group/item'>
                            <span className={`block font-bold transition-all duration-300 ${currentProject === 'casaconcubiertasinclinadas' ? 'text-primary' : 'text-white/50'}`}>02</span>
                            <div onClick={() => handleProjectClick('casaconcubiertasinclinadas')} className={`text-3xl inline-block font-bold cursor-pointer group-hover/item:text-white group-hover/item:pl-2 transition-all duration-300 ${currentProject === 'casaconcubiertasinclinadas' ? 'text-white' : 'text-white/50'}`}>
                                Casa moderna con cubiertas inclinadas
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