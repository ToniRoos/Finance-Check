import * as React from "react";
import { isFloat, isInt, formatNumberToEuroAmount, parseDate } from "../logic/helper";

interface DataColumnProps {
    value: string | number | Date;
}

const DataColumn = (props: DataColumnProps) => {

    const { value } = props
    let style = "";
    let valueParsed = parseType(value);
    if (isFloat(value) || isInt(value)) {
        style = (value as number) < 0 ? "text-right bg-danger" : "text-right bg-success";
        valueParsed = formatNumberToEuroAmount(value as number);
    }

    return <td className={style}>
        <div title={value.toString()} className="text-truncate" style={{ maxWidth: "600px" }}>
            {valueParsed}
        </div>
    </td>;
}

function parseType(value: any) {

    if (value instanceof Date) {
        return parseDate(value);
    }
    return value;
}

export default DataColumn;