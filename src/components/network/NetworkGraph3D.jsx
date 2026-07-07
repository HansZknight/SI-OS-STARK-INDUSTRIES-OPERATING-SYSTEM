import React, { useRef, useState, useEffect, Suspense, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Html, QuadraticBezierLine } from '@react-three/drei';
import * as THREE from 'three';
import { Loader2, AlertTriangle, Shield, Cpu, Database, Server, Radio, Zap } from 'lucide-react';

// Generate nodes and links data with Stark Industries aesthetics
const generateGraphData = () => {
  const nodes = [
    { id: 'core', name: 'J.A.R.V.I.S MAINFRAME', type: 'core', status: 'online', x: 0, y: 0, z: 0 },
    { id: 'arc', name: 'ARC REACTOR GRID', type: 'power', status: 'online', x: -120, y: 40, z: -50 },
    { id: 'veronica', name: 'VERONICA ORBITAL', type: 'satellite', status: 'online', x: 0, y: 150, z: 20 },
    { id: 'armor1', name: 'MARK L PROTOCOL', type: 'armor', status: 'online', x: 140, y: -20, z: -40 },
    { id: 'sec1', name: 'FIREWALL BASTION', type: 'security', status: 'online', x: -80, y: -60, z: 120 },
    { id: 'db1', name: 'STARK R&D VAULT', type: 'database', status: 'online', x: 80, y: 60, z: 100 },
    { id: 'net1', name: 'QUANTUM UPLINK', type: 'network', status: 'warning', x: 0, y: -120, z: -80 },
    { id: 'sat2', name: 'STARK SATELLITE 04', type: 'satellite', status: 'online', x: -150, y: 120, z: 80 },
  ];

  const links = [
    { source: 'core', target: 'arc', value: 5, active: true },
    { source: 'core', target: 'veronica', value: 4, active: true },
    { source: 'core', target: 'armor1', value: 4, active: true },
    { source: 'core', target: 'sec1', value: 3, active: true },
    { source: 'core', target: 'db1', value: 3, active: true },
    { source: 'core', target: 'net1', value: 2, active: false }, // warning state
    { source: 'veronica', target: 'sat2', value: 2, active: true },
    { source: 'sec1', target: 'net1', value: 2, active: true },
    { source: 'arc', target: 'armor1', value: 3, active: true },
    { source: 'db1', target: 'veronica', value: 2, active: true },
  ];

  return { nodes, links };
};

const HolographicNode = ({ node, onClick }) => {
  const outerRef = useRef();
  const innerRef = useRef();
  const ringRef = useRef();
  
  const isCore = node.type === 'core';
  const isWarning = node.status === 'warning';
  
  // Stark aesthetic colors
  const baseColor = isWarning ? '#eab308' : (isCore ? '#06b6d4' : '#3b82f6');
  const glowColor = isWarning ? '#fef08a' : (isCore ? '#a5f3fc' : '#93c5fd');
  const size = isCore ? 4 : 2.5;

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (outerRef.current) {
      outerRef.current.rotation.x = time * 0.2;
      outerRef.current.rotation.y = time * 0.3;
    }
    if (innerRef.current) {
      innerRef.current.rotation.y = -time * 0.5;
      innerRef.current.position.y = Math.sin(time * 2) * 0.5; // Slight hover
    }
    if (ringRef.current) {
      ringRef.current.rotation.x = Math.PI / 2;
      ringRef.current.rotation.z = time * 0.5;
    }
  });

  return (
    <group position={[node.x, node.y, node.z]} onClick={() => onClick(node)}>
      {/* HTML HUD Label floating next to node */}
      <Html distanceFactor={15} position={[0, size + 4, 0]} center zIndexRange={[100, 0]}>
        <div 
          className="hud-panel-angled text-[10px] sm:text-xs font-mono tracking-widest px-3 py-1.5 whitespace-nowrap bg-stark-darker/90 backdrop-blur-md cursor-pointer hover:bg-arc-900/90 transition-all duration-300"
          style={{ 
            color: glowColor, 
            borderColor: baseColor,
            borderWidth: '1px',
            borderStyle: 'solid',
            boxShadow: `0 0 15px ${baseColor}40 inset`
          }}
        >
          <div className="flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full ${isWarning ? 'bg-yellow-400 animate-pulse shadow-[0_0_8px_#facc15]' : 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]'}`}></span>
            {node.name}
          </div>
        </div>
      </Html>

      {/* Inner Solid Core */}
      <mesh ref={innerRef}>
        <icosahedronGeometry args={[size * 0.6, 1]} />
        <meshStandardMaterial 
          color={glowColor} 
          emissive={glowColor} 
          emissiveIntensity={isWarning ? 0.8 : 0.6} 
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Outer Wireframe Shield */}
      <mesh ref={outerRef}>
        <icosahedronGeometry args={[size, 2]} />
        <meshBasicMaterial 
          color={baseColor} 
          wireframe={true} 
          transparent={true} 
          opacity={0.25} 
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Data Ring for Core */}
      {isCore && (
        <mesh ref={ringRef}>
          <torusGeometry args={[size * 1.8, 0.05, 32, 64]} />
          <meshBasicMaterial 
            color="#22d3ee" 
            transparent 
            opacity={0.7} 
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}
      
      {/* Subtle surrounding glow sphere */}
      <mesh>
        <sphereGeometry args={[size * 1.4, 32, 32]} />
        <meshBasicMaterial 
          color={baseColor} 
          transparent={true} 
          opacity={0.08}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};

const DataFlowLink = ({ link, nodes }) => {
  const sourceNode = nodes.find(n => n.id === link.source);
  const targetNode = nodes.find(n => n.id === link.target);
  
  if (!sourceNode || !targetNode) return null;
  
  const start = new THREE.Vector3(sourceNode.x, sourceNode.y, sourceNode.z);
  const end = new THREE.Vector3(targetNode.x, targetNode.y, targetNode.z);
  
  // Calculate mid point with an offset to create a curved trajectory
  const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
  const distance = start.distanceTo(end);
  mid.y += distance * 0.2; // Curve upwards slightly based on distance
  
  const color = link.active ? '#06b6d4' : '#64748b'; // Cyan vs Gray
  const lineMaterialRef = useRef();
  
  // Animate the dash offset to simulate data packet flow
  useFrame(() => {
    if (lineMaterialRef.current && link.active) {
      lineMaterialRef.current.dashOffset -= 0.05;
    }
  });

  return (
    <QuadraticBezierLine
      start={start}
      end={end}
      mid={mid}
      color={color}
      lineWidth={1.5}
      transparent
      opacity={link.active ? 0.6 : 0.2}
      dashed={true}
      dashScale={distance * 0.2}
      dashSize={2}
      dashOffset={0}
      ref={lineMaterialRef}
    />
  );
};

const BackgroundParticles = () => {
  return (
    <Stars 
      radius={300} 
      depth={50} 
      count={1500} 
      factor={4} 
      saturation={0} 
      fade 
      speed={1} 
    />
  );
};

const Scene = ({ onNodeClick, nodes, links }) => {
  const { camera, scene } = useThree();
  const groupRef = useRef();

  useEffect(() => {
    // Initial cinematic camera position
    camera.position.set(0, 80, 350);
    camera.lookAt(0, 0, 0);
    
    // Very dark blue/black Stark aesthetic background
    scene.background = new THREE.Color('#030712'); 
    scene.fog = new THREE.FogExp2('#030712', 0.0015);
    
    return () => {
      scene.background = null;
      scene.fog = null;
    };
  }, [camera, scene]);

  // Slow majestic rotation of the entire network
  useFrame(({ clock }) => {
    if (groupRef.current) {
      const time = clock.getElapsedTime();
      groupRef.current.rotation.y = Math.sin(time * 0.05) * 0.3;
      groupRef.current.position.y = Math.cos(time * 0.1) * 5;
    }
  });

  return (
    <>
      <ambientLight intensity={0.2} color="#06b6d4" />
      <pointLight position={[150, 150, 150]} intensity={1.5} color="#22d3ee" distance={800} />
      <pointLight position={[-150, -100, -150]} intensity={0.5} color="#818cf8" distance={800} />
      
      <group ref={groupRef}>
        {links.map((link, index) => (
          <DataFlowLink key={index} link={link} nodes={nodes} />
        ))}

        {nodes.map((node) => (
          <HolographicNode key={node.id} node={node} onClick={onNodeClick} />
        ))}
      </group>

      <BackgroundParticles />
    </>
  );
};

const NetworkGraph3D = () => {
  const [hoveredNode, setHoveredNode] = useState(null);
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      // Simulate slight initialization delay for effect
      const timer = setTimeout(() => {
        const data = generateGraphData();
        setGraphData(data);
        setIsLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    } catch (err) {
      console.error('Error initializing graph data:', err);
      setError('J.A.R.V.I.S: Failed to load network topology overlay.');
      setIsLoading(false);
    }
  }, []);

  const handleNodeClick = (node) => {
    setHoveredNode(node);
  };

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#030712]">
        <div className="text-center p-6 rounded-lg bg-red-900/10 border border-red-500/30 hud-panel-angled backdrop-blur-md">
          <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-3" />
          <p className="text-red-400 font-mono text-sm tracking-widest">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-2 text-xs font-mono tracking-widest text-red-300 border border-red-500/50 hover:bg-red-500/20 transition-colors uppercase"
          >
            Reboot Subsystem
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#030712]">
        <div className="flex flex-col items-center">
          <Loader2 className="w-10 h-10 animate-spin text-arc-500 mb-4" />
          <p className="text-sm text-arc-400 font-mono tracking-widest animate-pulse uppercase">
            Initializing Holographic Grid...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-[#030712] overflow-hidden">
      {/* Stark Aesthetic UI Overlays */}
      
      {/* Top Left Stats */}
      <div className="absolute top-6 left-6 z-10 hud-panel-angled bg-stark-darker/60 text-white p-4 backdrop-blur-md border border-arc-500/30 shadow-[0_0_20px_rgba(6,182,212,0.15)] pointer-events-none">
        <div className="font-mono text-[10px] text-arc-400 tracking-widest uppercase mb-2 flex items-center gap-2">
          <Radio size={14} />
          Network Topology
        </div>
        <div className="grid grid-cols-2 gap-4 mt-3 font-mono text-xs">
          <div>
            <div className="text-white/40 mb-1">NODES</div>
            <div className="text-xl text-arc-100">{graphData.nodes.length}</div>
          </div>
          <div>
            <div className="text-white/40 mb-1">UPLINKS</div>
            <div className="text-xl text-arc-100">{graphData.links.length}</div>
          </div>
        </div>
      </div>
      
      {/* Hover Info Panel (Bottom Center) */}
      <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 transition-all duration-300 ${hoveredNode ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        {hoveredNode && (
          <div className="hud-panel-angled bg-stark-darker/80 text-white px-8 py-4 backdrop-blur-md border border-arc-400/50 shadow-[0_0_30px_rgba(6,182,212,0.2)] text-center min-w-[300px]">
            <div className="text-arc-400 font-mono text-xs tracking-widest uppercase mb-1">Target Acquired</div>
            <div className="font-bold text-lg tracking-wider text-white mb-2">{hoveredNode.name}</div>
            
            <div className="flex items-center justify-center gap-4 mt-2 font-mono text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-white/40">TYPE:</span>
                <span className="text-arc-300">{hoveredNode.type.toUpperCase()}</span>
              </div>
              <div className="w-px h-3 bg-white/20"></div>
              <div className="flex items-center gap-1.5">
                <span className="text-white/40">STAT:</span>
                <span className={hoveredNode.status === 'online' ? 'text-green-400' : 'text-yellow-400'}>
                  {hoveredNode.status.toUpperCase()}
                </span>
              </div>
            </div>
            
            <button 
              className="mt-4 w-full py-1.5 border border-arc-500/30 text-arc-300 font-mono text-[10px] tracking-widest hover:bg-arc-500/20 transition-colors uppercase pointer-events-auto"
              onClick={() => setHoveredNode(null)}
            >
              Deselect
            </button>
          </div>
        )}
      </div>

      {/* Decorative Grid Lines */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:40px_40px] mix-blend-screen opacity-50 z-0"></div>
      
      {/* Top and Bottom cinematic borders */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-arc-500/50 to-transparent z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-arc-500/50 to-transparent z-10 pointer-events-none"></div>

      {/* 3D Canvas */}
      <Canvas
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 2]} // Optimize for high DPI displays
      >
        <Suspense fallback={null}>
          <Scene 
            nodes={graphData.nodes} 
            links={graphData.links} 
            onNodeClick={handleNodeClick} 
          />
          <OrbitControls 
            enableZoom={true}
            enablePan={false}
            enableRotate={true}
            zoomSpeed={0.8}
            rotateSpeed={0.6}
            minDistance={100}
            maxDistance={800}
            autoRotate={true}
            autoRotateSpeed={0.3}
            maxPolarAngle={Math.PI / 1.5} // Restrict camera from going completely under
            minPolarAngle={Math.PI / 4}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default NetworkGraph3D;
