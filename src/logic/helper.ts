import { AccountDataRow } from "../components/DataRow";
import * as fs from "fs";
import * as csv from "csv-parser";

let globalUserDataPath = "";
export function setGlobalUserDataPath(path: string) {

    console.log(`Set path '${path}'`);
    globalUserDataPath = path;
}

export function resolveFilePath(file: string) {

    const resolvedPath = `${globalUserDataPath}/${file}`;
    console.log(`Resolved path '${resolvedPath}'`);
    return resolvedPath;
}


let curId = 0;
export function nextId() {
    return curId++;
}

export function parseDate(date: Date) {

    let day: number = date.getDate();
    let month: number = date.getMonth();
    month = month + 1;

    const dateT = (day < 10 ? `0${day}` : day) + '.' + (month < 10 ? `0${month}` : month) + '.' + date.getFullYear();
    return dateT;
}

export interface MonthItem {
    month: string;
}

export interface YearItem {
    year: string;
    months: MonthItem[];
}

export interface AccountDataContext {
    accountList: AccountData[];
    data: AccountDataRow[];
}

export interface AccountData {
    data: AccountDataRow[];
    bankAccountNumber: string;
    saldo?: number;
}

export function trim(item: string): string {
    return item.replace(/\s/g, '');
}

export function round(num: number): number {
    return Math.round(num * 100) / 100;
}

export function formatNumberToEuroAmount(num: number) {
    return (Math.round(num * 100) / 100).toFixed(2) + "€";
}

export function monthDiff(startDate: Date, endDate: Date) {
    var months;
    months = (endDate.getFullYear() - startDate.getFullYear()) * 12;
    months -= startDate.getMonth();
    months += endDate.getMonth();
    return months <= 0 ? 0 : months;
}

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
        .on('data', (row) => {

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

export function isInt(n: any) {
    return Number(n) === n && n % 1 === 0;
}

export function isFloat(n: any) {
    return Number(n) === n && n % 1 !== 0;
}

export function isDate(d: any) {
    if (Object.prototype.toString.call(d) === "[object Date]") {
        // it is a date
        if (isNaN(d.getTime())) {  // d.valueOf() could also work
            return false;
        } else {
            return true;
        }
    } else {
        return false;
    }
}