import * as React from 'react';
import * as c3 from "c3";
import 'c3/c3.css';
// import InputRange from 'react-input-range';
const InputRange = require('react-input-range');
import { formatNumberToEuroAmount, monthDiff, parseDate, round } from './logic/helper';
import { dataAccountStore } from './stores/accountDataStore';
import * as d3 from 'd3';
import { Console } from 'console';

export interface ChartProps {
    data: any[];
}

interface Range {
    max: number;
    min: number;
}

interface ChartState {
    min: number;
    max: number;
    range: Range;
    chart?: c3.ChartAPI;
}

export const Chart = () => {

    const { state: dataContext } = React.useContext(dataAccountStore);
    const [chart1, setChart1] = React.useState<ChartState>({ min: 0, max: 1, range: { min: 0, max: 1 } })

    let saldo = 0;
    dataContext.accountList.forEach(element => {

        if (element.saldo) {
            saldo += element.saldo;
        }
    });
    const incomeData2: { x: Date, y: number | string }[] = [];
    dataContext.data.forEach(element => {

        if (incomeData2.length > 0 && incomeData2[incomeData2.length - 1].x.getTime() === element.BookingDate.getTime()) {

            saldo = round(saldo - element.Amount);
            incomeData2[incomeData2.length - 1].y = saldo;
        } else {

            saldo = round(saldo - element.Amount);
            incomeData2.push({ x: element.BookingDate, y: saldo });
        }
    });

    React.useEffect(() => {

        const countMonths = monthDiff(dataContext.data[dataContext.data.length - 1].BookingDate, dataContext.data[0].BookingDate);
        let startMonth = dataContext.data[dataContext.data.length - 1].BookingDate.getMonth();
        let startYear = dataContext.data[dataContext.data.length - 1].BookingDate.getFullYear();

        const xx = [];
        const yy = [];
        const yy2 = [];
        const yy3 = [];

        for (let index = 0; index < countMonths; index++) {

            if (startMonth === 12) {
                startMonth = 0;
                startYear++;
            }

            console.log("##### " + startYear + "-" + startMonth)
            let costs1 = 0;
            let income1 = 0;
            dataContext.data.filter(elemet => elemet.BookingDate.getFullYear() === startYear && elemet.BookingDate.getMonth() === startMonth).forEach(element => {
                if (element.Amount < 0) {
                    costs1 += Math.abs(element.Amount);
                } else {
                    income1 += element.Amount;
                }
            });

            xx.push(`${startYear}-${startMonth + 1}-01`);
            yy.push(round(income1 - costs1));
            yy2.push(income1);
            yy3.push(costs1);
            startMonth++;
        }

        // const chart1 = createChart([x, incomeData], "chart1");
        let costs1 = 0;
        let income1 = 0;
        dataContext.data.filter(elemet => elemet.BookingDate.getFullYear() === 2020 && elemet.BookingDate.getMonth() + 1 === 8).forEach(element => {
            if (element.Amount < 0) {
                costs1 += Math.abs(element.Amount);
            } else {
                income1 += element.Amount;
            }
        });
        createDonutChart([["costs", costs1], ["income", income1]], "chartDonut1", `Remaining: ${formatNumberToEuroAmount(income1 - costs1)}`);

        let costs2 = 0;
        let income2 = 0;
        dataContext.data.filter(elemet => elemet.BookingDate.getFullYear() === 2020 && elemet.BookingDate.getMonth() + 1 === 9).forEach(element => {
            if (element.Amount < 0) {
                costs2 += Math.abs(element.Amount);
            } else {
                income2 += element.Amount;
            }
        });
        createDonutChart([["costs", costs2], ["income", income2]], "chartDonut2", `Remaining: ${formatNumberToEuroAmount(income2 - costs2)}`);

        let costs3 = 0;
        let income3 = 0;
        dataContext.data.filter(elemet => elemet.BookingDate.getFullYear() === 2020 && elemet.BookingDate.getMonth() + 1 === 10).forEach(element => {
            if (element.Amount < 0) {
                costs3 += Math.abs(element.Amount);
            } else {
                income3 += element.Amount;
            }
        });
        createDonutChart([["costs", costs3], ["income", income3]], "chartDonut3", `Remaining: ${formatNumberToEuroAmount(income3 - costs3)}`);

        const chart5 = createLineChart([
            ["x", ...xx],
            ["Rem", ...yy],
            ["Income", ...yy2],
            ["Costs", ...yy3]], "chart5");

        var max = incomeData2[0].x.getFullYear();
        var min = incomeData2[incomeData2.length - 1].x.getFullYear();
        var rangeMin = max === min ? max : max - 1;
        var rangeMax = max;

        var yearsToDisplay: number[] = [];
        for (let index = rangeMin; index <= rangeMax; index++) {
            yearsToDisplay.push(index);
        }

        const filteredIncomeDate = incomeData2.filter(item => yearsToDisplay.includes(item.x.getFullYear()))

        const x1 = filteredIncomeDate.map(item => item.x.toISOString().split('T')[0]);

        x1.unshift("x" as any);
        const y1 = filteredIncomeDate.map(item => item.y);
        y1.unshift("y");

        // const y2: { month: number, value: number }[] = [];
        // const y3: number[] = [0];
        // filteredIncomeDate.forEach(element => {
        //     const month = element.x.getMonth();
        //     if (y2.length === 0) {
        //         y2.push({ month: month, value: element.y as number });
        //     } else if (y2.length > 0 && y2[y2.length - 1].month > month) {
        //         y2.push({ month: month, value: element.y as number });
        //     } else {
        //         y2[y2.length - 1].value = element.y as number;
        //     }
        // });
        // y2.forEach((element, i) => {
        //     if (i > 0) {
        //         y3.push(y2[i - 1].value - y2[i].value);
        //     }
        // });
        // y3.unshift("y" as any);
        const chart2 = createLineChart([x1, y1], "chart2");

        setChart1({ min: min, max: max, range: { min: rangeMin, max: rangeMax }, chart: chart2 });

        return () => {
            // chart1.destroy();
            chart2.destroy();
        };
    }, [dataContext.data]);

    React.useEffect(() => {

        var yearsToDisplay: number[] = [];
        for (let index = chart1.range.min; index <= chart1.range.max; index++) {
            yearsToDisplay.push(index);
        }

        const filteredIncomeDate = incomeData2.filter(item => yearsToDisplay.includes(item.x.getFullYear()))

        const x1 = filteredIncomeDate.map(item => item.x.toISOString().split('T')[0]);
        x1.unshift("x" as any);
        const y1 = filteredIncomeDate.map(item => item.y);
        y1.unshift("y");
        chart1.chart?.load({
            columns: ([x1, y1] as any)
        })

        return () => {
        };
    }, [chart1]);

    return <div>

        <div className="jumbotron">
            <h1 className="text-center">How your assets develop? ({chart1.range.min} - {chart1.range.max})</h1>
            {/* <label htmlFor="customRange2">Years range({chart1.range.min} - {chart1.range.max})</label> */}
            {/* <input type="range" className="custom-range"
                min={chart1.min} max={chart1.max} value={chart1.range}
                onChange={event => {
                    setChart1({ ...chart1, range: parseInt(event.target.value) })
                }}
                id="customRange2" /> */}

            {chart1.min === chart1.max ? undefined : <InputRange
                maxValue={chart1.max}
                minValue={chart1.min}
                value={chart1.range}
                onChange={(value: any) => {
                    setChart1({ ...chart1, range: value })
                }} />}

            {/* <div className="d-flex">
                <div>
                    {chart1.min}
                </div>
                <div className="flex-grow-1" />
                <div>
                    {chart1.max}
                </div>
            </div> */}
            <hr className="my-4"></hr>
            <div id="chart2" />
        </div>
        <div className="jumbotron">
            <h1 className="text-center">Remaining Money</h1>
            <div className="row">
                <div className="col">
                    <div id="chartDonut1" />
                </div>
                <div className="col">
                    <div id="chartDonut2" />
                </div>
                <div className="col">
                    <div id="chartDonut3" />
                </div>
            </div>
            <div className="row">
                <div id="chart5" />
            </div>
        </div>
    </div>;
};

function createLineChart(data: any[], chartName: string) {

    const lines: { value: string, text: string }[] = [];
    data[0].forEach((element: string) => {

        const splittedElement = element.split('-');
        const lineString = `${splittedElement[0]}-${splittedElement[1]}-01`;

        if (lines.filter(item => item.value === lineString).length === 0) {
            lines.push({ value: lineString, text: lineString });
        }
    });

    var chart = c3.generate({
        bindto: `#${chartName}`,
        data: {
            x: 'x',
            columns: data,
            type: 'line',
            onclick: (d, element) => {
            }
        },
        axis: {
            x: {
                type: 'timeseries',
                tick: {
                    format: '%Y-%m-%d',
                    count: 12
                }
            }
        },
        grid: {
            x: {
                show: true,
                lines: lines
            },
            y: {
                show: true,
                lines: [{ value: 0 }]
            }
        }, zoom: {
            enabled: true
        }
    });
    return chart;
}

function createDonutChart(data: any[], chartName: string, title: string) {

    var chart = c3.generate({
        bindto: `#${chartName}`,
        data: {
            columns: data,
            type: 'donut',
            onclick: (d, element) => {
            }
        },
        donut: {
            title: title,
            label: {
                format: (value, ratio, id) => {
                    return round(value) + "€";
                }
            }
        }
    });
    return chart;
}