import { Canvas, type ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { ProjectRecord } from "../../types/project";
import type { CabinetPhase } from "./types";

interface MuseumCanvasProps {
  projects: ProjectRecord[];
  wingId: string;
  phase: CabinetPhase;
  mobile: boolean;
  lowQuality: boolean;
  onSelectProject: (project: ProjectRecord) => void;
  onContextLost: () => void;
}

interface Placement {
  position: [number, number, number];
  rotationY: number;
}

function createPlacements(count: number): Placement[] {
  return Array.from({ length: count }, (_, index) => {
    const side = index % 2 === 0 ? -1 : 1;
    const row = Math.floor(index / 2);
    return {
      position: [side * 5.15, 0, -1.2 - row * 3.2],
      rotationY: 0,
    };
  });
}

function Exhibits({
  projects,
  placements,
  onSelectProject,
}: {
  projects: ProjectRecord[];
  placements: Placement[];
  onSelectProject: (project: ProjectRecord) => void;
}) {
  const plinths = useRef<THREE.InstancedMesh>(null);
  const frames = useRef<THREE.InstancedMesh>(null);
  const plaques = useRef<THREE.InstancedMesh>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  useLayoutEffect(() => {
    const matrix = new THREE.Matrix4();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3(1, 1, 1);
    for (let index = 0; index < placements.length; index += 1) {
      const placement = placements[index];
      if (!placement) continue;
      quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), placement.rotationY);

      matrix.compose(new THREE.Vector3(...placement.position).add(new THREE.Vector3(0, 0.38, 0)), quaternion, scale);
      plinths.current?.setMatrixAt(index, matrix);
      matrix.compose(new THREE.Vector3(...placement.position).add(new THREE.Vector3(0, 2.05, 0)), quaternion, scale);
      frames.current?.setMatrixAt(index, matrix);
      matrix.compose(new THREE.Vector3(...placement.position).add(new THREE.Vector3(0, 1.04, 0)), quaternion, scale);
      plaques.current?.setMatrixAt(index, matrix);
    }
    for (const mesh of [plinths.current, frames.current, plaques.current]) {
      if (!mesh) continue;
      mesh.instanceMatrix.setUsage(THREE.StaticDrawUsage);
      mesh.instanceMatrix.needsUpdate = true;
      mesh.computeBoundingSphere();
    }
  }, [placements]);

  useEffect(() => {
    document.body.style.cursor = hovered === null ? "" : "pointer";
    return () => { document.body.style.cursor = ""; };
  }, [hovered]);

  function select(event: ThreeEvent<MouseEvent>) {
    event.stopPropagation();
    if (event.instanceId === undefined) return;
    const project = projects[event.instanceId];
    if (project) onSelectProject(project);
  }

  function hover(event: ThreeEvent<PointerEvent>) {
    event.stopPropagation();
    setHovered(event.instanceId ?? null);
  }

  return (
    <group>
      <instancedMesh ref={plinths} args={[undefined, undefined, projects.length]} onClick={select} onPointerMove={hover} onPointerOut={() => setHovered(null)}>
        <boxGeometry args={[1.05, 0.72, 2.18]} />
        <meshStandardMaterial color="#253f35" roughness={0.6} metalness={0.08} />
      </instancedMesh>
      <instancedMesh ref={frames} args={[undefined, undefined, projects.length]} onClick={select} onPointerMove={hover} onPointerOut={() => setHovered(null)}>
        <boxGeometry args={[0.2, 1.62, 2.22]} />
        <meshStandardMaterial color="#171815" roughness={0.44} metalness={0.12} />
      </instancedMesh>
      <instancedMesh ref={plaques} args={[undefined, undefined, projects.length]} onClick={select} onPointerMove={hover} onPointerOut={() => setHovered(null)}>
        <boxGeometry args={[0.25, 0.32, 1.58]} />
        <meshStandardMaterial color={hovered === null ? "#ad8548" : "#d2b36f"} roughness={0.24} metalness={0.72} />
      </instancedMesh>
    </group>
  );
}

function ParquetFloor({ depth }: { depth: number }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const columns = 14;
  const rows = Math.max(30, Math.ceil(depth / 0.36));
  const count = columns * rows;

  useLayoutEffect(() => {
    const matrix = new THREE.Matrix4();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3(1, 1, 1);
    const colors = [new THREE.Color("#4a3023"), new THREE.Color("#654630"), new THREE.Color("#745139")];
    const columnWidth = 11.2 / columns;
    const rowDepth = depth / rows;

    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        const index = row * columns + column;
        const x = -5.6 + (column + 0.5) * columnWidth;
        const z = 5 - (row + 0.5) * rowDepth;
        quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), (row + column) % 2 === 0 ? Math.PI / 4 : -Math.PI / 4);
        matrix.compose(new THREE.Vector3(x, 0.045, z), quaternion, scale);
        mesh.current?.setMatrixAt(index, matrix);
        const color = colors[(row * 3 + column) % colors.length];
        if (color) mesh.current?.setColorAt(index, color);
      }
    }
    if (!mesh.current) return;
    mesh.current.instanceMatrix.setUsage(THREE.StaticDrawUsage);
    mesh.current.instanceMatrix.needsUpdate = true;
    if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true;
    mesh.current.computeBoundingSphere();
  }, [columns, depth, rows]);

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]} receiveShadow>
      <boxGeometry args={[0.68, 0.025, 0.14]} />
      <meshPhysicalMaterial vertexColors roughness={0.28} metalness={0.03} clearcoat={0.48} clearcoatRoughness={0.22} />
    </instancedMesh>
  );
}

function ClassicalHall({ depth, lowQuality }: { depth: number; lowQuality: boolean }) {
  const columns = useRef<THREE.InstancedMesh>(null);
  const lattice = useRef<THREE.InstancedMesh>(null);
  const columnPositions = useMemo(() => {
    const rows = Math.max(4, Math.floor(depth / 4));
    return Array.from({ length: rows * 2 }, (_, index) => {
      const side = index % 2 === 0 ? -1 : 1;
      const row = Math.floor(index / 2);
      return new THREE.Vector3(side * 5.62, 2.55, 3 - row * 4);
    });
  }, [depth]);

  const latticeTransforms = useMemo(() => {
    const transforms: Array<{ position: THREE.Vector3; scale: THREE.Vector3; rotationZ: number }> = [];
    for (const side of [-1, 1]) {
      for (let index = 0; index < 7; index += 1) {
        transforms.push({
          position: new THREE.Vector3(side * (2.8 + index * 0.28), 2.35, 4.55),
          scale: new THREE.Vector3(1, 1, 1),
          rotationZ: 0,
        });
      }
      for (let index = 0; index < 4; index += 1) {
        transforms.push({
          position: new THREE.Vector3(side * 3.65, 1.4 + index * 0.58, 4.55),
          scale: new THREE.Vector3(0.92, 1, 1),
          rotationZ: Math.PI / 2,
        });
      }
    }
    return transforms;
  }, []);

  useLayoutEffect(() => {
    const matrix = new THREE.Matrix4();
    for (let index = 0; index < columnPositions.length; index += 1) {
      const position = columnPositions[index];
      if (!position) continue;
      matrix.makeTranslation(position.x, position.y, position.z);
      columns.current?.setMatrixAt(index, matrix);
    }
    columns.current?.instanceMatrix.setUsage(THREE.StaticDrawUsage);
    if (columns.current) {
      columns.current.instanceMatrix.needsUpdate = true;
      columns.current.computeBoundingSphere();
    }

    for (let index = 0; index < latticeTransforms.length; index += 1) {
      const transform = latticeTransforms[index];
      if (!transform) continue;
      const rotation = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), transform.rotationZ);
      matrix.compose(transform.position, rotation, transform.scale);
      lattice.current?.setMatrixAt(index, matrix);
    }
    lattice.current?.instanceMatrix.setUsage(THREE.StaticDrawUsage);
    if (lattice.current) {
      lattice.current.instanceMatrix.needsUpdate = true;
      lattice.current.computeBoundingSphere();
    }
  }, [columnPositions, latticeTransforms]);

  const centerZ = 5 - depth / 2;
  const backZ = 5 - depth;

  return (
    <group>
      <mesh position={[0, -0.03, centerZ]} receiveShadow={!lowQuality}>
        <boxGeometry args={[12, 0.12, depth]} />
        <meshPhysicalMaterial color="#342219" roughness={0.2} metalness={0.04} clearcoat={0.62} clearcoatRoughness={0.18} />
      </mesh>
      <ParquetFloor depth={depth} />
      <mesh position={[-5.92, 2.8, centerZ]}>
        <boxGeometry args={[0.28, 5.6, depth]} />
        <meshStandardMaterial color="#efe8d8" roughness={0.82} />
      </mesh>
      <mesh position={[5.92, 2.8, centerZ]}>
        <boxGeometry args={[0.28, 5.6, depth]} />
        <meshStandardMaterial color="#efe8d8" roughness={0.82} />
      </mesh>
      <mesh position={[0, 2.8, backZ]}>
        <boxGeometry args={[12, 5.6, 0.28]} />
        <meshStandardMaterial color="#e9e0ce" roughness={0.84} />
      </mesh>
      <mesh position={[0, 5.64, centerZ]}>
        <boxGeometry args={[12, 0.16, depth]} />
        <meshStandardMaterial color="#e6decd" roughness={0.9} />
      </mesh>

      <instancedMesh ref={columns} args={[undefined, undefined, columnPositions.length]} castShadow={!lowQuality}>
        <cylinderGeometry args={[0.22, 0.3, 5.1, lowQuality ? 10 : 16]} />
        <meshStandardMaterial color="#d8ceba" roughness={0.62} />
      </instancedMesh>

      <instancedMesh ref={lattice} args={[undefined, undefined, latticeTransforms.length]}>
        <boxGeometry args={[0.08, 2.6, 0.08]} />
        <meshStandardMaterial color="#4a2920" roughness={0.58} />
      </instancedMesh>

      <mesh position={[0, 2.58, backZ + 0.16]}>
        <torusGeometry args={[1.65, 0.22, lowQuality ? 10 : 16, lowQuality ? 36 : 64]} />
        <meshStandardMaterial color="#315b4d" roughness={0.5} metalness={0.06} />
      </mesh>
      <mesh position={[0, 0.1, backZ + 0.1]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.42, 1.7, lowQuality ? 36 : 64]} />
        <meshStandardMaterial color="#ad8548" roughness={0.32} metalness={0.56} />
      </mesh>
    </group>
  );
}

function CameraRig({ phase, depth, mobile, resetKey }: { phase: CabinetPhase; depth: number; mobile: boolean; resetKey: string }) {
  const { camera, gl } = useThree();
  const guidedTime = useRef(0);
  const keys = useRef(new Set<string>());
  const euler = useRef(new THREE.Euler(0, 0, 0, "YXZ"));
  const forward = useMemo(() => new THREE.Vector3(), []);
  const right = useMemo(() => new THREE.Vector3(), []);
  const move = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    camera.position.set(0, 1.72, 4.3);
    camera.lookAt(0, 1.55, -2.5);
    guidedTime.current = 0;
  }, [camera, resetKey]);

  useEffect(() => {
    if (phase !== "free" || mobile) return undefined;
    const canvas = gl.domElement;
    const pressedKeys = keys.current;

    function keyDown(event: KeyboardEvent) {
      if (["KeyW", "KeyA", "KeyS", "KeyD", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.code)) {
        event.preventDefault();
        pressedKeys.add(event.code);
      }
    }
    function keyUp(event: KeyboardEvent) { pressedKeys.delete(event.code); }
    function mouseMove(event: MouseEvent) {
      if (document.pointerLockElement !== canvas) return;
      euler.current.setFromQuaternion(camera.quaternion);
      euler.current.y -= event.movementX * 0.0018;
      euler.current.x -= event.movementY * 0.0018;
      euler.current.x = THREE.MathUtils.clamp(euler.current.x, -Math.PI / 2.4, Math.PI / 2.4);
      camera.quaternion.setFromEuler(euler.current);
    }

    window.addEventListener("keydown", keyDown, { passive: false });
    window.addEventListener("keyup", keyUp);
    document.addEventListener("mousemove", mouseMove);
    return () => {
      pressedKeys.clear();
      window.removeEventListener("keydown", keyDown);
      window.removeEventListener("keyup", keyUp);
      document.removeEventListener("mousemove", mouseMove);
    };
  }, [camera, gl, mobile, phase]);

  useFrame((_, delta) => {
    if (phase === "guided") {
      guidedTime.current += Math.min(delta, 0.05);
      const travel = Math.max(2, depth - 11);
      const cycle = (guidedTime.current * (mobile ? 0.045 : 0.06)) % 2;
      const progress = cycle <= 1 ? cycle : 2 - cycle;
      const eased = progress * progress * (3 - 2 * progress);
      const targetZ = 4.3 - travel * eased;
      camera.position.lerp(new THREE.Vector3(Math.sin(guidedTime.current * 0.22) * 0.5, 1.72, targetZ), 0.035);
      camera.lookAt(0, 1.5, targetZ - 4.4);
      return;
    }

    if (phase !== "free" || mobile) return;
    const speed = 3.15 * Math.min(delta, 0.05);
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();
    right.crossVectors(forward, camera.up).normalize();
    move.set(0, 0, 0);
    if (keys.current.has("KeyW") || keys.current.has("ArrowUp")) move.add(forward);
    if (keys.current.has("KeyS") || keys.current.has("ArrowDown")) move.sub(forward);
    if (keys.current.has("KeyD") || keys.current.has("ArrowRight")) move.add(right);
    if (keys.current.has("KeyA") || keys.current.has("ArrowLeft")) move.sub(right);
    if (move.lengthSq() > 0) camera.position.add(move.normalize().multiplyScalar(speed));
    camera.position.x = THREE.MathUtils.clamp(camera.position.x, -4.8, 4.8);
    camera.position.y = 1.72;
    camera.position.z = THREE.MathUtils.clamp(camera.position.z, 7 - depth, 4.8);
  });

  return null;
}

function ContextMonitor({ onContextLost }: { onContextLost: () => void }) {
  const { gl } = useThree();
  useEffect(() => {
    const canvas = gl.domElement;
    function lost(event: Event) {
      event.preventDefault();
      onContextLost();
    }
    canvas.addEventListener("webglcontextlost", lost, false);
    return () => canvas.removeEventListener("webglcontextlost", lost, false);
  }, [gl, onContextLost]);
  return null;
}

function AdaptivePixelRatio({ mobile }: { mobile: boolean }) {
  const setDpr = useThree((state) => state.setDpr);
  const cap = mobile ? 1.25 : 1.5;
  const ratio = useRef(Math.min(window.devicePixelRatio || 1, cap));
  const sample = useRef({ frames: 0, seconds: 0 });

  useFrame((_, delta) => {
    sample.current.frames += 1;
    sample.current.seconds += Math.min(delta, 0.1);
    if (sample.current.seconds < 2) return;

    const fps = sample.current.frames / sample.current.seconds;
    const lowerTarget = mobile ? 27 : 45;
    const upperTarget = mobile ? 46 : 57;
    let next = ratio.current;
    if (fps < lowerTarget) next = Math.max(1, next - 0.15);
    else if (fps > upperTarget) next = Math.min(cap, next + 0.1);
    next = Math.round(next * 20) / 20;
    if (next !== ratio.current) {
      ratio.current = next;
      setDpr(next);
    }
    sample.current = { frames: 0, seconds: 0 };
  });

  return null;
}

function PerformanceTelemetry() {
  const { gl } = useThree();
  const sample = useRef({ frames: 0, seconds: 0 });

  useEffect(() => {
    const canvas = gl.domElement;
    canvas.dataset.cabinetMetrics = "sampling";
    return () => {
      delete canvas.dataset.cabinetMetrics;
      delete canvas.dataset.cabinetCalls;
      delete canvas.dataset.cabinetTriangles;
      delete canvas.dataset.cabinetTextures;
      delete canvas.dataset.cabinetDpr;
      delete canvas.dataset.cabinetFps;
    };
  }, [gl]);

  useFrame((_, delta) => {
    sample.current.frames += 1;
    sample.current.seconds += Math.min(delta, 0.1);
    if (sample.current.seconds < 1) return;

    const canvas = gl.domElement;
    canvas.dataset.cabinetMetrics = "ready";
    canvas.dataset.cabinetCalls = String(gl.info.render.calls);
    canvas.dataset.cabinetTriangles = String(gl.info.render.triangles);
    canvas.dataset.cabinetTextures = String(gl.info.memory.textures);
    canvas.dataset.cabinetDpr = gl.getPixelRatio().toFixed(2);
    canvas.dataset.cabinetFps = (sample.current.frames / sample.current.seconds).toFixed(1);
    sample.current = { frames: 0, seconds: 0 };
  });

  return null;
}

function Museum({ projects, wingId, phase, mobile, lowQuality, onSelectProject, onContextLost }: MuseumCanvasProps) {
  const placements = useMemo(() => createPlacements(projects.length), [projects.length]);
  const depth = Math.max(24, Math.ceil(projects.length / 2) * 3.2 + 11);

  return (
    <>
      <color attach="background" args={["#10130f"]} />
      <fog attach="fog" args={["#10130f", 16, Math.max(38, depth * 0.9)]} />
      <ambientLight intensity={lowQuality ? 1.25 : 0.86} color="#f6ead4" />
      <hemisphereLight args={["#fff4df", "#1f4036", lowQuality ? 1.5 : 1.05]} />
      <directionalLight position={[2, 7, 5]} intensity={lowQuality ? 1.5 : 2.2} color="#fff2cf" castShadow={!lowQuality} shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
      <pointLight position={[0, 3.8, 1]} intensity={18} distance={18} color="#ad8548" />
      <pointLight position={[0, 3.8, 7 - depth]} intensity={16} distance={16} color="#315b4d" />
      <ClassicalHall depth={depth} lowQuality={lowQuality} />
      <Exhibits projects={projects} placements={placements} onSelectProject={onSelectProject} />
      <CameraRig phase={phase} depth={depth} mobile={mobile} resetKey={wingId} />
      <AdaptivePixelRatio mobile={mobile} />
      <PerformanceTelemetry />
      <ContextMonitor onContextLost={onContextLost} />
    </>
  );
}

export default function MuseumCanvas(props: MuseumCanvasProps) {
  const dpr: [number, number] = props.mobile ? [1, 1.25] : [1, 1.5];
  return (
    <Canvas
      dpr={dpr}
      frameloop={props.phase === "project-modal" ? "demand" : "always"}
      camera={{ fov: props.mobile ? 64 : 58, near: 0.1, far: 220, position: [0, 1.72, 4.3] }}
      gl={{
        antialias: !props.lowQuality,
        alpha: false,
        powerPreference: props.mobile ? "low-power" : "high-performance",
        stencil: false,
        depth: true,
      }}
      shadows={!props.lowQuality}
      onPointerMissed={() => { document.body.style.cursor = ""; }}
    >
      <Museum {...props} />
    </Canvas>
  );
}
