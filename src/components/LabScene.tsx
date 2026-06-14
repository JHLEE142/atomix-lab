import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { Quaternion, Vector3 } from "three";
import type { Group } from "three";
import { getElement } from "../data/elements";
import { getMoleculeGeometry } from "../data/moleculeGeometry";
import type { MoleculeRecipe } from "../lib/chemistry";

type LabSceneProps = {
  selectedAtoms: string[];
  molecule: MoleculeRecipe | null;
};

export function LabScene({ selectedAtoms, molecule }: LabSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 3.2, 7], fov: 44 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
    >
      <color attach="background" args={["#070a12"]} />
      <ambientLight intensity={0.58} />
      <pointLight position={[4, 4, 4]} intensity={10} color="#a7f3d0" />
      <pointLight position={[-4, 2, -3]} intensity={6} color="#fb7185" />
      <Stars radius={18} depth={12} count={650} factor={2.1} fade speed={0.25} />
      {molecule ? <MoleculeModel molecule={molecule} /> : <LooseAtoms selectedAtoms={selectedAtoms} />}
      <OrbitControls enablePan={false} minDistance={3.4} maxDistance={10} autoRotate autoRotateSpeed={0.35} />
    </Canvas>
  );
}

function MoleculeModel({ molecule }: { molecule: MoleculeRecipe }) {
  const groupRef = useRef<Group>(null);
  const geometry = useMemo(() => getMoleculeGeometry(molecule), [molecule]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.35) * 0.35;
    groupRef.current.rotation.x = Math.cos(clock.elapsedTime * 0.22) * 0.12;
  });

  return (
    <group ref={groupRef}>
      {geometry.bonds.map(([startIndex, endIndex]) => (
        <Bond
          key={`${startIndex}-${endIndex}`}
          start={geometry.atoms[startIndex].position}
          end={geometry.atoms[endIndex].position}
        />
      ))}
      {geometry.atoms.map((atom, index) => (
        <AtomBall key={`${atom.symbol}-${index}`} symbol={atom.symbol} position={atom.position} scale={1.05} />
      ))}
    </group>
  );
}

function LooseAtoms({ selectedAtoms }: { selectedAtoms: string[] }) {
  const groupRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = clock.elapsedTime * 0.18;
  });

  if (selectedAtoms.length === 0) {
    return (
      <group>
        <mesh>
          <torusGeometry args={[1.25, 0.015, 10, 180]} />
          <meshBasicMaterial color="#67e8f9" transparent opacity={0.22} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.8, 0.01, 10, 180]} />
          <meshBasicMaterial color="#fb7185" transparent opacity={0.18} />
        </mesh>
      </group>
    );
  }

  const radius = selectedAtoms.length > 1 ? 1.7 : 0;

  return (
    <group ref={groupRef}>
      {selectedAtoms.map((symbol, index) => {
        const angle = (Math.PI * 2 * index) / selectedAtoms.length;
        const position: [number, number, number] = [
          Math.cos(angle) * radius,
          Math.sin(angle) * 0.35,
          Math.sin(angle) * radius
        ];

        return <AtomBall key={`${symbol}-${index}`} symbol={symbol} position={position} scale={0.92} />;
      })}
    </group>
  );
}

function AtomBall({
  symbol,
  position,
  scale
}: {
  symbol: string;
  position: [number, number, number];
  scale: number;
}) {
  const element = getElement(symbol);
  const radius = symbol === "H" ? 0.36 : symbol === "Na" || symbol === "Cl" ? 0.62 : 0.5;

  return (
    <group position={position} scale={scale}>
      <mesh>
        <sphereGeometry args={[radius, 36, 36]} />
        <meshStandardMaterial
          color={element.color}
          emissive={element.color}
          emissiveIntensity={0.35}
          roughness={0.32}
          metalness={0.1}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[radius * 1.22, 28, 28]} />
        <meshBasicMaterial color={element.color} transparent opacity={0.08} />
      </mesh>
    </group>
  );
}

function Bond({ start, end }: { start: [number, number, number]; end: [number, number, number] }) {
  const transform = useMemo(() => {
    const startVector = new Vector3(...start);
    const endVector = new Vector3(...end);
    const midpoint = startVector.clone().add(endVector).multiplyScalar(0.5);
    const direction = endVector.clone().sub(startVector);
    const length = direction.length();
    const quaternion = new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), direction.normalize());
    return { midpoint, length, quaternion };
  }, [start, end]);

  return (
    <mesh position={transform.midpoint} quaternion={transform.quaternion}>
      <cylinderGeometry args={[0.045, 0.045, transform.length, 18]} />
      <meshStandardMaterial color="#dbeafe" emissive="#67e8f9" emissiveIntensity={0.5} roughness={0.22} />
    </mesh>
  );
}
