import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            workbox: {
                globPatterns: [
                    '**/*.{js,css,html}',
                    '**/assets/*.{png,jpg,svg,webp}'
                ],
                runtimeCaching: [
                    {
                        urlPattern: /\.(?:png|jpg|jpeg|svg|webp)$/,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'images-cache',
                            expiration: {
                                maxEntries: 50,
                                maxAgeSeconds: 30 * 24 * 60 * 60,
                            },
                        },
                    }
                ]
            },
            registerType: 'autoUpdate',
            includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
            devOptions: {
                enabled: true,
                type: 'module',
            },
            strategies: 'generateSW',
            manifest: {
                name: 'Memorandum',
                short_name: 'MAD',
                theme_color: '#383838',
                background_color: "#383838",
                display: "standalone",
                scope: "/",
                start_url: "/",
                icons: [
                    {
                        src: "web-app-manifest-192x192.png",
                        sizes: "192x192",
                        type: "image/png",
                        purpose: "maskable"
                    },
                    {
                        src: "web-app-manifest-512x512.png",
                        sizes: "512x512",
                        type: "image/png",
                        purpose: "maskable"
                    }
                ],
            },
        })
    ],
    
    resolve: {
        alias: {
            "@shared": path.resolve(__dirname, "src/shared"),
            "@api": path.resolve(__dirname, "src/api"),
        }
    },
    build: {
        outDir: 'dist'
    },
    base: '/'
})
