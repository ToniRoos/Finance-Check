import express from "express";
import bodyParser from 'body-parser'
import { parseCsv } from './parser/dkb-csv-parser'
import bankAccountStore from "./bank-account-store"

interface Options {
    dataPath: string
}

const app = express();
app.use(bodyParser.json({ limit: '5mb' }))
app.use(express.json());

const port = 8080; // default port to listen
let dataPath: string | undefined = undefined
// let accountListPath: string | undefined = undefined

// define a route handler for the default home page
app.get("/api/hello-world", (req, res) => {
    // render the index template
    res.send('Hello World')
});

app.get('/api/bank-account-data', async (req, res) => {

    try {
        const data = await bankAccountStore.readAccountDataList()
        res.json(data)

    } catch (err) {
        console.error(err)
        res.sendStatus(500)
    }
})

app.post('/api/upload-csv', async (req, res) => {

    try {
        const data = req.body
        const result = parseCsv(data.csv)

        bankAccountStore.addAccountData(result)
        res.sendStatus(200)

    } catch (err) {
        console.error(err)
        res.sendStatus(500)
    }
})

// start the express server
app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`server listening on port ${port}`);
});

export function main(options: Options) {

    console.log('Banke Account Service is up...')
    console.log('Options', options)

    if (options?.dataPath == null) {
        throw new Error('Data path not set')
    }
    dataPath = options.dataPath
    bankAccountStore.init(dataPath)
    // accountListPath = path.join(dataPath, 'accountList.json')
}