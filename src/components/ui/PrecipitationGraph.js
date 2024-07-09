import { GraphContainer } from "../GraphContainer.js";
import { VegaLite } from "react-vega";
import dayjs from "dayjs";

const precipSpec = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  description: "",
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
    axisY: { titleAngle: -90, titleX: -30, titleY: 100, titleAlign: "left" },
  },
  data: { name: "table" },
  mark: {
    type: "area",
    line: {
      color: "#4F46E5",
    },
    color: {
      x1: 1,
      y1: 1,
      x2: 1,
      y2: 0,
      gradient: "linear",
      stops: [
        {
          offset: 0,
          color: "#818CF8",
        },
        {
          offset: 1,
          color: "#4F46E5",
        },
      ],
    },
  },
  encoding: {
    x: {
      field: "date",
      type: "nominal",
      axis: { labelAngle: 0, title: "" },
      sort: { field: "timestamp" },
    },
    y: {
      field: "value",
      type: "quantitative",
      title: "inches",
      scale: { domain: { unionWith: [0, 1.5] } },
    },
    tooltip: { field: "value", type: "quantitative" },
  },
};

export const PrecipitationGraph = ({ precipitation }) => {
  const precipData = {
    table: [],
  };

  precipitation.map((day, i) => {
    precipData.table.push({
      date: dayjs()
        .subtract(i + 1, "days")
        .format("ddd"),
      timestamp: dayjs()
        .subtract(i + 1, "days")
        .unix(),
      value: day,
      color: "#4F46E5",
    });
    return;
  });

  return (
    <GraphContainer>
      <h1 className="text-lg">Past Precipitation</h1>
      <div className="mt-8">
        <VegaLite spec={precipSpec} actions={false} data={precipData} />
      </div>
    </GraphContainer>
  );
};
