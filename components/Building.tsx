"use client"

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Button } from "@/components/ui/button"

const SchoolBuilding: React.FC = () => {
    const mountRef = useRef<HTMLDivElement | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const controlsRef = useRef<OrbitControls | null>(null);
    const buildingGroupRef = useRef<THREE.Group | null>(null);
    const [currentFloor, setCurrentFloor] = useState<number | null>(null);

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

        const buildingGroup = new THREE.Group();
        buildingGroupRef.current = buildingGroup;

        const floorHeight = 1;
        const floorColors = [0xFF5733, 0x33FF57, 0x3357FF, 0xFF33A1, 0xFFFF33];
        const floorGeometries = [
            new THREE.BoxGeometry(3, floorHeight, 2),
            new THREE.BoxGeometry(3, floorHeight, 3),
            new THREE.BoxGeometry(4, floorHeight, 2),
            new THREE.BoxGeometry(3, floorHeight, 2.5),
            new THREE.BoxGeometry(2.5, floorHeight, 3)
        ];

        for (let i = 0; i < 5; i++) {
            const floorMaterial = new THREE.MeshBasicMaterial({ color: floorColors[i], wireframe: true });
            const floor = new THREE.Mesh(floorGeometries[i], floorMaterial);
            floor.position.y = i * floorHeight - 2;
            floor.userData = { floor: i };
            buildingGroup.add(floor);
        }

        scene.add(buildingGroup);
        camera.position.set(5, 5, 5);

        const controls = new OrbitControls(camera, renderer.domElement);
        controlsRef.current = controls;
        controls.target.set(0, 0, 0);
        controls.update();

        const animate = () => {
            requestAnimationFrame(animate);
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

    const zoomToFloor = (floor: number) => {
        if (cameraRef.current && controlsRef.current && buildingGroupRef.current) {
            const newCameraY = floor * 1 - 2 + 0.5;
            const newTargetY = newCameraY;

            const startPosition = cameraRef.current.position.clone();
            const startTarget = controlsRef.current.target.clone();

            const zoomOutPosition = new THREE.Vector3(5, 5, 5);
            const endPosition = new THREE.Vector3(3, newCameraY, 3);
            const endTarget = new THREE.Vector3(0, newTargetY, 0);

            animateZoom(startPosition, zoomOutPosition, startTarget, new THREE.Vector3(0, 0, 0), () => {
                buildingGroupRef.current!.children.forEach((child) => {
                    (child as THREE.Mesh).visible = true;
                });

                setTimeout(() => {
                    animateZoom(zoomOutPosition, endPosition, new THREE.Vector3(0, 0, 0), endTarget, () => {
                        buildingGroupRef.current!.children.forEach((child, index) => {
                            if (index !== floor) {
                                (child as THREE.Mesh).visible = false;
                            }
                        });
                    });
                }, 500);
            });
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

    const resetView = () => {
        if (cameraRef.current && controlsRef.current && buildingGroupRef.current) {
            const startPosition = cameraRef.current.position.clone();
            const startTarget = controlsRef.current.target.clone();

            const endPosition = new THREE.Vector3(5, 5, 5);
            const endTarget = new THREE.Vector3(0, 0, 0);

            animateZoom(startPosition, endPosition, startTarget, endTarget, () => {
                buildingGroupRef.current!.children.forEach((child) => {
                    (child as THREE.Mesh).visible = true;
                });
                setCurrentFloor(null);
            });
        }
    };

    useEffect(() => {
        if (currentFloor !== null) {
            zoomToFloor(currentFloor);
        }
    }, [currentFloor]);

    return (
        <div>
            <div ref={mountRef} style={{ width: '100vw', height: '100vh' }} />
            <div style={{ position: 'absolute', top: 10, left: 10 }}>
                {[0, 1, 2, 3, 4].map(floor => (
                    <Button key={floor} onClick={() => setCurrentFloor(floor)} variant="outline">Floor{floor + 1}</Button>
                ))}
                <Button onClick={resetView} variant="outline">Reset</Button>
            </div>
        </div>
    );
};

export default SchoolBuilding;
