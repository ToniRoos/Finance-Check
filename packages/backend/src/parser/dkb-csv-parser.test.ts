import { readFile } from "fs-extra"
import { resolve } from "path"
import { parseCsv } from "./dkb-csv-parser"

describe('dkb csv parser', () => {

    const testDataDir = resolve(__dirname, '__fixtures__')

    it('should parse csv correctly [ csv1 ]', async () => {

        // assign
        const content = await readFile(resolve(testDataDir, 'csv1.csv'))

        // act
        const parsedContent = parseCsv(content.toString())

        //assert
        expect(parsedContent).toMatchSnapshot()
    })

    it('should parse csv correctly [ csv2 ]', async () => {

        // assign
        const content = await readFile(resolve(testDataDir, 'csv2.csv'))

        // act
        const parsedContent = parseCsv(content.toString())

        //assert
        expect(parsedContent).toMatchSnapshot()
    })
})