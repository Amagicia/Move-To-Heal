import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sphere } from "@react-three/drei";

const Helix = () => {
    const groupRef = useRef();

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        groupRef.current.rotation.y = t * 0.5;
        groupRef.current.position.y = Math.sin(t) * 0.2;
    });

    const count = 20;
    const radius = 2;
    const height = 10;

    return (
        <group ref={groupRef}>
            {Array.from({ length: count }).map((_, i) => {
                const angle = (i / count) * Math.PI * 4;
                const y = (i / count) * height - height / 2;
                
                return (
                    <group key={i}>
                        {/* Strand 1 */}
                        <Sphere args={[0.15, 16, 16]} position={[Math.cos(angle) * radius, y, Math.sin(angle) * radius]}>
                            <meshStandardMaterial color="#08D9D6" emissive="#08D9D6" emissiveIntensity={2} />
                        </Sphere>
                        {/* Strand 2 */}
                        <Sphere args={[0.15, 16, 16]} position={[Math.cos(angle + Math.PI) * radius, y, Math.sin(angle + Math.PI) * radius]}>
                            <meshStandardMaterial color="#FF2E63" emissive="#FF2E63" emissiveIntensity={2} />
                        </Sphere>
                        {/* Connecting Bar */}
                        <mesh position={[0, y, 0]} rotation={[0, 0, angle]}>
                            <boxGeometry args={[radius * 2, 0.03, 0.03]} />
                            <meshStandardMaterial color="#EAEAEA" opacity={0.3} transparent />
                        </mesh>
                    </group>
                );
            })}
        </group>
    );
};

export default function MedicalHelix() {
    return (
        <div className="absolute inset-0 z-0 opacity-40 md:opacity-100">
            <Canvas camera={{ position: [0, 0, 15], fov: 35 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} color="#08D9D6" />
                <pointLight position={[-10, -10, -10]} color="#FF2E63" />
                <Float speed={2} rotationIntensity={1} floatIntensity={1}>
                    <Helix />
                </Float>
            </Canvas>
        </div>
    );
}
// import Spline from "@splinetool/react-spline";

// const MedicalHelix = () => {
//   const handleLoad = (spline) => {
//     console.log("Spline Loaded:", spline);
//   };

//   return (
//     <div className="w-full h-full">
//       <Spline
//         // scene="https://prod.spline.design/VnjMhENtk6E1axDR/scene.splinecode"
//         scene="https://prod.spline.design/nuQld7cV9dFYlSH2/scene.splinecode" 

//         onLoad={handleLoad}
//       />
//     </div>
//   );
// };

// export default MedicalHelix;