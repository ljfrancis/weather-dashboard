import React from "react";
import { VegaLite } from "react-vega";

const getDialSpec = (title, value) => {
  return {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    data: { name: "table" },
    background: null,
    config: { legend: { disable: true } },
    layer: [
      {
        mark: { type: "arc", radius2: 60 },
        width: "container",
        height: 100,
        encoding: {
          theta: {
            field: "value",
            type: "quantitative",
            scale: {
              type: "linear",
              rangeMax: 1.5708,
              rangeMin: -1.5708,
            },
          },
          color: { field: "color", type: "nominal", legend: null, scale: null },
        },
      },
      {
        mark: { type: "text", style: "label", fontSize: 12 },
        encoding: {
          text: { value: title },
        },
      },
      {
        mark: {
          type: "text",
          style: "label",
          fontSize: 16,
          dy: { expr: "(height/2) - 70" },
        },
        encoding: {
          text: { value: value },
        },
      },
    ],
  };
};

const getHumiditySpec = (humidity) => {
  return {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    config: {
      view: { fill: "transparent", stroke: "transparent" },
      scale: { bandPaddingInner: 0 },
      legend: { disable: true },
    },
    width: "container",
    height: 20,
    background: null,
    layer: [
      {
        mark: "bar",
        data: { name: "table" },
        encoding: {
          x: {
            field: "humidity",
            type: "quantitative",
            axis: null,
          },
          y: { value: 1 },
          color: { field: "color", type: "nominal", legend: null, scale: null },
        },
      },
    ],
  };
};

//get degrees to rotate compass from the direction description in API response
const compassToDegrees = function (dir) {
  var arr = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
  ];
  return arr.indexOf(dir) * 22.5;
};

const WindDial = ({ windSpeed, windDirection }) => {
  const degrees = compassToDegrees(windDirection);

  return (
    <>
      <svg width="120" height="130" className="m-auto">
        <defs>
          <mask id="bigmask">
            <rect width="100%" height="100%" fill="white" />
            <circle cx="60" cy="60" r="40" />
          </mask>
        </defs>

        <circle
          id="donut"
          cx="60"
          cy="60"
          r="50"
          fill="#818CF8"
          mask="url(#bigmask)"
        />
        <line
          x1="60"
          y1="0"
          x2="60"
          y2="30"
          strokeWidth="5"
          stroke="#4F46E5"
          transform={`rotate(${degrees})`}
          transform-origin="60 60"
        />
        <text x="50%" y="48" textAnchor="middle" className="text-xs">
          Wind
        </text>
        <text
          x="50%"
          y="63"
          textAnchor="middle"
          className="text-xs"
        >{`${windSpeed}mph`}</text>
        <text x="50%" y="78" textAnchor="middle" className="text-xs">
          {windDirection}
        </text>
      </svg>
    </>
  );
};

export const Conditions = ({
  uv,
  airQuality,
  humidity,
  windSpeed,
  windDirection,
}) => {
  const uvData = {
    table: [
      { type: "+", value: uv, color: "#4F46E5" },
      { type: "-", value: 20 - uv, color: "#818CF8" },
    ],
  };

  const aqData = {
    table: [
      { type: "+", value: airQuality, color: "#4F46E5" },
      { type: "-", value: 50 - airQuality, color: "#818CF8" },
    ],
  };

  const humidityData = {
    table: [
      { humidity: humidity, color: "#4F46E5" },
      { humidity: 100 - humidity, color: "#818CF8" },
    ],
  };

  return (
    <>
      {/*WEB*/}
      <div className="bg-gray-300 m-2 p-4 rounded-lg hidden md:flex flex-col">
        <div className="md:flex justify-center">
          <div className="flex flex-col justify-center w-2/5">
            <VegaLite
              spec={getHumiditySpec(humidity)}
              actions={false}
              data={humidityData}
            />
            <p className="text-xs w-full text-center">{`Humidity`}</p>
            <p className="text-md w-full text-center">{`${humidity}%`}</p>
          </div>

          <div className="w-2/5">
            <WindDial windSpeed={windSpeed} windDirection={windDirection} />
          </div>
        </div>
        <div className="md:flex justify-center">
          <div className="flex flex-col justify-center w-2/5">
            <VegaLite
              spec={getDialSpec("UV Index", uv)}
              actions={false}
              data={uvData}
            />
          </div>
          <div className="flex flex-col justify-center w-2/5">
            <VegaLite
              spec={getDialSpec("Air Quality", airQuality)}
              actions={false}
              data={aqData}
            />
          </div>
        </div>
      </div>

      {/*MOBILE*/}
      <div className="bg-gray-300 m-2 p-4 rounded-lg md:hidden flex flex-col justify-center w-full">
        <div className="flex flex-col justify-center w-full px-10">
          <VegaLite
            spec={getHumiditySpec(humidity)}
            actions={false}
            data={humidityData}
          />
          <p className="text-xs w-full text-center">{`Humidity`}</p>
          <p className="text-md w-full text-center">{`${humidity}%`}</p>
        </div>

        <div className="w-full">
          <WindDial windSpeed={windSpeed} windDirection={windDirection} />
        </div>
        <div className="flex flex-col justify-center w-full">
          <VegaLite
            spec={getDialSpec("UV Index", uv)}
            actions={false}
            data={uvData}
          />
        </div>
        <div className="flex flex-col justify-center w-full">
          <VegaLite
            spec={getDialSpec("Air Quality", airQuality)}
            actions={false}
            data={aqData}
          />
        </div>
      </div>
    </>
  );
};
