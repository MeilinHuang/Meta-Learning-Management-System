import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";

interface BarChartProps {
    chartData: any;
    chartOptions: any;
}

const BarChart: React.FC<BarChartProps> = ({ chartData, chartOptions }) => {
    const [chartState, setChartState] = useState({
        chartData: [],
        chartOptions: {}
    });

    useEffect(() => {
        setChartState({
            chartData: chartData,
            chartOptions: chartOptions
        });
    }, [chartData, chartOptions]);

    return (
        <Chart
            options={chartState.chartOptions}
            series={chartState.chartData}
            type="bar"
            width="100%"
            height="100%"
        />
    );
};

BarChart.defaultProps = {
    chartData: [
        {
            name: "Daily Traffic",
            data: [20, 30, 40, 20, 45, 50, 30]
        }
    ],
    chartOptions: {
        chart: {
            toolbar: {
                show: false
            }
        },
        tooltip: {
            style: {
                fontSize: "12px",
                fontFamily: undefined
            },
            onDatasetHover: {
                style: {
                    fontSize: "12px",
                    fontFamily: undefined
                }
            },
            theme: "dark"
        },
        xaxis: {
            categories: ["00", "04", "08", "12", "14", "16", "18"],
            show: false,
            labels: {
                show: true,
                style: {
                    colors: "#A3AED0",
                    fontSize: "14px",
                    fontWeight: "500"
                }
            },
            axisBorder: {
                show: false
            },
            axisTicks: {
                show: false
            }
        },
        yaxis: {
            show: false,
            color: "black",
            labels: {
                show: true,
                style: {
                    colors: "#CBD5E0",
                    fontSize: "14px"
                }
            }
        },
        grid: {
            show: false,
            strokeDashArray: 5,
            yaxis: {
                lines: {
                    show: true
                }
            },
            xaxis: {
                lines: {
                    show: false
                }
            }
        },
        fill: {
            type: "gradient",
            gradient: {
                type: "vertical",
                shadeIntensity: 1,
                opacityFrom: 0.7,
                opacityTo: 0.9,
                colorStops: [
                    [
                        {
                            offset: 0,
                            color: "#4318FF",
                            opacity: 1
                        },
                        {
                            offset: 100,
                            color: "rgba(67, 24, 255, 1)",
                            opacity: 0.28
                        }
                    ]
                ]
            }
        },
        dataLabels: {
            enabled: false
        },
        plotOptions: {
            bar: {
                borderRadius: 10,
                columnWidth: "40px"
            }
        }
    }
};

export default BarChart;
