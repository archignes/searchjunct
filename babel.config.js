// babel.config.js
module.exports = {
    presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        '@babel/preset-react',
        '@babel/preset-typescript',
    ],
    plugins: [
        [
            'module-resolver',
            {
                root: ['./'],
                alias: {
                    "@/src/components/*": "./src/components/*",
                    "@/lib/utils": "./src/lib/utils",
                    "@src/contexts": "./src/contexts",
                    "@/contexts/*": "./src/contexts/*",
                    "@/types": "./src/types",
                    "@/src/components/*": "./src/components/*",
                },
            },
        ],
    ],
};