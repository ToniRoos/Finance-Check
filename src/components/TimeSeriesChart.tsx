import * as c3 from "c3";
import 'c3/c3.css';
import * as React from "react";
import { nextId } from "../logic/helper";
const InputRange = require('react-input-range');

interface ChartState {
    min: number;
    max: number;
    range: Range;
    chart?: c3.ChartAPI;
}

interface Range {
    max: number;
    min: number;
}

export interface TimeSeries {
    label: string;
    data: Date[]
}

export interface ChartSeries {
    label: string;
    data: number[];
    show?: boolean;
}

export interface TimeSeriesChartProps {
    xValues: TimeSeries;
    yValues: ChartSeries | ChartSeries[];
    title: string;
}

const TimeSeriesChart = (props: TimeSeriesChartProps) => {

    var max = props.xValues.data.length === 0 ? 1 : props.xValues.data[0].getFullYear();
    var min = props.xValues.data.length === 0 ? 0 : props.xValues.data[props.xValues.data.length - 1].getFullYear();
    var rangeMin = max === min ? max : max - 1;
    var rangeMax = max;

    const [chart, setChart] = React.useState<ChartState>({ min: min, max: max, range: { min: rangeMin, max: rangeMax } })

    const xValues = [props.xValues.label, ...props.xValues.data.map(item => item.toISOString().split('T')[0])];
    const data = Array.isArray(props.yValues)
        ? [xValues, ...props.yValues.map(element => [element.label, ...element.data])]
        : [xValues, [props.yValues.label, ...props.yValues.data]];

    var yearsToDisplay: number[] = [];
    for (let index = rangeMin; index <= rangeMax; index++) {
        yearsToDisplay.push(index);
    }
    const chartId = "Chart-" + nextId();

    React.useEffect(() => {
        const chart = createTimeSeriesChart(data, chartId);

        setChart({ min: min, max: max, range: { min: rangeMin, max: rangeMax }, chart: chart });

        if (Array.isArray(props.yValues)) {
            const linesToHide = props.yValues.filter(data => data.show !== undefined && !data.show).map(data => data.label);
            chart.hide(linesToHide);
        } else {
            if (props.yValues.show !== undefined && !props.yValues.show) {
                chart.hide(props.yValues.label);
            }
        }

        return () => {
            chart.destroy();
        }
    }, []);

    React.useEffect(() => {

        var yearsToDisplay: number[] = [];
        for (let index = chart.range.min; index <= chart.range.max; index++) {
            yearsToDisplay.push(index);
        }

        const xValues = [props.xValues.label];
        const yValues = Array.isArray(props.yValues) ?
            props.yValues.map(yData => [yData.label])
            : [props.yValues.label];

        props.xValues.data.forEach((xData, i) => {
            const showDataForYear = yearsToDisplay.includes(xData.getFullYear());
            if (showDataForYear) {
                xValues.push(xData.toISOString().split('T')[0]);

                if (Array.isArray(props.yValues)) {
                    props.yValues.forEach((data, j) => {

                        const yValuesForIndex = yValues[j];

                        (yValuesForIndex as string[]).push(data.data[i] as any);
                    })
                } else {
                    yValues.push(props.yValues.data[i] as any);
                }
            }
        });

        const data = Array.isArray(props.yValues)
            ? [xValues, ...yValues] as any
            : [xValues, yValues] as any

        chart.chart?.unload();
        chart.chart?.load({
            columns: (data)
        })

        chart.chart?.load({
            columns: (data)
        })

        return () => {
        };
    }, [chart]);

    return <div>
        <h1 className="text-center">{`${props.title} (${chart.range.min} - ${chart.range.max})`}</h1>
        {chart.min === chart.max ? undefined : <InputRange
            maxValue={chart.max}
            minValue={chart.min}
            value={chart.range}
            onChange={(value: any) => {
                setChart({ ...chart, range: value })
            }} />}
        <hr className="my-4"></hr>
        <div id={chartId} />
    </div>;
}

function createTimeSeriesChart(data: any[], chartName: string) {

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
            enabled: false
        }
    });
    return chart;
}

export default TimeSeriesChart;