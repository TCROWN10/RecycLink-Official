import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    global: "globalThis",
  },
  resolve: {
    alias: {
      process: "process/browser",
      util: "util",
    },
  },
  build: {
    // Enable chunk size optimization
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor chunks more granularly
          'react-core': ['react', 'react-dom'],
          'react-router': ['react-router-dom'],
          'ui-core': ['@nextui-org/react'],
          'ui-styles': ['tailwindcss'],
          'eth-core': ['ethers'],
          'eth-utils': ['@metamask/sdk'],
        },
        // Optimize chunk size
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
      external: [
        "@safe-globalThis/safe-apps-sdk",
        "@safe-globalThis/safe-apps-provider",
      ],
    },
    // Enable aggressive optimizations
    minify: 'esbuild',
    target: 'esnext',
    cssMinify: true,
    cssCodeSplit: true,
    // Enable source map optimization
    sourcemap: false,
    // Enable asset optimization
    assetsInlineLimit: 4096,
  },
  // Enable build caching and optimization
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react-router-dom', 
      '@nextui-org/react',
      '@metamask/sdk', 
      'ethers',
      'sonner',
    ],
    exclude: ['@safe-globalThis/safe-apps-sdk'],
  },
  // Enable faster builds
  esbuild: {
    target: 'esnext',
    platform: 'browser',
    legalComments: 'none',
    treeShaking: true,
  },
  plugins: [react()],
});
