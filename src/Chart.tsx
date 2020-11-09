import * as React from 'react';
import * as c3 from "c3";
import 'c3/c3.css';
import { AccountDataContext, monthDiff, round } from './logic/helper';
import { dataAccountStore } from './stores/accountDataStore';
import TimeSeriesChart from './TimeSeriesChart';

export interface ChartProps {
    data: any[];
}

export const Chart = () => {

    const { state: dataContext } = React.useContext(dataAccountStore);

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

    const assetsDevelopChart = <TimeSeriesChart title="How your assets develop?"
        xValues={{
            label: "x",
            data: incomeData2.map(item => item.x)
        }} yValues={{
            label: "Account Balance",
            data: incomeData2.map(item => item.y as number)
        }} />;

    const { xx, yy, yy2, yy3 } = calculateRemainingMoney(dataContext);

    const remainingMoneyChart = <TimeSeriesChart title="Remaining Money"
        xValues={{
            label: "x",
            data: xx.map(dateString => {
                const dateArray = dateString.split('-');
                return new Date(parseInt(dateArray[0]), parseInt(dateArray[1]) - 1, parseInt(dateArray[2]))
            })
        }}
        yValues={[{ label: "Remaining", data: yy }, { label: "Income", data: yy2, show: false }, { label: "Costs", data: yy3, show: false }]} />;

    // React.useEffect(() => {

    //     const { xx, yy, yy2, yy3 } = calculateRemainingMoney(dataContext);

    //     // const chart1 = createChart([x, incomeData], "chart1");
    //     let costs1 = 0;
    //     let income1 = 0;
    //     dataContext.data.filter(elemet => elemet.BookingDate.getFullYear() === 2020 && elemet.BookingDate.getMonth() + 1 === 8).forEach(element => {
    //         if (element.Amount < 0) {
    //             costs1 += Math.abs(element.Amount);
    //         } else {
    //             income1 += element.Amount;
    //         }
    //     });
    //     createDonutChart([["costs", costs1], ["income", income1]], "chartDonut1", `Remaining: ${formatNumberToEuroAmount(income1 - costs1)}`);

    //     let costs2 = 0;
    //     let income2 = 0;
    //     dataContext.data.filter(elemet => elemet.BookingDate.getFullYear() === 2020 && elemet.BookingDate.getMonth() + 1 === 9).forEach(element => {
    //         if (element.Amount < 0) {
    //             costs2 += Math.abs(element.Amount);
    //         } else {
    //             income2 += element.Amount;
    //         }
    //     });
    //     createDonutChart([["costs", costs2], ["income", income2]], "chartDonut2", `Remaining: ${formatNumberToEuroAmount(income2 - costs2)}`);

    //     let costs3 = 0;
    //     let income3 = 0;
    //     dataContext.data.filter(elemet => elemet.BookingDate.getFullYear() === 2020 && elemet.BookingDate.getMonth() + 1 === 10).forEach(element => {
    //         if (element.Amount < 0) {
    //             costs3 += Math.abs(element.Amount);
    //         } else {
    //             income3 += element.Amount;
    //         }
    //     });
    //     createDonutChart([["costs", costs3], ["income", income3]], "chartDonut3", `Remaining: ${formatNumberToEuroAmount(income3 - costs3)}`);

    //     const chart5 = createLineChart([
    //         ["x", ...xx],
    //         ["Remaining", ...yy],
    //         ["Income", ...yy2],
    //         ["Costs", ...yy3]], "chart5");
    //     chart5.hide(['Income', 'Costs']);

    //     var max = incomeData2[0].x.getFullYear();
    //     var min = incomeData2[incomeData2.length - 1].x.getFullYear();
    //     var rangeMin = max === min ? max : max - 1;
    //     var rangeMax = max;

    //     var yearsToDisplay: number[] = [];
    //     for (let index = rangeMin; index <= rangeMax; index++) {
    //         yearsToDisplay.push(index);
    //     }

    //     const filteredIncomeDate = incomeData2.filter(item => yearsToDisplay.includes(item.x.getFullYear()))

    //     const x1 = filteredIncomeDate.map(item => item.x.toISOString().split('T')[0]);

    //     x1.unshift("x" as any);
    //     const y1 = filteredIncomeDate.map(item => item.y);
    //     y1.unshift("Account Balance");

    //     const chart2 = createLineChart([x1, y1], "chart2");

    //     setChart1({ min: min, max: max, range: { min: rangeMin, max: rangeMax }, chart: chart2 });

    //     return () => {
    //         // chart1.destroy();
    //         chart2.destroy();
    //     };
    // }, [dataContext.data]);

    return <div>

        <div className="jumbotron">
            {assetsDevelopChart}
        </div>
        <div className="jumbotron">
            {remainingMoneyChart}
        </div>
    </div>;
};

function calculateRemainingMoney(dataContext: AccountDataContext) {

    let xx: string[] = [];
    let yy: number[] = [];
    let yy2: number[] = [];
    let yy3: number[] = [];

    if (dataContext.data.length === 0) {
        return { xx, yy, yy2, yy3 };
    }

    const countMonths = monthDiff(dataContext.data[dataContext.data.length - 1].BookingDate, dataContext.data[0].BookingDate);
    let startMonth = dataContext.data[dataContext.data.length - 1].BookingDate.getMonth();
    let startYear = dataContext.data[dataContext.data.length - 1].BookingDate.getFullYear();

    for (let index = 0; index < countMonths; index++) {

        if (startMonth === 12) {
            startMonth = 0;
            startYear++;
        }

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
        yy2.push(round(income1));
        yy3.push(round(costs1));
        startMonth++;
    }

    xx = xx.reverse();
    yy = yy.reverse();
    yy2 = yy2.reverse();
    yy3 = yy3.reverse();

    return { xx, yy, yy2, yy3 };
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