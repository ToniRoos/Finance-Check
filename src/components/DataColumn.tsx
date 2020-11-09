import * as React from "react";
import { isFloat, isInt, formatNumberToEuroAmount, parseDate } from "../logic/helper";

interface DataColumnProps {
    value: string | number | Date;
}

const DataColumn = (props: DataColumnProps) => {

    let style = "";
    let valueParsed = parseType(props.value);
    if (isFloat(props.value) || isInt(props.value)) {
        style = (props.value as number) < 0 ? "text-right bg-danger" : "text-right bg-success";
        valueParsed = formatNumberToEuroAmount(props.value as number);
    }

    return <td className={style}>
        <div className="text-truncate" style={{ maxWidth: "400px" }}>
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