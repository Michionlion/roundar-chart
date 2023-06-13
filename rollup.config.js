import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import copy from 'rollup-plugin-copy';

export default {
    input: 'src/js/index.js',
    output: [
        {
            file: 'dist/index.js',
            format: 'umd',
            exports: 'named',
            name: 'roundar',
        },
        {
            file: 'dist/index.esm.js',
            format: 'esm',
        },
        {
            file: 'dist/index.min.js',
            format: 'umd',
            exports: 'named',
            name: 'roundar',
            plugins: [terser()],
        },
        {
            file: 'dist/index.esm.min.js',
            format: 'esm',
            plugins: [terser()]
        },
    ],
    plugins: [
        resolve(),
        copy({
            targets: [{ src: 'src/js/index.d.ts', dest: 'dist/' }]
        })
    ],
};
