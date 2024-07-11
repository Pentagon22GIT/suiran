"use client";

import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Suspense, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

const MainBuilding1 = () => (
    <mesh position={[25, 18, -40]} castShadow receiveShadow>
        <boxGeometry args={[80, 36, 15]} />
        <meshStandardMaterial color="lightgrey" />
    </mesh>
);

const MainBuilding2 = () => (
    <mesh position={[25, 24, 10]} castShadow receiveShadow>
        <boxGeometry args={[80, 48, 15]} />
        <meshStandardMaterial color="lightgrey" />
    </mesh>
);

const MainBuilding3 = () => (
    <mesh position={[20, 18, 60]} castShadow receiveShadow>
        <boxGeometry args={[90, 36, 15]} />
        <meshStandardMaterial color="lightgrey" />
    </mesh>
);

const Sta1 = () => (
    <mesh position={[0, 24, 35]} castShadow receiveShadow>
        <boxGeometry args={[10, 24, 35]} />
        <meshStandardMaterial color="lightgrey" />
    </mesh>
);

const Sta2 = () => (
    <mesh position={[50, 18, 35]} castShadow receiveShadow>
        <boxGeometry args={[10, 12, 35]} />
        <meshStandardMaterial color="lightgrey" />
    </mesh>
);

const Sta3 = () => (
    <mesh position={[50, 18, -15]} castShadow receiveShadow>
        <boxGeometry args={[10, 12, 35]} />
        <meshStandardMaterial color="lightgrey" />
    </mesh>
);

const Ground = () => (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="lightgrey" />
    </mesh>
);

const App = () => {
    const initialCameraPosition = new THREE.Vector3(-140, 130, 110);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const controlsRef = useRef<any>(null);

    const handleResetCamera = () => {
        if (cameraRef.current && controlsRef.current) {
            gsap.to(cameraRef.current.position, {
                x: initialCameraPosition.x,
                y: initialCameraPosition.y,
                z: initialCameraPosition.z,
                duration: 2,
                onUpdate: () => {
                    if (cameraRef.current) {
                        cameraRef.current.lookAt(new THREE.Vector3(0, 0, 0));
                        controlsRef.current.update();
                    }
                }
            });
        }
    };

    return (
        <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
            <button
                onClick={handleResetCamera}
                style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    zIndex: 10,
                    padding: '10px 20px',
                    background: 'white',
                    border: '1px solid black',
                    borderRadius: '5px',
                    cursor: 'pointer'
                }}
            >
                Reset Camera
            </button>
            <Canvas
                shadows
                style={{ width: '100%', height: '100%' }}
                camera={{ position: initialCameraPosition, fov: 60 }}
                onCreated={({ camera }) => {
                    cameraRef.current = camera as THREE.PerspectiveCamera;
                }}
            >
                <ambientLight intensity={0.5} />
                <directionalLight
                    position={[-10, 20, 10]}
                    intensity={1.5}
                    castShadow
                    shadow-mapSize-width={1024}
                    shadow-mapSize-height={1024}
                />
                <Suspense fallback={null}>
                    <MainBuilding1 />
                    <MainBuilding2 />
                    <MainBuilding3 />
                    <Ground />
                    <Sta1 />
                    <Sta2 />
                    <Sta3 />
                </Suspense>
                <OrbitControls
                    ref={controlsRef}
                    maxPolarAngle={Math.PI / 2} // カメラが真上を向かないように制限
                    minPolarAngle={0} // カメラが真下を向かないように制限
                    enableZoom={true} // ズーム機能を有効にする
                    enablePan={true} // パン機能を有効にする
                    maxDistance={400} // カメラの最大距離
                    onChange={(event: any) => {
                        const camera = event.target.object;
                        if (camera.position.y < 0) {
                            camera.position.y = 0;
                        }
                    }}
                />
            </Canvas>
        </div>
    );
};

export default App;
