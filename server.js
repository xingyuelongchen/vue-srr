const express = require('express')
const fs = require('fs')
const path = require('path')
const { minify } = require('html-minifier')
// 引入vue-server-renderer ssr模块
const { createBundleRenderer } = require('vue-server-renderer')
const app = express()
// 用于获取文件的绝对地址
const resolve = file => path.resolve(__dirname, file)
// 服务端预渲染
const renderer = createBundleRenderer(require('./dist/vue-ssr-server-bundle.json'), {
    runInNewContext: false,
    template: fs.readFileSync(resolve('./index.template.html'), 'utf-8'),
    clientManifest: require('./dist/vue-ssr-client-manifest.json'),
    basedir: resolve('/dist')
})
app.use(express.static(path.join(__dirname, './dist')))
app.use('/*', (req, res) => {
    res.setHeader('Content-Type', 'text/html')
    const handleError = err => {
        if (err.url) {
            res.redirect(err.url)
        } else if (err.code === 404) {
            res.status(404).send('404 | Page Not Found')
        } else {
            res.status(500).send('500 | Internal Server Error')
            console.error(`error during render : ${req.url}`)
            console.error(err.stack)
        }
    }
    const context = {
        title: 'document',
        url: req.url,
        keywords: '',
        description: '',
    }
    renderer.renderToString(context, (err, html) => {
        if (err) {
            return handleError(err)
        }
        res.send(minify(html, { collapseWhitespace: true, minifyCSS: true }))
    })
})

app.on('error', err => console.log(err))
app.listen(8088, () => {
    console.log(`vue ssr started at http://127.0.0.1:8088`)
})



