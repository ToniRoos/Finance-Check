import * as React from 'react';
import { AccountDataContext, monthDiff, round } from '../../logic/helper';
import { dataAccountStore } from '../../stores/accountDataStore';
import TimeSeriesChart from './charts/TimeSeriesChart';
import { settingsStore } from '../../stores/settingsStore';
import { AccountDataRow } from 'common';
import DonutChart from './charts/DonutChart';
import AmountTable from './AmountTable';

export interface ChartProps {
    data: any[];
}

interface CostsCategory {
    category: string;
    data: AccountDataRow[];
}

interface SelectedSliceState {
    year: number;
    category: string;
}

export const AnalysisPage = () => {

    const { state: dataContext } = React.useContext(dataAccountStore);
    const { state: settings } = React.useContext(settingsStore);
    const [selectedSlice, setSelectedSclice] = React.useState<SelectedSliceState>()

    let saldo = 0;
    dataContext.accountList.forEach(element => {

        if (element.saldo) {
            saldo += element.saldo;
        }
    });
    const incomeData2: { x: Date, y: number | string }[] = [];
    const miscellaneous = "miscellaneous";
    const costsMapped: CostsCategory[] = [{ category: miscellaneous, data: [] }];
    dataContext.data.forEach(element => {

        if (incomeData2.length > 0 && incomeData2[incomeData2.length - 1].x.getTime() === element.bookingDate.getTime()) {

            saldo = round(saldo - element.amount);
            incomeData2[incomeData2.length - 1].y = saldo;
        } else {

            saldo = round(saldo - element.amount);
            incomeData2.push({ x: element.bookingDate, y: saldo });
        }

        if (element.amount > 0) {
            return;
        }

        let anyMatch = false;
        if (settings.categories) {
            settings.categories.forEach(category => {

                category.matches.forEach(matchItem => {

                    const match = matchItem.toLocaleLowerCase();

                    if (element.client.toLocaleLowerCase().match(match)
                        || element.creditor.toLocaleLowerCase().match(match)
                        || element.reason.toLocaleLowerCase().match(match)) {
                        const costItemsMatched = costsMapped.filter(costsMappedItem => costsMappedItem.category === category.title);
                        if (costItemsMatched.length === 0) {
                            costsMapped.push({ category: category.title, data: [element] });
                        } else {
                            costItemsMatched[0].data.push(element);
                        }
                        anyMatch = true;
                    }
                });
            });
        }

        if (!anyMatch) {
            costsMapped.filter(costsMappedItem => costsMappedItem.category === miscellaneous)[0].data.push(element);
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

    const costChartsMapped: JSX.Element[] = [];
    if (dataContext.data.length > 0) {
        var max = dataContext.data[0].bookingDate.getFullYear();
        var min = dataContext.data[dataContext.data.length - 1].bookingDate.getFullYear();
        var rangeMin = max - min > 2 ? max - 2 : min;
        var rangeMax = max;

        for (let index = rangeMin; index <= rangeMax; index++) {

            const mappedData: any[] = [];
            costsMapped.forEach(element => {
                mappedData.push([element.category, calculateSum(element.data.filter(item => item.bookingDate.getFullYear() === index))])
            });
            costChartsMapped.push(<div key={index} className="col">
                <DonutChart data={mappedData} title={index.toString()} donutSliceClicked={(year, category) => {
                    setSelectedSclice({ year: parseInt(year), category: category });
                }} />
            </div>)
        }
    } else {
        costChartsMapped.push(<div key={0} className="col text-center">No data imported yet</div>);
    }

    let costDetails = undefined;
    if (selectedSlice) {
        dataContext.data.filter(item => item.bookingDate.getFullYear() === selectedSlice.year)
        const costsFiltered: AccountDataRow[] = [];
        costsMapped.filter(item => item.category === selectedSlice.category).forEach(item => {
            costsFiltered.push(...item.data.filter(data => data.bookingDate.getFullYear() === selectedSlice.year))
        });
        costDetails = <AmountTable data={costsFiltered} />;
    }

    const costsHeading = selectedSlice === undefined
        ? <div>
            <h1 className="text-center">Costs</h1>
            <hr className="my-4" />
        </div>
        : <div className="d-flex">
            <div>
                <button type="button" className="btn btn-outline-secondary"
                    onClick={() => {
                        setSelectedSclice(undefined);
                    }}>
                    {"<"}
                </button>
            </div>
            <div className="flex-grow-1">
                <h1 className="text-center">{`Costs - ${selectedSlice.category} - ${selectedSlice.year}`}</h1>
            </div>
        </div>;

    return <div>

        <div className="jumbotron">
            {assetsDevelopChart}
        </div>
        <div className="jumbotron">
            {remainingMoneyChart}
        </div>
        <div className="jumbotron">
            {costsHeading}
            {costDetails === undefined
                ? <div className="row">{costChartsMapped}</div>
                : costDetails}

        </div>
    </div>;
};

function calculateSum(accountRows: AccountDataRow[]) {

    let sum = 0;
    accountRows.forEach(element => {
        sum += element.amount;
    });

    return round(Math.abs(sum));
}

function calculateRemainingMoney(dataContext: AccountDataContext) {

    let xx: string[] = [];
    let yy: number[] = [];
    let yy2: number[] = [];
    let yy3: number[] = [];

    if (dataContext.data.length === 0) {
        return { xx, yy, yy2, yy3 };
    }

    const countMonths = monthDiff(dataContext.data[dataContext.data.length - 1].bookingDate, dataContext.data[0].bookingDate);
    let startMonth = dataContext.data[dataContext.data.length - 1].bookingDate.getMonth();
    let startYear = dataContext.data[dataContext.data.length - 1].bookingDate.getFullYear();

    for (let index = 0; index < countMonths; index++) {

        if (startMonth === 12) {
            startMonth = 0;
            startYear++;
        }

        let costs1 = 0;
        let income1 = 0;
        dataContext.data.filter(elemet => elemet.bookingDate.getFullYear() === startYear && elemet.bookingDate.getMonth() === startMonth).forEach(element => {
            if (element.amount < 0) {
                costs1 += Math.abs(element.amount);
            } else {
                income1 += element.amount;
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