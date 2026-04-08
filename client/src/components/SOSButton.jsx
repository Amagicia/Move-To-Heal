// import { useRef, useState } from 'react';
// import { Canvas, useFrame } from '@react-three/fiber';
// import * as THREE from 'three';

// // The actual 3D object
// const PulsingOrb = ({ isHovered }) => {
//   const meshRef = useRef();

//   useFrame(({ clock }) => {
//     // Pulse faster if hovered, slower if not
//     const speed = isHovered ? 8 : 3;
//     const scale = 1 + Math.sin(clock.elapsedTime * speed) * 0.08;
//     meshRef.current.scale.set(scale, scale, scale);
    
//     // Slowly rotate the sphere
//     meshRef.current.rotation.y += 0.01;
//     meshRef.current.rotation.x += 0.005;
//   });

//   return (
//     <mesh ref={meshRef}>
//       <sphereGeometry args={[1.2, 64, 64]} />
//       <meshStandardMaterial 
//         color="#FF2E63" 
//         emissive="#FF2E63" 
//         emissiveIntensity={isHovered ? 1.5 : 0.8} 
//         roughness={0.2}
//         metalness={0.8}
//       />
//     </mesh>
//   );
// };

// // The UI Wrapper
// const SOSButton = () => {
//   const [isHovered, setIsHovered] = useState(false);

//   const handleEmergencyClick = () => {
//     navigate('/emergency');
//     alert("EMERGENCY PROTOCOL ACTIVATED. Routing to nearest emergency services dispatch...");
//   };

//   return (
//     <div 
//       className="fixed bottom-8 right-8 w-24 h-24 z-50 cursor-pointer flex items-center justify-center group transition-transform duration-300 hover:scale-110"
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//       onClick={handleEmergencyClick}
//       title="Emergency Override"
//     >
//       {/* HTML Text Overlay */}
//       <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
//         <span className="text-[#EAEAEA] font-black text-xl tracking-widest drop-shadow-[0_0_8px_rgba(255,46,99,1)] group-hover:drop-shadow-[0_0_15px_rgba(255,46,99,1)] transition-all">
//           SOS
//         </span>
//       </div>

//       {/* Background glow behind the canvas */}
//       <div className={`absolute inset-2 rounded-full bg-[#FF2E63] blur-xl transition-opacity duration-300 ${isHovered ? 'opacity-60' : 'opacity-20'}`}></div>

//       {/* 3D Canvas */}
//       <div className="absolute inset-0 z-0">
//         <Canvas camera={{ position: [0, 0, 4] }}>
//           <ambientLight intensity={0.5} />
//           <directionalLight position={[10, 10, 5]} intensity={1.5} />
//           <pointLight position={[-10, -10, -10]} color="#08D9D6" intensity={0.5} />
//           <PulsingOrb isHovered={isHovered} />
//         </Canvas>
//       </div>
//     </div>
//   );
// };

// export default SOSButton;






import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useNavigate } from 'react-router-dom'; // 1. Added the import

// --- 3D MODEL: The Medical Cross ---
const MedicalCross = ({ isHovered }) => {
  const groupRef = useRef();

  useFrame(({ clock }) => {
    // Pulse faster if hovered, slower if not
    const speed = isHovered ? 6 : 2;
    const scale = 1 + Math.sin(clock.elapsedTime * speed) * 0.08;
    groupRef.current.scale.set(scale, scale, scale);
    
    // Smoothly rotate the entire cross
    groupRef.current.rotation.y += 0.02;
    groupRef.current.rotation.z = Math.sin(clock.elapsedTime * 1) * 0.15;
  });

  const materialProps = {
    color: "#FF2E63", 
    emissive: "#FF2E63", 
    emissiveIntensity: isHovered ? 2 : 0.8, 
    roughness: 0.1,
    metalness: 0.9,
    clearcoat: 1.0,
  };

  return (
    <group ref={groupRef}>
      {/* Vertical Bar */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.6, 2.2, 0.6]} />
        <meshPhysicalMaterial {...materialProps} />
      </mesh>
      {/* Horizontal Bar */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.2, 0.6, 0.6]} />
        <meshPhysicalMaterial {...materialProps} />
      </mesh>
    </group>
  );
};

// --- UI Wrapper ---
const SOSButton = () => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate(); // 2. Initialized the navigate function here!

  const handleEmergencyClick = () => {
    navigate('/emergency'); // 3. Now it knows how to route to the emergency page
  };

  return (
    <div 
      className="fixed bottom-8 right-8 w-28 h-28 z-50 cursor-pointer flex items-center justify-center group transition-transform duration-300 hover:scale-110"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleEmergencyClick}
      title="Emergency Override"
    >
      {/* Background glow behind the canvas */}
      <div className={`absolute inset-0 rounded-full bg-[#FF2E63] blur-2xl transition-opacity duration-300 ${isHovered ? 'opacity-70' : 'opacity-20'}`}></div>

      {/* 3D Canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 4.5] }}>
          <ambientLight intensity={0.8} />
          <directionalLight position={[10, 10, 5]} intensity={2} />
          <pointLight position={[-10, -10, -10]} color="#08D9D6" intensity={1} />
          <MedicalCross isHovered={isHovered} />
        </Canvas>
      </div>

      {/* HTML Text Overlay positioned below the 3D object */}
      <div className="absolute -bottom-6 w-full text-center z-10 pointer-events-none transition-all duration-300 opacity-0 group-hover:opacity-100 group-hover:-translate-y-2">
        <span className="text-[#FF2E63] font-black text-sm tracking-widest uppercase drop-shadow-[0_0_8px_rgba(255,46,99,0.8)] bg-[#252A34]/80 px-3 py-1 rounded-full border border-[#FF2E63]/30">
          Emergency
        </span>
      </div>
    </div>
  );
};

export default SOSButton;