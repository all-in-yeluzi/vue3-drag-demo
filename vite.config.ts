import { defineConfig, Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import http from 'http'
import https from 'https'

const apiProxyPlugin = (): Plugin => ({
  name: 'api-proxy-plugin',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (!req.url?.startsWith('/api-proxy')) {
        return next()
      }

      const urlObj = new URL(req.url, `http://${req.headers.host}`)
      const target = urlObj.searchParams.get('target')

      if (!target) {
        console.log('[Proxy] Missing target url')
        res.statusCode = 400
        res.end('Missing target url')
        return
      }

      try {
        const targetUrl = new URL(target)
        const options = {
          hostname: targetUrl.hostname,
          port: targetUrl.port || (targetUrl.protocol === 'https:' ? 443 : 80),
          path: targetUrl.pathname + targetUrl.search,
          method: req.method,
          headers: {
            // 只保留必要的头，避免携带 localhost 的 cookie 或错误的 referer
            'accept': req.headers['accept'] || '*/*',
            'content-type': req.headers['content-type'] || 'application/json',
            'user-agent': req.headers['user-agent'] || 'Vite-Proxy/1.0', // 保留浏览器 UA 或使用默认值
            'host': targetUrl.hostname,
            // 如果需要，可以添加 origin/referer，但通常 API 不需要，或者需要真实的
            // 'origin': targetUrl.origin,
          },
        }

        // 删除干扰代理的头
        // delete options.headers['x-forwarded-for']

        console.log(`[Proxy] Proxying ${req.method} ${target}`)

        const requestLib = targetUrl.protocol === 'https:' ? https : http
        const proxyReq = requestLib.request(options, (proxyRes) => {
          console.log(`[Proxy] Got response: ${proxyRes.statusCode} url: ${target}`)
          
          // 如果是重定向，打印目标地址
          if (proxyRes.statusCode && proxyRes.statusCode >= 300 && proxyRes.statusCode < 400) {
              console.log(`[Proxy] Redirect to: ${proxyRes.headers.location}`)
          }

          res.writeHead(proxyRes.statusCode || 200, proxyRes.headers)
          proxyRes.pipe(res)
        })

        proxyReq.on('error', (err) => {
          console.error('[Proxy] Exception:', err)
          res.statusCode = 500
          res.end('Invalid Target URL: ' + err.message)
        })

        req.pipe(proxyReq)
      } catch (e: any) {
        console.error('[Proxy] Exception:', e)
        res.statusCode = 500
        res.end('Invalid Target URL: ' + e.message)
      }
    })
  }
})

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), apiProxyPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'VisualDragDemo',
      fileName: (format) => `z-vdc.${format}.js`,
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ['vue', 'element-plus', 'pinia', 'echarts', 'vue-router'],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: 'Vue',
          'element-plus': 'ElementPlus',
          pinia: 'Pinia',
          echarts: 'echarts',
          'vue-router': 'VueRouter',
        },
      },
    },
  },
  server: {
    port: 8080,
    open: true,
  },
})
