import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Float, Text, ContactShadows, Environment } from '@react-three/drei';

// The individual 3D floating badge
const StatBadge3D = ({ position, value, label, accentColor, delay }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <Float 
      speed={2.5} // Animation speed
      rotationIntensity={0.5} // How much it rotates while floating
      floatIntensity={1.5} // How far up and down it moves
      floatingRange={[-0.1, 0.1]}
      position={position}
    >
      <group 
        onPointerOver={() => setHovered(true)} 
        onPointerOut={() => setHovered(false)}
        // Smooth scale-up on hover
        scale={hovered ? 1.15 : 1}
      >
        {/* The 3D Block (Glass/Metal Look) */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[3.2, 1.8, 0.2]} />
          <meshPhysicalMaterial 
            color={hovered ? accentColor : "#1A1D24"}
            emissive={hovered ? accentColor : "#000000"}
            emissiveIntensity={hovered ? 0.4 : 0}
            roughness={hovered ? 0.1 : 0.4}
            metalness={0.8}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </mesh>

        {/* The Main Value (e.g., 99.8%) */}
        <Text 
          position={[0, 0.25, 0.11]} 
          fontSize={0.6} 
          color={hovered ? "#252A34" : accentColor} 
          fontWeight="bold"
          anchorX="center" 
          anchorY="middle"
        >
          {value}
        </Text>

        {/* The Label (e.g., Accuracy Rate) */}
        <Text 
          position={[0, -0.35, 0.11]} 
          fontSize={0.22} 
          color={hovered ? "#1A1D24" : "#EAEAEA"} 
          letterSpacing={0.1}
          anchorX="center" 
          anchorY="middle"
        >
          {label.toUpperCase()}
        </Text>
      </group>
    </Float>
  );
};

// The Container that sets up the 3D Scene
const ThreeDStats = () => {
  return (
    <div className="w-full max-w-6xl mx-auto h-[400px] mb-32 relative cursor-pointer">
      {/* Fallback/Background Glow */}
      <div className="absolute inset-0 bg-[#08D9D6]/5 blur-[100px] rounded-full -z-10 pointer-events-none"></div>

      <Canvas camera={{ position: [0, 0, 7], fov: 45 }}>
        {/* Lighting setup for that premium tech look */}
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} color="#FF2E63" intensity={0.5} />
        
        {/* Environment reflections for the glass effect */}
        <Environment preset="city" />

        {/* Positioning the 4 badges across the X axis. 
          Adjust the X value (the first number in the array) to space them out.
        */}
        <group position={[0, 0, 0]}>
          <StatBadge3D 
            position={[-5.2, 0, 0]} 
            value="99.8%" 
            label="Accuracy Rate" 
            accentColor="#08D9D6" 
          />
          <StatBadge3D 
            position={[-1.7, 0, 0]} 
            value="< 2s" 
            label="Processing Time" 
            accentColor="#FF2E63" 
          />
          <StatBadge3D 
            position={[1.7, 0, 0]} 
            value="2.4M+" 
            label="Parameters Scanned" 
            accentColor="#08D9D6" 
          />
          <StatBadge3D 
            position={[5.2, 0, 0]} 
            value="Secure" 
            label="Data Encryption" 
            accentColor="#FF2E63" 
          />
        </group>

        {/* Soft shadow cast on the "floor" below the floating items */}
        <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={20} blur={2} far={4} />
      </Canvas>
    </div>
  );
};

export default ThreeDStats;