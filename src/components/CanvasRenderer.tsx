import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, ContactShadows, Float, Stars } from '@react-three/drei';
import * as THREE from 'three';

const CustomShaderMaterial = ({ isExplored, renderLimit }: { isExplored: boolean, renderLimit: number }) => {
  const shaderRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor1: { value: new THREE.Color('#00ffff') },
      uColor2: { value: new THREE.Color('#7a00ff') },
      uExplored: { value: 0 }, // 0 to 1 transition
      uLimit: { value: 0.5 },  // mapped from 0 to 1 scaling factor
    }),
    []
  );

  useFrame((state) => {
    if (shaderRef.current) {
      shaderRef.current.uniforms.uTime.value = state.clock.elapsedTime * 0.5;
      
      const targetExplored = isExplored ? 1.0 : 0.0;
      shaderRef.current.uniforms.uExplored.value += (targetExplored - shaderRef.current.uniforms.uExplored.value) * 0.05;
      
      const targetLimit = renderLimit / 100.0;
      shaderRef.current.uniforms.uLimit.value += (targetLimit - shaderRef.current.uniforms.uLimit.value) * 0.1;
    }
  });

  return (
    <mesh>
      <icosahedronGeometry args={[2, 64]} />
      <shaderMaterial
        ref={shaderRef}
        wireframe={true}
        uniforms={uniforms}
        vertexShader={`
          varying vec2 vUv;
          varying vec3 vPosition;
          uniform float uTime;
          uniform float uExplored;
          uniform float uLimit;
          
          vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
          vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
          vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
          vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

          float snoise(vec3 v) {
            const vec2  C = vec2(1.0/6.0, 1.0/3.0);
            const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

            vec3 i  = floor(v + dot(v, C.yyy));
            vec3 x0 = v - i + dot(i, C.xxx);

            vec3 g = step(x0.yzx, x0.xyz);
            vec3 l = 1.0 - g;
            vec3 i1 = min( g.xyz, l.zxy );
            vec3 i2 = max( g.xyz, l.zxy );

            vec3 x1 = x0 - i1 + C.xxx;
            vec3 x2 = x0 - i2 + C.yyy;
            vec3 x3 = x0 - D.yyy;

            i = mod289(i);
            vec4 p = permute( permute( permute(
                      i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                    + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
                    + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

            float n_ = 0.142857142857;
            vec3  ns = n_ * D.wyz - D.xzx;

            vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

            vec4 x_ = floor(j * ns.z);
            vec4 y_ = floor(j - 7.0 * x_ );

            vec4 x = x_ *ns.x + ns.yyyy;
            vec4 y = y_ *ns.x + ns.yyyy;
            vec4 h = 1.0 - abs(x) - abs(y);

            vec4 b0 = vec4( x.xy, y.xy );
            vec4 b1 = vec4( x.zw, y.zw );

            vec4 s0 = floor(b0)*2.0 + 1.0;
            vec4 s1 = floor(b1)*2.0 + 1.0;
            vec4 sh = -step(h, vec4(0.0));

            vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
            vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

            vec3 p0 = vec3(a0.xy,h.x);
            vec3 p1 = vec3(a0.zw,h.y);
            vec3 p2 = vec3(a1.xy,h.z);
            vec3 p3 = vec3(a1.zw,h.w);

            vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
            p0 *= norm.x;
            p1 *= norm.y;
            p2 *= norm.z;
            p3 *= norm.w;

            vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
            m = m * m;
            return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
          }

          void main() {
            vUv = uv;
            vec3 pos = position;
            
            // Limit controls how chaotic the geometry becomes once explored
            float dynamicLimit = 0.2 + (uLimit * 2.5);
            
            // Intensify noise and frequency based on slider and explore state
            float noiseFreq = 1.0 + uExplored * dynamicLimit;
            float noiseAmp = 0.6 + (uExplored * dynamicLimit);
            
            float noise = snoise(pos * noiseFreq + uTime * (0.4 + uExplored));
            pos = pos + normal * noise * noiseAmp;
            vPosition = pos;

            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `}
        fragmentShader={`
          varying vec2 vUv;
          varying vec3 vPosition;
          uniform float uTime;
          uniform vec3 uColor1;
          uniform vec3 uColor2;
          uniform float uExplored;
          uniform float uLimit;

          void main() {
            float depth = vPosition.z * 0.5 + 0.5;
            
            // The slider intensity mixes in extremely bright colors like bright red / white at 100%
            vec3 activeCol1 = mix(uColor1, mix(vec3(1.0, 0.2, 0.5), vec3(1.0, 0.0, 0.0), uLimit), uExplored); // Cyan -> Pink -> Red
            vec3 activeCol2 = mix(uColor2, mix(vec3(1.0, 0.8, 0.2), vec3(1.0, 1.0, 1.0), uLimit), uExplored); // Purple -> Yellow -> White
            
            vec3 color = mix(activeCol1, activeCol2, depth + sin(uTime * (1.0 + uExplored * uLimit * 3.0)) * 0.2);
            
            float glow = 1.0 - min(1.0, length(vPosition) * (0.35 - uExplored * 0.1));
            gl_FragColor = vec4(color + vec3(glow * (0.5 + uExplored * uLimit * 1.5)), smoothstep(0.0, 1.0, glow + 0.3));
          }
        `}
        transparent={true}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
};

const CameraAnimator = ({ isExplored, renderLimit }: { isExplored: boolean, renderLimit: number }) => {
  useFrame((state) => {
    // Zooms even closer based on the limit threshold
    const limitScale = renderLimit / 100.0;
    const targetZ = isExplored ? (4.5 - limitScale * 1.5) : 8;
    state.camera.position.z += (targetZ - state.camera.position.z) * 0.03;
    
    // Rotate scene faster based on slider
    const targetY = isExplored ? state.clock.elapsedTime * (0.2 + limitScale * 0.5) : 0;
    state.scene.rotation.y += (targetY - state.scene.rotation.y) * 0.05;
  });
  return null;
}

export default function CanvasRenderer({ isExplored, renderLimit }: { isExplored: boolean, renderLimit: number }) {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <fog attach="fog" args={['#030305', 5, 20]} />
        <ambientLight intensity={0.2} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#0ff" />
        
        <Stars 
          radius={100} depth={50} count={5000} factor={4} saturation={0} 
          fade speed={isExplored ? (3 + (renderLimit / 100) * 8) : 1} 
        />
        
        <Float speed={isExplored ? 4 : 2} rotationIntensity={isExplored ? 2 : 1} floatIntensity={1.5}>
          <CustomShaderMaterial isExplored={isExplored} renderLimit={renderLimit} />
        </Float>
        
        <CameraAnimator isExplored={isExplored} renderLimit={renderLimit} />

        <Environment preset="night" />
        <ContactShadows position={[0, -3.5, 0]} opacity={0.4} scale={20} blur={2} far={4} />
      </Canvas>
    </div>
  );
}
