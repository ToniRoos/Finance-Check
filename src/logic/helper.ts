import { AccountDataRow } from "../components/DataRow";

let globalUserDataPath = "";
export function setGlobalUserDataPath(path: string) {

    console.log(`Set path '${path}'`);
    globalUserDataPath = path;
}

export function resolveFilePath(file: string) {

    const resolvedPath = `${globalUserDataPath}/${file}`;
    return resolvedPath;
}

export const resolveAccountListPath = () => resolveFilePath('accountList.json');
export const resolveSettingsPath = () => resolveFilePath('settings.json');

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
    return round(num).toFixed(2) + " €";
}

export function monthDiff(startDate: Date, endDate: Date) {
    var months;
    months = (endDate.getFullYear() - startDate.getFullYear()) * 12;
    months -= startDate.getMonth();
    months += endDate.getMonth();
    return months <= 0 ? 0 : months + 1;
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