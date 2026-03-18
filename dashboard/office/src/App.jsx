import React, { useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Grid, Text } from '@react-three/drei'
import * as THREE from 'three'
import { CREW } from './data/crewConfig'
import useGatewayStatus from './data/useGatewayStatus'

const STATE_COLORS = {
  idle: '#44ff44',
  working: '#4488ff',
  thinking: '#ffdd00',
  offline: '#666666',
}

function AgentCharacter({ color, agentState, bodyRef }) {
  const charColor = agentState === 'offline' ? '#444444' : color
  const isSitting = agentState === 'working' || agentState === 'thinking'
  const bodyY = isSitting ? 1.1 : 1.6
  const bodyZ = isSitting ? 0.4 : 0.9

  return (
    <group>
      <mesh ref={bodyRef} position={[0, bodyY, bodyZ]} castShadow>
        <capsuleGeometry args={[0.22, 0.5, 8, 16]} />
        <meshStandardMaterial color={charColor} />
      </mesh>
      <mesh position={[0, bodyY + 0.6, bodyZ]} castShadow>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial color={charColor} />
      </mesh>
      {agentState === 'thinking' && (
        <Text
          position={[0, bodyY + 1.1, bodyZ]}
          fontSize={0.22}
          color="#ffdd00"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000"
        >
          ...
        </Text>
      )}
    </group>
  )
}

function AnimatedDesk({ agent, agentState, onClick }) {
  const bodyRef = useRef()
  const isSitting = agentState === 'working' || agentState === 'thinking'
  const monitorGlow = agentState === 'working' || agentState === 'thinking' ? 0.8 : agentState === 'offline' ? 0 : 0.1

  useFrame(({ clock }) => {
    if (bodyRef.current && isSitting) {
      const t = clock.getElapsedTime()
      bodyRef.current.position.y = 1.1 + Math.sin(t * 3 * Math.PI * 2) * 0.03
    }
  })

  const [x, , z] = agent.position

  return (
    <group position={[x, 0, z]} onClick={onClick}>
      {/* Desk surface */}
      <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 0.08, 1]} />
        <meshStandardMaterial color="#8B6914" />
      </mesh>
      {/* Desk legs */}
      {[[-0.85, 0.35, -0.4], [0.85, 0.35, -0.4], [-0.85, 0.35, 0.4], [0.85, 0.35, 0.4]].map(([lx, ly, lz], i) => (
        <mesh key={i} position={[lx, ly, lz]} castShadow>
          <boxGeometry args={[0.06, 0.7, 0.06]} />
          <meshStandardMaterial color="#6B4F10" />
        </mesh>
      ))}
      {/* Chair seat */}
      <mesh position={[0, 0.45, 0.9]} castShadow>
        <boxGeometry args={[0.7, 0.07, 0.7]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>
      {/* Chair back */}
      <mesh position={[0, 0.85, 1.2]} castShadow>
        <boxGeometry args={[0.7, 0.7, 0.07]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>
      {/* Chair legs */}
      {[[-0.3, 0.21, 0.6], [0.3, 0.21, 0.6], [-0.3, 0.21, 1.15], [0.3, 0.21, 1.15]].map(([lx, ly, lz], i) => (
        <mesh key={i} position={[lx, ly, lz]}>
          <boxGeometry args={[0.05, 0.42, 0.05]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
      ))}
      {/* Monitor */}
      <mesh position={[0, 1.1, -0.35]} castShadow>
        <boxGeometry args={[0.9, 0.55, 0.04]} />
        <meshStandardMaterial color="#111" emissive="#001133" emissiveIntensity={monitorGlow} />
      </mesh>
      {/* Monitor stand */}
      <mesh position={[0, 0.82, -0.35]}>
        <boxGeometry args={[0.08, 0.14, 0.04]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      {/* Agent character */}
      <AgentCharacter color={agent.color} agentState={agentState} bodyRef={bodyRef} />
      {/* Name label */}
      <Text
        position={[0, 2.8, 0.9]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000"
      >
        {agent.name}
      </Text>
    </group>
  )
}

function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial color="#1a1a2e" />
    </mesh>
  )
}

function CameraController({ focusedAgent, orbitRef }) {
  const { camera } = useThree()
  const targetPos = useRef(new THREE.Vector3(0, 8, 10))
  const targetLook = useRef(new THREE.Vector3(0, 0, 0))

  useFrame(() => {
    if (focusedAgent) {
      const agent = CREW.find((a) => a.name === focusedAgent)
      if (agent) {
        const [ax, , az] = agent.position
        targetPos.current.set(ax, 5, az + 7)
        targetLook.current.set(ax, 1, az)
      }
    } else {
      targetPos.current.set(0, 8, 10)
      targetLook.current.set(0, 0, 0)
    }
    camera.position.lerp(targetPos.current, 0.05)
    if (orbitRef.current) {
      orbitRef.current.target.lerp(targetLook.current, 0.05)
      orbitRef.current.update()
    }
  })

  return null
}

function StatusBar({ statuses }) {
  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: '44px',
      background: 'rgba(8, 8, 20, 0.92)',
      borderTop: '1px solid rgba(100,100,200,0.3)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 20px',
      gap: '20px',
      zIndex: 100,
      fontFamily: 'monospace',
      fontSize: '13px',
      backdropFilter: 'blur(4px)',
    }}>
      <span style={{ color: '#FFD700', fontWeight: 'bold' }}>??? STRAW HAT HQ</span>
      <span style={{ color: '#333' }}>|</span>
      {statuses.map((s) => (
        <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{
            width: '10px', height: '10px', borderRadius: '50%',
            background: STATE_COLORS[s.state] || '#666',
            boxShadow: `0 0 6px ${STATE_COLORS[s.state] || '#666'}`,
            display: 'inline-block',
            flexShrink: 0,
          }} />
          <span style={{ color: '#aaa' }}>{s.name}:</span>
          <span style={{ color: STATE_COLORS[s.state] || '#666', textTransform: 'capitalize' }}>{s.state}</span>
        </div>
      ))}
    </div>
  )
}

export default function App() {
  const [focused, setFocused] = useState(null)
  const orbitRef = useRef()
  const statuses = useGatewayStatus()

  function getState(name) {
    return statuses.find((s) => s.name === name)?.state || 'idle'
  }

  function handleDeskClick(name) {
    setFocused((prev) => (prev === name ? null : name))
  }

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', background: '#0a0a0f' }}>
      <Canvas
        shadows
        camera={{ position: [0, 8, 10], fov: 60 }}
        style={{ width: '100%', height: 'calc(100% - 44px)' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[5, 10, 5]}
          intensity={1.0}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <Floor />
        <Grid
          args={[20, 20]}
          position={[0, 0.001, 0]}
          cellSize={1}
          cellThickness={0.5}
          cellColor="#2a2a4a"
          sectionSize={5}
          sectionThickness={1}
          sectionColor="#3a3a6a"
          fadeDistance={30}
          fadeStrength={1}
          infiniteGrid={false}
        />
        {CREW.map((agent) => (
          <AnimatedDesk
            key={agent.name}
            agent={agent}
            agentState={getState(agent.name)}
            onClick={() => handleDeskClick(agent.name)}
          />
        ))}
        <OrbitControls ref={orbitRef} makeDefault enablePan={true} />
        <CameraController focusedAgent={focused} orbitRef={orbitRef} />
      </Canvas>

      {/* Top label */}
      <div style={{
        position: 'absolute',
        top: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(0,0,0,0.65)',
        color: '#fff',
        padding: '8px 20px',
        borderRadius: 8,
        fontFamily: 'monospace',
        fontSize: 14,
        backdropFilter: 'blur(4px)',
        border: '1px solid rgba(255,255,255,0.1)',
        pointerEvents: 'none',
      }}>
        {focused ? `Focused: ${focused}` : 'Overview ??? click a desk to focus'}
      </div>

      <StatusBar statuses={statuses} />
    </div>
  )
}
