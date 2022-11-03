import express, {Request, Response} from 'express'
import axios from 'axios'

const app = express()
const port = 8080

app.get('/microservice-a', (req: Request, res: Response) => {
    console.log('microservice-a GET / called...')
    res.status(200)
    res.send({
        test: 'ok'
    })
})

app.get('/microservice-a/response-including-data-from-microservice-b', async (req: Request, res: Response) => {
    console.log('microservice-a GET /response-including-data-from-microservice-b called...')
    const {data} = await axios.get('http://microservice-b-cluster-ip-service:8081/microservice-b/data-from-microservice-b')
    res.status(200)
    res.send({
        data: data.data
    })
})

app.listen(port, () => console.log(`Microservice "A" listening on port ${port}...`, process.env))
