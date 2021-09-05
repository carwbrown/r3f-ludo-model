import React, { useState } from "react";
import { Canvas, useFrame, useThree } from "react-three-fiber";
import { Physics, useSphere, useBox, usePlane } from "@react-three/cannon";
import { Html } from "@react-three/drei";
import "./index.css";

const Ball = ({ resetScore }) => {
  const { viewport } = useThree();
  const [ref, api] = useSphere(() => ({
    args: 0.5,
    mass: 0.1,
    position: [0, 0, 0],
  }));

  usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, -viewport.height, 0],
    onCollide: () => {
      api.position.set(0, 0, 0);
      api.velocity.set(0, 0, 0);
      resetScore();
    },
  }));

  return (
    <mesh ref={ref}>
      <sphereBufferGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color="white" />
    </mesh>
  );
};

const Wall = () => {
  const { viewport } = useThree();
  const [ref] = usePlane(() => ({
    args: [1, viewport.height],
    rotation: [0, -Math.PI / 2, 0],
    position: [viewport.width / 2, 0, 0],
  }));

  return (
    <mesh ref={ref}>
      <planeBufferGeometry attach="geometry" args={[1, viewport.height + 2]} />
      <meshPhongMaterial attach="material" color="black" opacity={0.5} />
    </mesh>
  );
};

const Wall2 = () => {
  const { viewport } = useThree();
  const [ref] = usePlane(() => ({
    args: [1, viewport.height],
    rotation: [0, Math.PI / 2, 0],
    position: [-viewport.width / 2, 0, 0],
  }));

  return (
    <mesh ref={ref}>
      <planeBufferGeometry attach="geometry" args={[1, 60]} />
      <meshPhongMaterial attach="material" color="black" opacity={0.5} />
    </mesh>
  );
};

const Ceiling = () => {
  const { viewport } = useThree();
  const [ref] = usePlane(() => ({
    rotation: [Math.PI / 2, 0, 0],
    position: [0, viewport.height / 2, 0],
  }));

  return (
    <mesh ref={ref}>
      <planeBufferGeometry attach="geometry" args={[viewport.width, 2]} />
      <meshPhongMaterial attach="material" color="black" opacity={0.5} />
    </mesh>
  );
};

const Paddle = () => {
  const [ref, api] = useBox(() => ({ args: [2, 0.5, 1] }));

  useFrame((state) => {
    api.position.set(
      (state.mouse.x * state.viewport.width) / 2,
      -state.viewport.height / 2 + 1,
      0,
    );
    api.rotation.set(0, 0, (state.mouse.x * Math.PI) / 5);
  });

  return (
    <mesh ref={ref}>
      <boxBufferGeometry args={[2, 0.5, 1]} />
      <meshStandardMaterial color="lightblue" />
    </mesh>
  );
};

const Enemy = ({ color, args = [2, 0.5, 1], setScore, ...props }) => {
  const [ref, api] = useBox(() => ({
    args,
    ...props,
    onCollide: () => {
      api.position.set([0, 0, 0]);
      setScore();
    },
  }));
  return (
    <mesh ref={ref}>
      <boxBufferGeometry args={args} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

const useScore = (startScore = 0) => {
  const [score, setScore] = useState(startScore);
  const incrementScore = () => setScore((score) => score + 1);
  const resetScore = () => setScore(() => 0);
  return [score, incrementScore, resetScore];
};

function App() {
  const [score, incrementScore, resetScore] = useScore(0);

  return (
    <Canvas camera={{ position: [0, 0, 20], fov: 50 }}>
      <Html prepend distanceFactor={10}>
        <div className="score">{score}</div>
      </Html>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 5]} />
      <pointLight position={[-10, -10, -5]} />
      <Physics
        gravity={[0, -30, 0]}
        defaultContactMaterial={{ restitution: 1.1 }}
      >
        <Wall />
        <Wall2 />
        <Ceiling />
        <Ball resetScore={resetScore} />
        <Paddle />
        <Enemy color="orange" position={[2, 1, 0]} setScore={incrementScore} />
        <Enemy
          color="hotpink"
          position={[-2, 3, 0]}
          setScore={incrementScore}
        />
      </Physics>
    </Canvas>
  );
}

export default App;
