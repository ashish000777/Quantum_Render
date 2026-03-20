# Quantum Render 🌌

**Quantum Render** is a high-performance, procedural WebGL engine built for the modern web. It features real-time, mathematically driven visual geometry and a smooth, interactive user experience.

🟢 **Live Demo**: [https://quantum-render-315.surge.sh](https://quantum-render-315.surge.sh)

## Features

- **Procedural Shaders**: Custom GLSL vertex and fragment shaders using continuous simplex noise functions for dynamic shape mutation and neon visual effects.
- **Compute Overdrive Slider**: A real-time control that bounds mathematical shader constraints, bridging hardware limits and visual chaos dynamically (0% to 100%).
- **Interactive Environment**: Hooks into the `useFrame` rendering loop to manipulate the camera bounds, environment particle speeds, and scene rotation based on user interaction.
- **Premium UI Aesthetic**: High framerate, glassmorphic UI overlay animations managed heavily by Framer Motion.

## Tech Stack

The architecture is built completely on top of a modern JavaScript/TypeScript ecosystem for fast bundling and robust type-safety:

- **Frontend**: React 18 & TypeScript
- **Bundler**: Vite 5
- **WebGL Rendering**: Three.js
- **Declarative 3D**: React Three Fiber (R3F) & React Three Drei
- **User Interface Animation**: Framer Motion
- **Styling**: Vanilla CSS (CSS Variables & Glassmorphism constraints)

## Running Locally

Because the project uses Vite, local development is incredibly fast and native.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ashish000777/Quantum_Render.git
   cd Quantum_Render
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```

   The app will automatically launch at `http://localhost:5173`. Any changes you make to the source code or GLSL shaders will hot-reload instantly.

## Building for Production

To create a highly optimized and minified production build:

```bash
npm run build
```

The compiled assets will be cleanly outputted to the `/dist` directory, fully ready to be hosted manually on Vercel, Netlify, or Surge.

## License

This project is fully open source. Feel free to use the shader logic inside your own applications!
