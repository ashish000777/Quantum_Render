import { motion, AnimatePresence } from 'framer-motion';

interface OverlayProps {
  isExplored: boolean;
  onExplore: () => void;
  renderLimit: number;
  setRenderLimit: (val: number) => void;
}

export default function Overlay({ isExplored, onExplore, renderLimit, setRenderLimit }: OverlayProps) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 10,
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ 
          opacity: 1, 
          scale: 1, 
          y: isExplored ? -35 : 0 
        }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="glass"
        style={{
          padding: '4rem 5rem',
          borderRadius: '24px',
          textAlign: 'center',
          maxWidth: '800px',
          pointerEvents: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          backdropFilter: isExplored ? 'blur(8px)' : 'blur(16px)',
          backgroundColor: isExplored ? 'rgba(10, 10, 15, 0.6)' : 'rgba(10, 10, 15, 0.4)',
          transition: 'backdrop-filter 0.5s ease, background-color 0.5s ease'
        }}
      >
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-gradient" 
          style={{ 
            fontSize: '4.5rem', 
            margin: 0, 
            lineHeight: 1.1,
            background: isExplored 
              ? 'linear-gradient(135deg, #ff3388, #ffcc33)' 
              : 'linear-gradient(135deg, #00ffff, #7a00ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          {isExplored ? 'Quantum Overdrive' : 'Quantum Engine'}
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          style={{ fontSize: '1.25rem', color: '#a1a1aa', fontWeight: 300, margin: 0 }}
        >
          {isExplored 
            ? 'Real-time shader mutation active. Procedural limits breached.'
            : 'High-performance procedural geometry and WebGL rendering. Powered by React, Three.js, and GLSL Shaders.'}
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}
        >
          <button
            onClick={onExplore}
            style={{
              background: isExplored 
                ? 'linear-gradient(135deg, rgba(255,51,136,0.2), rgba(255,204,51,0.2))'
                : 'linear-gradient(135deg, rgba(0,255,255,0.2), rgba(122,0,255,0.2))',
              border: isExplored 
                ? '1px solid rgba(255, 51, 136, 0.4)'
                : '1px solid rgba(0, 255, 255, 0.4)',
              color: 'white',
              padding: '1rem 3rem',
              borderRadius: '999px',
              fontSize: '1.1rem',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontFamily: 'Inter',
            }}
            onMouseOver={(e) => {
              if (isExplored) {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,51,136,0.4), rgba(255,204,51,0.4))';
                e.currentTarget.style.boxShadow = '0 10px 20px rgba(255,51,136,0.2)';
              } else {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0,255,255,0.4), rgba(122,0,255,0.4))';
                e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,255,255,0.2)';
              }
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              if (isExplored) {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,51,136,0.2), rgba(255,204,51,0.2))';
              } else {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0,255,255,0.2), rgba(122,0,255,0.2))';
              }
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {isExplored ? 'Restore Bounds' : 'Explore Compute'}
          </button>
          
          <AnimatePresence>
            {isExplored && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -20 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                style={{ width: '100%', maxWidth: '300px' }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                  <span style={{ 
                    fontSize: '0.85rem', 
                    color: renderLimit > 80 ? '#ff1155' : '#ffcc33', 
                    fontWeight: 600, 
                    letterSpacing: '2px', 
                    textTransform: 'uppercase',
                    transition: 'color 0.3s ease'
                  }}>
                    Overdrive Core: {renderLimit}%
                  </span>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={renderLimit} 
                    onChange={(e) => setRenderLimit(Number(e.target.value))}
                    style={{
                      width: '100%',
                      accentColor: renderLimit > 80 ? '#ff1155' : '#ff3388',
                      cursor: 'pointer'
                    }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
}
