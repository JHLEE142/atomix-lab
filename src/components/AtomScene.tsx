import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import type { Group, Mesh } from "three";
import type { ElementRecord } from "../data/elements";

type AtomSceneProps = {
  element: ElementRecord;
  showOrbitalCloud: boolean;
};

type Nucleon = {
  id: string;
  type: "proton" | "neutron";
  position: [number, number, number];
};

export function AtomScene({ element, showOrbitalCloud }: AtomSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 4.2, 6.4], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
    >
      <color attach="background" args={["#070a12"]} />
      <ambientLight intensity={0.55} />
      <pointLight position={[4, 5, 4]} intensity={12} color="#67e8f9" />
      <pointLight position={[-5, -1, -3]} intensity={5} color="#fb7185" />
      <Stars radius={18} depth={14} count={900} factor={2.4} fade speed={0.35} />
      <AtomModel element={element} showOrbitalCloud={showOrbitalCloud} />
      <OrbitControls enablePan={false} minDistance={3.4} maxDistance={9} autoRotate autoRotateSpeed={0.45} />
    </Canvas>
  );
}

function AtomModel({ element, showOrbitalCloud }: AtomSceneProps) {
  const groupRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = clock.elapsedTime * 0.1;
  });

  return (
    <group ref={groupRef}>
      <Nucleus element={element} />
      {element.shells.map((electronCount, shellIndex) => (
        <ElectronShell
          key={`${element.symbol}-${shellIndex}`}
          shellIndex={shellIndex}
          electronCount={electronCount}
          color={element.color}
          showOrbitalCloud={showOrbitalCloud}
        />
      ))}
    </group>
  );
}

function Nucleus({ element }: { element: ElementRecord }) {
  const nucleons = useMemo(() => createNucleons(element), [element]);

  return (
    <group>
      <mesh>
        <sphereGeometry args={[0.72, 36, 36]} />
        <meshBasicMaterial color={element.color} transparent opacity={0.08} />
      </mesh>
      {nucleons.map((nucleon) => (
        <mesh key={nucleon.id} position={nucleon.position}>
          <sphereGeometry args={[nucleon.type === "proton" ? 0.18 : 0.165, 24, 24]} />
          <meshStandardMaterial
            color={nucleon.type === "proton" ? "#fb7185" : "#93c5fd"}
            emissive={nucleon.type === "proton" ? "#7f1d1d" : "#1e3a8a"}
            emissiveIntensity={0.55}
            roughness={0.38}
            metalness={0.08}
          />
        </mesh>
      ))}
    </group>
  );
}

function ElectronShell({
  shellIndex,
  electronCount,
  color,
  showOrbitalCloud
}: {
  shellIndex: number;
  electronCount: number;
  color: string;
  showOrbitalCloud: boolean;
}) {
  const radius = 1.28 + shellIndex * 0.86;
  const tilt: [number, number, number] = [
    Math.PI / 2 + shellIndex * 0.22,
    shellIndex * 0.62,
    shellIndex * 0.36
  ];

  return (
    <group rotation={tilt}>
      <mesh>
        <torusGeometry args={[radius, 0.009, 10, 180]} />
        <meshBasicMaterial color="#67e8f9" transparent opacity={0.26} />
      </mesh>

      {showOrbitalCloud ? (
        <mesh>
          <sphereGeometry args={[radius, 48, 48]} />
          <meshBasicMaterial color={color} transparent opacity={0.045} wireframe />
        </mesh>
      ) : null}

      {Array.from({ length: electronCount }).map((_, electronIndex) => (
        <Electron
          key={`${shellIndex}-${electronIndex}`}
          electronIndex={electronIndex}
          electronCount={electronCount}
          radius={radius}
          shellIndex={shellIndex}
          color={color}
        />
      ))}
    </group>
  );
}

function Electron({
  electronIndex,
  electronCount,
  radius,
  shellIndex,
  color
}: {
  electronIndex: number;
  electronCount: number;
  radius: number;
  shellIndex: number;
  color: string;
}) {
  const meshRef = useRef<Mesh>(null);
  const trailRefs = useRef<Array<Mesh | null>>([]);
  const phase = (Math.PI * 2 * electronIndex) / electronCount;
  const speed = 0.78 + shellIndex * 0.18;

  useFrame(({ clock }) => {
    const angle = clock.elapsedTime * speed + phase;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;

    if (meshRef.current) {
      meshRef.current.position.set(x, y, 0);
    }

    trailRefs.current.forEach((trail, index) => {
      if (!trail) return;
      const trailAngle = angle - (index + 1) * 0.16;
      trail.position.set(Math.cos(trailAngle) * radius, Math.sin(trailAngle) * radius, 0);
    });
  });

  return (
    <group>
      {Array.from({ length: 4 }).map((_, index) => (
        <mesh
          key={index}
          ref={(instance) => {
            trailRefs.current[index] = instance;
          }}
        >
          <sphereGeometry args={[0.036 - index * 0.004, 12, 12]} />
          <meshBasicMaterial color={color} transparent opacity={0.28 - index * 0.05} />
        </mesh>
      ))}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.07, 22, 22]} />
        <meshStandardMaterial color="#e0f2fe" emissive={color} emissiveIntensity={1.2} roughness={0.2} />
      </mesh>
    </group>
  );
}

function createNucleons(element: ElementRecord): Nucleon[] {
  const total = element.atomicNumber + element.neutrons;
  const points = fibonacciSphere(total, Math.min(0.78, 0.28 + total * 0.012));

  return points.map((position, index) => ({
    id: `${index}`,
    type: index < element.atomicNumber ? "proton" : "neutron",
    position
  }));
}

function fibonacciSphere(count: number, radius: number): Array<[number, number, number]> {
  if (count === 1) return [[0, 0, 0]];

  return Array.from({ length: count }, (_, index) => {
    const y = 1 - (index / (count - 1)) * 2;
    const radial = Math.sqrt(1 - y * y);
    const theta = index * Math.PI * (3 - Math.sqrt(5));
    const x = Math.cos(theta) * radial;
    const z = Math.sin(theta) * radial;
    return [x * radius, y * radius, z * radius];
  });
}
