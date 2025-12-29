import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import path from 'path';

const iconsPath = 'node_modules/@shoelace-style/shoelace/dist/assets/**/*';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: iconsPath,
          dest: 'shoelace/assets',
        },
      ],
    }),
  ],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, './src'),
      },
      {
        find: '@components',
        replacement: path.resolve(__dirname, './src/components'),
      },
      {
        find: '@state',
        replacement: path.resolve(__dirname, './src/state'),
      },
      {
        find: '@shared',
        replacement: path.resolve(__dirname, './src/shared'),
      },
      {
        find: '@configs',
        replacement: path.resolve(__dirname, './src/configs'),
      },
      {
        find: '@workers',
        replacement: path.resolve(__dirname, './src/workers'),
      },
      {
        find: '@texts',
        replacement: path.resolve(__dirname, './src/texts'),
      },
      {
        find: '@validators',
        replacement: path.resolve(__dirname, './src/validators'),
      },
      {
        find: /\/assets\/icons\/(.+)/,
        replacement: `${iconsPath}/$1`,
      },
    ],
  },
  build: {
    rollupOptions: {
      plugins: [],
    },
  },
  base: '/project-idle-takeover/',
});
