import { GraphContainer } from "../GraphContainer.js";
import { VegaLite } from "react-vega";
import dayjs from "dayjs";

const tempSpec = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  description: "",
  data: { name: "table" },
  width: 300,
  height: 200,
  autosize: { type: "fit-x", contains: "padding" },
  background: null,
  config: {
    legend: { disable: true },
    style: {
      cell: {
        stroke: "transparent",
      },
    },
    axis: { gridColor: "#d7dffe" },
    axisY: { titleAngle: -90, titleX: -30, titleY: 140, titleAlign: "left" },
  },
  encoding: {
    y: {
      field: "tempHigh",
      type: "quantitative",
      title: "Temperature (F)",
      scale: { domain: { unionWith: [0, 100] } },
    },
    x: {
      field: "date",
      type: "nominal",
      sort: { field: "timestamp" },
      axis: {
        offset: 5,
        ticks: false,
        minExtent: 70,
        domain: false,
        labelAngle: 0,
        title: "",
      },
    },
  },
  layer: [
    {
      mark: "line",
      encoding: {
        detail: {
          field: "date",
          type: "nominal",
        },
        color: { value: "#db646f" },
      },
    },
    {
      mark: {
        type: "point",
        filled: true,
      },
      encoding: {
        y: {
          field: "tempHigh",
          type: "quantitative",
        },
        color: {
          value: "#4F46E5",
        },
        tooltip: { field: "tempHigh", type: "quantitative" },
        size: { value: 100 },
        opacity: { value: 1 },
      },
    },
    {
      mark: {
        type: "point",
        filled: true,
      },
      encoding: {
        y: {
          field: "tempLow",
          type: "quantitative",
        },
        color: {
          value: "#6366F1",
        },
        tooltip: { field: "tempLow", type: "quantitative" },
        size: { value: 100 },
        opacity: { value: 1 },
      },
    },
  ],
};

export const RecentTempsGraph = ({ temperatures }) => {
  const tempData = {
    table: [],
  };

  temperatures.map((day, i) => {
    tempData.table.push({
      date: dayjs()
        .subtract(i + 1, "days")
        .format("ddd"),
      timestamp: dayjs()
        .subtract(i + 1, "days")
        .unix(),
      tempHigh: day.high,
      tempLow: day.low,
      color: "#4F46E5",
    });
    return;
  });

  return (
    <GraphContainer>
      <h1 className="text-lg">Recent High Low Temperatures</h1>
      <div className="mt-8 w-full">
        <VegaLite spec={tempSpec} actions={false} data={tempData} />
      </div>
    </GraphContainer>
  );
};
