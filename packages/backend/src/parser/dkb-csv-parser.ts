import { AccountData } from "common";
import _ from "lodash";

const regexForDate = /Buchungstag|Belegdatum/;
const regexForAmount = /Betrag \(EUR\)/;
const regexForClient = /Auftraggeber|Beschreibung/;
const regexForCreditor = /Gl.ubiger-ID/;
const regexForBankAccountNumber = /Kontonummer/;
const regexForReason = /Verwendungszweck/;

export function parseCsv(content: string) {

    console.log("Start import");

    if (_.isEmpty(content)) {
        throw new Error('CSV content is empty')
    }

    const contentCleaned = content.replaceAll('"', '')
    const lines = contentCleaned.split('\n')

    const data: any = [];
    let saldo = 0;
    const seperator = ';'

    let colForDate = 0;
    let colForAmount = 0;
    let colForClient = 0;
    let colForCreditor = 0;
    let colForBankAccountNumber = 0;
    let colForReason = 0;

    const metaEndIndex = _.findIndex(lines, line => regexForDate.test(line))
    if (metaEndIndex < 0) {
        throw new Error('Invalid csv file. Meta end not found')
    }

    const metaLines = lines.splice(0, metaEndIndex + 1)
    const [__, bankAccountNumber] = metaLines[0].split(seperator)
    if (_.isEmpty(bankAccountNumber)) {
        throw new Error('Invalid csv file. Bank account number not found')
    }

    const [___, saldoString] = metaLines[4].split(seperator);
    const [saldoStringValue] = saldoString.split(' ')
    if (Number(saldoStringValue)) {
        saldo = parseFloat(saldoStringValue);
    } else {
        saldo = parseFloat(saldoStringValue.replace('.', '').replace(',', '.'));
    }

    const headers = metaLines[metaEndIndex].split(seperator)
    for (let index = 0; index < headers.length; index++) {

        const header = headers[index];
        if (header.match(regexForDate)) {
            colForDate = index;
        }
        if (header.match(regexForAmount)) {
            colForAmount = index;
        }
        if (header.match(regexForClient)) {
            colForClient = index;
        }
        if (header.match(regexForCreditor)) {
            colForCreditor = index;
        }
        if (header.match(regexForBankAccountNumber)) {
            colForBankAccountNumber = index;
        }
        if (header.match(regexForReason)) {
            colForReason = index;
        }
    }

    for (const line of lines) {
        const cols = line.split(';')

        data.push({
            bookingDate: parseDate(cols[colForDate]),
            client: cols[colForClient],
            reason: cols[colForReason],
            creditor: cols[colForCreditor],
            bankAccountNumber: cols[colForBankAccountNumber],
            amount: parseAmount(cols[colForAmount])
        });
    }

    console.log("Finished import");
    const result: AccountData = { data, bankAccountNumber, saldo }
    return result
}

function parseDate(dateString: string) {
    const [day, month, year] = dateString.split('.')
    const parsedDate = new Date(`${year}-${month}-${day}`);
    return parsedDate
}

function parseAmount(amounString: string) {
    const amountParsed = parseFloat(amounString.replace('.', '').replace(',', '.').replace(' ', ''));
    return amountParsed;
}