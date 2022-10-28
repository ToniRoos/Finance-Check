import { AccountData, isDate } from "./helper";
import * as fs from "fs";
import csv from "csv-parser";

const regexForDate = /Buchungstag|Belegdatum/;
const regexForAmount = /Betrag \(EUR\)/;
const regexForClient = /Auftraggeber|Beschreibung/;
const regexForCreditor = /Gl.ubiger-ID/;
const regexForBankAccountNumber = /Kontonummer/;
const regexForReason = /Verwendungszweck/;

export function loadCsv(fileURLToPath: string, setData: React.Dispatch<React.SetStateAction<AccountData>>) {

    const results: any = [];
    let lineNumber = 0;
    let bankAccountNumber = "";
    let saldo = 0;

    let colForDate = 0;
    let colForAmount = 0;
    let colForClient = 0;
    let colForCreditor = 0;
    let colForBankAccountNumber = 0;
    let colForReason = 0;

    fs.createReadStream(fileURLToPath)
        .pipe(csv({
            separator: ';', headers: [],//headers: dataMappingKeysTmp,
            mapValues: ({ header, index, value }: { header: string; index: number; value: string; }) => {

                if (value.match(regexForDate)) {
                    colForDate = index;
                }
                if (value.match(regexForAmount)) {
                    colForAmount = index;
                }
                if (value.match(regexForClient)) {
                    colForClient = index;
                }
                if (value.match(regexForCreditor)) {
                    colForCreditor = index;
                }
                if (value.match(regexForBankAccountNumber)) {
                    colForBankAccountNumber = index;
                }
                if (value.match(regexForReason)) {
                    colForReason = index;
                }

                if (lineNumber === 0 && index === 1) {
                    bankAccountNumber = value;
                    return;
                }
                if (lineNumber === 4 && index === 1) {

                    const rawValue = value.split(' ')[0];
                    if (Number(rawValue)) {
                        saldo = parseFloat(rawValue);
                    } else {
                        saldo = parseFloat(rawValue.replace('.', '').replace(',', '.'));
                    }
                    return;
                }

                const splittedArray = value.split('.');
                if (splittedArray.length === 3) {

                    const parsedDate = new Date(`${splittedArray[2]}-${splittedArray[1]}-${splittedArray[0]}`);
                    if (isDate(parsedDate)) {
                        return parsedDate;
                    }
                }

                if (index === colForAmount) {
                    const amountParsed = parseFloat(value.replace('.', '').replace(',', '.').replace(' ', ''));
                    return amountParsed;
                }
                return value;
            }
        }
        ))
        .on('data', (row: string[]) => {

            lineNumber++;
            if (!isDate(row[colForDate])) {
                return;
            }
            results.push({
                BookingDate: row[colForDate],
                Client: row[colForClient],
                Reason: row[colForReason],
                Creditor: row[colForCreditor],
                BankAccountNumber: row[colForBankAccountNumber],
                Amount: row[colForAmount]
            });
        })
        .on('end', () => {

            setData({ data: results, bankAccountNumber: bankAccountNumber, saldo: saldo });
            console.log("Finished import");
        });
}