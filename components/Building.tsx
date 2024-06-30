"use client"

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Button } from "@/components/ui/button";

const BoxFocus: React.FC = () => {
    const mountRef = useRef<HTMLDivElement | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const controlsRef = useRef<OrbitControls | null>(null);
    const boxGroupRef = useRef<THREE.Group | null>(null);
    const [highlightedBox, setHighlightedBox] = useState<string | null>(null);
    const boxMap = useRef<{ [key: string]: THREE.Mesh }>({});

    useEffect(() => {
        const width = mountRef.current?.clientWidth || window.innerWidth;
        const height = mountRef.current?.clientHeight || window.innerHeight;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        cameraRef.current = camera;

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);

        if (mountRef.current) {
            mountRef.current.appendChild(renderer.domElement);
        }

        const boxGroup = new THREE.Group();
        boxGroupRef.current = boxGroup;

        // Box 1
        const box1Geometry = new THREE.BoxGeometry(4, 4, 4);
        const box1Material = new THREE.MeshBasicMaterial({ color: 0x3357FF, wireframe: true });
        const box1 = new THREE.Mesh(box1Geometry, box1Material);
        box1.position.set(-10, 0, 0);
        const box1Name = "box-1";
        box1.userData = { name: box1Name };
        boxMap.current[box1Name] = box1;
        boxGroup.add(box1);

        // Box 2
        const box2Geometry = new THREE.BoxGeometry(4, 4, 4);
        const box2Material = new THREE.MeshBasicMaterial({ color: 0x3357FF, wireframe: true });
        const box2 = new THREE.Mesh(box2Geometry, box2Material);
        box2.position.set(10, 0, 0);
        const box2Name = "box-2";
        box2.userData = { name: box2Name };
        boxMap.current[box2Name] = box2;
        boxGroup.add(box2);

        scene.add(boxGroup);
        camera.position.set(20, 20, 20);

        const controls = new OrbitControls(camera, renderer.domElement);
        controlsRef.current = controls;
        controls.target.set(0, 0, 0);
        controls.update();

        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };

        animate();

        window.addEventListener('resize', handleResize);

        return () => {
            if (mountRef.current) {
                mountRef.current.removeChild(renderer.domElement);
            }
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleResize = () => {
        if (cameraRef.current && mountRef.current) {
            const width = mountRef.current.clientWidth;
            const height = mountRef.current.clientHeight;

            cameraRef.current.aspect = width / height;
            cameraRef.current.updateProjectionMatrix();
        }
    };

    const resetView = (callback?: () => void) => {
        if (cameraRef.current && controlsRef.current) {
            const startPosition = cameraRef.current.position.clone();
            const startTarget = controlsRef.current.target.clone();

            const endPosition = new THREE.Vector3(20, 20, 20);
            const endTarget = new THREE.Vector3(0, 0, 0);

            animateZoom(startPosition, endPosition, startTarget, endTarget, () => {
                boxGroupRef.current!.children.forEach((child) => {
                    const mesh = child as THREE.Mesh;
                    mesh.visible = true;
                    (mesh.material as THREE.MeshBasicMaterial).color.setHex(0x3357FF);
                });
                setHighlightedBox(null);
                if (callback) callback();
            });
        }
    };

    const focusOnBox = (boxName: string) => {
        if (cameraRef.current && controlsRef.current && boxGroupRef.current) {
            const boxObject = boxMap.current[boxName];

            if (!boxObject) {
                console.error('Box object not found');
                return;
            }

            const resetAndFocus = () => {
                // 現在フォーカスされているボックスをリセット
                if (highlightedBox) {
                    const previousBoxObject = boxMap.current[highlightedBox];
                    if (previousBoxObject) {
                        (previousBoxObject.material as THREE.MeshBasicMaterial).color.setHex(0x3357FF);
                    }
                }

                // 新たに選択されたボックスの色を変更
                (boxObject.material as THREE.MeshBasicMaterial).color.setHex(0xff0000);

                const boxPosition = boxObject.position.clone();
                const cameraOffset = new THREE.Vector3(0, 5, 10); // Boxの前にカメラを配置するためのオフセット
                const newCameraPosition = new THREE.Vector3(
                    boxPosition.x + cameraOffset.x,
                    boxPosition.y + cameraOffset.y,
                    boxPosition.z + cameraOffset.z
                );

                const newTargetPosition = boxPosition.clone();

                // 他方の箱を非表示にする
                boxGroupRef.current!.children.forEach((child) => {
                    if ((child as THREE.Mesh).userData.name !== boxName) {
                        (child as THREE.Mesh).visible = false;
                    }
                });

                animateZoom(new THREE.Vector3(20, 20, 20), newCameraPosition, new THREE.Vector3(0, 0, 0), newTargetPosition, () => {
                    setHighlightedBox(boxName);
                });
            };

            if (highlightedBox) {
                // 現在のフォーカスが異なる場合、すべてを表示してからフォーカス
                boxGroupRef.current!.children.forEach((child) => {
                    (child as THREE.Mesh).visible = true;
                });
                animateZoom(cameraRef.current.position.clone(), new THREE.Vector3(20, 20, 20), controlsRef.current.target.clone(), new THREE.Vector3(0, 0, 0), resetAndFocus);
            } else {
                // 直接フォーカス
                resetAndFocus();
            }
        }
    };

    const animateZoom = (
        startPosition: THREE.Vector3,
        endPosition: THREE.Vector3,
        startTarget: THREE.Vector3,
        endTarget: THREE.Vector3,
        onComplete: () => void
    ) => {
        let progress = 0;
        const duration = 1000;

        const animate = (timestamp: number) => {
            if (progress === 0) {
                progress = timestamp;
            }
            const elapsed = timestamp - progress;
            const fraction = Math.min(elapsed / duration, 1);

            cameraRef.current!.position.lerpVectors(startPosition, endPosition, fraction);
            controlsRef.current!.target.lerpVectors(startTarget, endTarget, fraction);
            controlsRef.current!.update();

            if (fraction < 1) {
                requestAnimationFrame(animate);
            } else {
                onComplete();
            }
        };

        requestAnimationFrame(animate);
    };

    return (
        <div>
            <div ref={mountRef} style={{ width: '100vw', height: '100vh' }} />
            <div style={{ position: 'absolute', top: 10, left: 10 }}>
                <Button onClick={() => focusOnBox("box-1")} variant="outline">Focus on Box 1</Button>
                <Button onClick={() => focusOnBox("box-2")} variant="outline">Focus on Box 2</Button>
                <Button onClick={() => resetView()} variant="outline">Reset</Button>
            </div>
            <div style={{ position: 'absolute', top: 10, right: 10, color: 'white' }}>
                <p>Highlighted Box: {highlightedBox !== null ? highlightedBox : 'None'}</p>
            </div>
        </div>
    );
};

export default BoxFocus;
