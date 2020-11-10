import * as React from "react";
import * as c3 from "c3";
import 'c3/c3.css';
import { nextId, round } from "../logic/helper";

export interface DonutChartProps {
    data: any[];
    title: string;
    donutSliceClicked?: (chartTitle: string, sliceName: string) => void;
}

const DonutChart = (props: DonutChartProps) => {

    const chartId = "Chart-" + nextId();

    React.useEffect(() => {
        const chart = createDonutChart(props.data, chartId, props.title, props.donutSliceClicked);

        return () => {
            chart.destroy();
        }
    }, []);

    return <div id={chartId}></div>;
}

function createDonutChart(data: any[], chartName: string, title: string, donutSliceClicked?: (chartTitle: string, sliceName: string) => void) {

    var chart = c3.generate({
        bindto: `#${chartName}`,
        data: {
            columns: data,
            type: 'donut',
            onclick: (d, element) => {
                if (donutSliceClicked) {
                    donutSliceClicked(title, d.id);
                }
            }
        },
        donut: {
            title: title,
            label: {
                format: (value, ratio, id) => {
                    return round(value) + " €";
                }
            }
        }
    });
    return chart;
}

export default DonutChart;