import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
    plugins: [pluginReact()],
    html: {
        title: 'SAM KIUT LMS',
    },
    performance: {
        removeConsole: true,
        removeMomentLocale: true,
    },
    server: {
        port: 3000,
    },
    output: {
        distPath: {
            root: 'build',
        },
    },
});