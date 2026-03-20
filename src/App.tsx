import { Suspense, useState } from 'react';
import CanvasRenderer from './components/CanvasRenderer';
import Overlay from './components/Overlay';

function App() {
  const [isExplored, setIsExplored] = useState(false);
  const [renderLimit, setRenderLimit] = useState(50);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Suspense fallback={null}>
        <CanvasRenderer isExplored={isExplored} renderLimit={renderLimit} />
      </Suspense>
      <Overlay 
        isExplored={isExplored} 
        onExplore={() => setIsExplored(!isExplored)} 
        renderLimit={renderLimit}
        setRenderLimit={setRenderLimit}
      />
    </div>
  );
}

export default App;
