"use client";

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Suspense, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

const Building = ({ position, size, color = 'lightgrey', opacity = 0.5, name }: { position: [number, number, number], size: [number, number, number], color?: string, opacity?: number, name?: string }) => (
    <mesh position={position} castShadow receiveShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial color={color} transparent opacity={opacity} />
    </mesh>
);

const Corridor = ({ position, size, color = 'lightgrey', opacity = 0.5, name }: { position: [number, number, number], size: [number, number, number], color?: string, opacity?: number, name?: string }) => (
    <mesh position={position} castShadow receiveShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial color={color} transparent opacity={opacity} />
    </mesh>
);

const Ground = ({ color = 'green' }: { color?: string }) => (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[350, 350]} />
        <meshStandardMaterial color={color} />
    </mesh>
);

const Rooms = ({ position, color = 'white', name }: { position: [number, number, number], color?: string, name?: string }) => (
    <mesh position={position} castShadow receiveShadow>
        <boxGeometry args={[28, 16, 20]} />
        <meshStandardMaterial color={color} />
    </mesh>
);

const Fro = ({ position, size, color = 'yellow', name }: { position: [number, number, number], size: [number, number, number], color?: string, name?: string }) => (
    <mesh position={position} castShadow receiveShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial color={color} />
    </mesh>
);

const Room = ({ position, size, color = 'white', name }: { position: [number, number, number], size: [number, number, number], color?: string, name?: string }) => (
    <mesh position={position} castShadow receiveShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial color={color} />
    </mesh>
);

const App = () => {
    const initialCameraPosition = new THREE.Vector3(-250, 190, 170);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const controlsRef = useRef<any>(null);
    const [showElements, setShowElements] = useState(false);

    const handleResetCamera = () => {
        if (cameraRef.current && controlsRef.current) {
            gsap.to(cameraRef.current.position, {
                x: initialCameraPosition.x,
                y: initialCameraPosition.y,
                z: initialCameraPosition.z,
                duration: 2,
                onUpdate: () => {
                    if (cameraRef.current) {
                        cameraRef.current.lookAt(new THREE.Vector3(-50, 0, 0));
                        controlsRef.current.update();
                    }
                }
            });
        }
    };

    const toggleElements = () => {
        setShowElements(!showElements);
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
            <button
                onClick={toggleElements}
                style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    zIndex: 10,
                    padding: '10px 20px',
                    background: 'white',
                    border: '1px solid black',
                    borderRadius: '5px',
                    cursor: 'pointer'
                }}
            >
                Toggle Elements
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
                    {`建物`}
                    <Building position={[-18, 24, 143]} size={[284, 48, 32]} color="lightgrey" opacity={showElements ? 0.2 : 1.0} name='1棟' />
                    <Building position={[-132, 16, 121]} size={[28, 32, 12]} color="lightgrey" opacity={showElements ? 0.2 : 1.0} name='1棟sub' />
                    <Building position={[32, 32, 21]} size={[244, 64, 32]} color="lightgrey" opacity={showElements ? 0.2 : 1.0} name='2棟' />
                    <Building position={[78, 32, -1]} size={[16, 64, 12]} color="lightgrey" opacity={showElements ? 0.2 : 1.0} name='2棟女子トイレ' />
                    <Building position={[-42, 32, -1]} size={[16, 64, 12]} color="lightgrey" opacity={showElements ? 0.2 : 1.0} name='2棟男子トイレ' />
                    <Building position={[42, 16, -99]} size={[208, 32, 28]} color="lightgrey" opacity={showElements ? 0.2 : 1.0} name='3棟1-2' />
                    <Building position={[94, 40, -99]} size={[104, 16, 28]} color="lightgrey" opacity={showElements ? 0.2 : 1.0} name='3棟3' />
                    <Building position={[100, 24, -119]} size={[28, 48, 12]} color="lightgrey" opacity={showElements ? 0.2 : 1.0} name='3棟sub' />
                    <Building position={[100, 16, -133]} size={[28, 32, 16]} color="lightgrey" opacity={showElements ? 0.2 : 1.0} name='3棟sub2' />
                    <Ground />
                    {`渡り廊下`}
                    <Corridor position={[-56, 32, 82]} size={[12, 32, 90]} color="lightgrey" opacity={showElements ? 0.2 : 1.0} name='更衣室側' />
                    <Corridor position={[92, 24, 82]} size={[12, 16, 90]} color="lightgrey" opacity={showElements ? 0.2 : 1.0} name='食堂側' />
                    <Corridor position={[92, 24, -40]} size={[12, 16, 90]} color="lightgrey" opacity={showElements ? 0.2 : 1.0} name='視聴覚側' />
                    {`階段`}
                    {showElements && (
                        <>
                            <Fro position={[-44, 32, 27]} size={[12, 64, 20]} name='生徒会室側階段' />
                            <Fro position={[-44, 16, -93]} size={[12, 32, 16]} name='3棟体育館側' />
                            <Fro position={[80, 32, 27]} size={[12, 64, 20]} name='自習室側階段' />
                            <Fro position={[78, 24, 121]} size={[16, 48, 12]} name='調理室側' />
                            <Fro position={[-96, 24, 149]} size={[12, 48, 20]} name='職員室側' />
                            <Fro position={[-138, 16, 121]} size={[16, 32, 12]} name='保健室側' />
                            <Fro position={[106, 24, -119]} size={[16, 48, 12]} name='音楽室側' />
                            {`トイレ`}
                            <Room position={[78, 8, 109]} size={[16, 16, 12]} name='男子トイレ' color='blue' />
                            <Room position={[78, 8, 97]} size={[16, 16, 12]} name='女子トイレ' color='red' />
                            <Room position={[78, 24, 109]} size={[16, 16, 12]} name='男子トイレ' color='blue' />
                            <Room position={[78, 24, 97]} size={[16, 16, 12]} name='女子トイレ' color='red' />
                            <Room position={[78, 8, 85]} size={[16, 16, 12]} name='多目的トイレ' color='lightgreen' />
                            <Room position={[78, 8, -1]} size={[16, 16, 12]} name='女子トイレ' color='red' />
                            <Room position={[78, 24, -1]} size={[16, 16, 12]} name='女子トイレ' color='red' />
                            <Room position={[78, 40, -1]} size={[16, 16, 12]} name='女子トイレ' color='red' />
                            <Room position={[78, 56, -1]} size={[16, 16, 12]} name='女子トイレ' color='red' />
                            <Room position={[-42, 8, -1]} size={[16, 16, 12]} name='男子トイレ' color='blue' />
                            <Room position={[-42, 24, -1]} size={[16, 16, 12]} name='男子トイレ' color='blue' />
                            <Room position={[-42, 40, -1]} size={[16, 16, 12]} name='男子トイレ' color='blue' />
                            <Room position={[-42, 56, -1]} size={[16, 16, 12]} name='男子トイレ' color='blue' />
                            <Room position={[100, 8, -133]} size={[28, 16, 16]} name='男子トイレ' color='blue' />
                            <Room position={[100, 24, -133]} size={[28, 16, 16]} name='女子トイレ' color='red' />
                            {`一階`}
                            {`1棟1`}
                            <Room position={[111, 8, 143]} size={[26, 16, 32]} name='調理室' />
                            <Room position={[91, 8, 149]} size={[14, 16, 20]} name='調理準備室' />
                            <Room position={[77, 8, 149]} size={[14, 16, 20]} name='書庫室' />
                            <Room position={[63, 8, 149]} size={[14, 16, 20]} name='応接室' />
                            <Room position={[49, 8, 149]} size={[14, 16, 20]} name='校長室' />
                            <Room position={[30, 8, 149]} size={[24, 16, 20]} name='事務室' />
                            <Room position={[8, 8, 149]} size={[20, 16, 20]} name='職員玄関' />
                            <Room position={[-9, 8, 149]} size={[14, 16, 20]} name='印刷室' />
                            <Room position={[-36, 8, 149]} size={[40, 16, 20]} name='全日職員室' />
                            <Room position={[-73, 8, 149]} size={[34, 16, 20]} name='第二職員室' />
                            <Room position={[-109, 8, 149]} size={[14, 16, 20]} name='放送室' />
                            <Room position={[-123, 8, 149]} size={[14, 16, 20]} name='定時制保健室' />
                            <Room position={[-145, 8, 149]} size={[30, 16, 20]} name='全日制保健室' />
                            {`1棟2`}
                            <Room position={[-145, 24, 143]} size={[30, 16, 32]} name='定時制職員室' />
                            <Room position={[-116, 24, 149]} size={[28, 16, 20]} name='定時制職員室' />
                            <Rooms position={[-76, 24, 149]} name='3-9' />
                            <Rooms position={[-48, 24, 149]} name='3-8' />
                            <Rooms position={[-20, 24, 149]} name='選択A' />
                            <Room position={[9, 24, 149]} size={[30, 16, 20]} />
                            <Room position={[40, 24, 149]} size={[32, 16, 20]} name='多目的室' />
                            <Room position={[91, 24, 149]} size={[14, 16, 20]} name='作法室' />
                            <Room position={[77, 24, 149]} size={[14, 16, 20]} name='英語科準備室' />
                            <Room position={[63, 24, 149]} size={[14, 16, 20]} name='国語科準備室' />
                            <Room position={[111, 24, 143]} size={[26, 16, 32]} name='被服室' />
                            {`1棟3`}
                            <Room position={[-145, 40, 149]} size={[30, 16, 20]} name='コンピューター室' />
                            <Room position={[-109, 40, 149]} size={[14, 16, 20]} name='数学科準備室' />
                            <Room position={[-123, 40, 149]} size={[14, 16, 20]} name='定時制進路指導室' />
                            <Room position={[-52, 40, 149]} size={[76, 16, 20]} name='図書室' />
                            <Room position={[-2, 40, 149]} size={[24, 16, 20]} name='図書整理室' />
                            <Room position={[33, 40, 149]} size={[46, 16, 20]} name='社会科教室' />
                            <Room position={[91, 40, 149]} size={[14, 16, 20]} name='美術準備室' />
                            <Room position={[77, 40, 149]} size={[14, 16, 20]} name='デッサン室' />
                            <Room position={[63, 40, 149]} size={[14, 16, 20]} name='社会科準備室' />
                            <Room position={[111, 40, 143]} size={[26, 16, 32]} name='美術室' />
                            {`2棟1`}
                            <Room position={[-76, 8, 16]} size={[28, 16, 14]} name='女子更衣室' />
                            <Room position={[-76, 8, 30]} size={[28, 16, 14]} name='男子更衣室' />
                            <Room position={[-76, 8, 56]} size={[28, 16, 38]} name='未来館' />
                            <Room position={[-24, 8, 27]} size={[28, 16, 20]} name='生徒会室' />
                            <Room position={[-4, 8, 27]} size={[12, 16, 20]} name='定時制女子更衣室' />
                            <Room position={[14, 8, 27]} size={[24, 16, 20]} name='3-6' />
                            <Room position={[38, 8, 27]} size={[24, 16, 20]} name='3-5' />
                            <Room position={[62, 8, 27]} size={[24, 16, 20]} name='3-4' />
                            <Rooms position={[112, 8, 27]} name='自習室' />
                            <Rooms position={[140, 8, 27]} name='進路指導室' />
                            {`2棟2`}
                            <Rooms position={[-76, 24, 27]} name='2-9' />
                            <Rooms position={[-24, 24, 27]} name='2-8' />
                            <Rooms position={[4, 24, 27]} name='2-7' />
                            <Rooms position={[32, 24, 27]} name='2-6' />
                            <Rooms position={[60, 24, 27]} name='3-3' />
                            <Rooms position={[112, 24, 27]} name='3-2' />
                            <Rooms position={[140, 24, 27]} name='3-1' />
                            {`2棟3`}
                            <Rooms position={[-76, 40, 27]} name='2-5' />
                            <Rooms position={[-24, 40, 27]} name='2-4' />
                            <Rooms position={[4, 40, 27]} name='2-3' />
                            <Rooms position={[32, 40, 27]} name='2-2' />
                            <Rooms position={[60, 40, 27]} name='2-1' />
                            <Rooms position={[112, 40, 27]} name='1-9' />
                            <Rooms position={[140, 40, 27]} name='1-8' />
                            {`2棟4`}
                            <Rooms position={[-76, 56, 27]} name='1-7' />
                            <Rooms position={[-24, 56, 27]} name='1-6' />
                            <Rooms position={[4, 56, 27]} name='1-5' />
                            <Rooms position={[32, 56, 27]} name='1-4' />
                            <Rooms position={[60, 56, 27]} name='1-3' />
                            <Room position={[92, 56, 27]} size={[12, 16, 20]} name='時報室' />
                            <Rooms position={[112, 56, 27]} name='1-2' />
                            <Rooms position={[140, 56, 27]} name='1-1' />
                            {`3棟1`}
                            <Room position={[130, 8, -99]} size={[32, 16, 28]} name='テキサス' />
                            <Room position={[106, 8, -93]} size={[16, 16, 16]} name='理科準備室' />
                            <Room position={[63, 8, -93]} size={[46, 16, 16]} name='化学室' />
                            <Room position={[32, 8, -93]} size={[16, 16, 16]} name='化学室準備室' />
                            <Room position={[1, 8, -93]} size={[46, 16, 16]} name='生物室' />
                            <Room position={[-30, 8, -93]} size={[16, 16, 16]} name='生物準備室' />
                            {`3棟2`}
                            <Room position={[130, 24, -99]} size={[32, 16, 28]} name='音楽室' />
                            <Room position={[106, 24, -93]} size={[16, 16, 16]} name='音楽準備室' />
                            <Room position={[63, 24, -93]} size={[46, 16, 16]} name='物理実験室' />
                            <Room position={[32, 24, -93]} size={[16, 16, 16]} name='物理準備室' />
                            <Room position={[1, 24, -93]} size={[46, 16, 16]} name='地学実験室' />
                            <Room position={[-30, 24, -93]} size={[16, 16, 16]} name='地学準備室' />
                            {`3棟2`}
                            <Room position={[130, 40, -99]} size={[32, 16, 28]} name='視聴覚室' />
                            <Room position={[106, 40, -93]} size={[16, 16, 16]} name='視聴覚準備室' />
                            <Room position={[78, 40, -93]} size={[40, 16, 16]} name='書道室' />
                            <Room position={[50, 40, -93]} size={[16, 16, 16]} name='教材室' />
                        </>
                    )}
                </Suspense>
                <OrbitControls
                    ref={controlsRef}
                    maxPolarAngle={Math.PI / 2} // カメラが真上を向かないように制限
                    minPolarAngle={0} // カメラが真下を向かないように制限
                    enableZoom={true} // ズーム機能を有効にする
                    enablePan={true} // パン機能を有効にする
                    maxDistance={450} // カメラの最大距離
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
