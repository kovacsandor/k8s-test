import express from 'express'

const app = express()
const port = 8081

app.get('/microservice-b', (req, res) => {
    console.log('microservice-b GET / called...')
    res.status(200)
    res.send({
        test: 'ok'
    })
})

app.get('/microservice-b/data-from-microservice-b', (req, res) => {
    console.log('microservice-b GET /data-from-microservice-b called...')
    res.status(200)
    res.send({
        data: 'data-from-microservice-b'
    })
})

app.listen(port, () => console.log(`Microservice "B" listening on port ${port}...`, process.env))