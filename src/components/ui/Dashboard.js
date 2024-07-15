import { useState, useEffect } from "react";
import { Overview } from "../Overview.js";
import { ForecastDay } from "../ForecastDay.js";
import { Conditions } from "./Conditions.js";
import { Header } from "../Header.js";
import { Footer } from "../Footer.js";
import { PrecipitationGraph } from "./PrecipitationGraph.js";
import { RecentTempsGraph } from "./RecentTempsGraph.js";
import { useSearchParams } from "react-router-dom";

import dayjs from "dayjs";

export const Dashboard = () => {
	const [forecast, setForecast] = useState(null);
	const [history, setHistory] = useState([]);
	const [precipitation, setPrecipitation] = useState([]);
	const [pastTemps, setPastTemps] = useState([]);

	const [searchParams] = useSearchParams();

	//Search query passed as URL param
	const location = searchParams.get("location") || "Washington, DC";
	const weatherKey = process.env.REACT_APP_WEATHER_KEY;

	//key for caching and retrieving previous requests
	const forecastKey = `${location}${dayjs().format("MMDDHH")}`;
	const historicalDays = [1, 2, 3, 4, 5].map((i) =>
		dayjs().subtract(i, "days").format("YYYY-MM-DD"),
	);

	//Pull weather data from Weather API
	const GetData = () => {
		useEffect(() => {
			//Forecast + Today's weather
			//retrieve from local storage if request made within an hour
			if (localStorage.getItem(forecastKey)) {
				setForecast(JSON.parse(localStorage.getItem(forecastKey)));
			} else {
				fetch(
					`https://api.weatherapi.com/v1/forecast.json?key=${weatherKey}&q=${location}&aqi=yes&days=6`,
				)
					.then((res) => {
						return res.json();
					})
					.then((data) => {
						localStorage.setItem(forecastKey, JSON.stringify(data));
						setForecast(data);
					});
			}

			//Past 7 days weather data
			historicalDays.map((hDay, i) => {
				const historyKey = `${location}${hDay}`;

				if (localStorage.getItem(historyKey)) {
					populatePrecipitationTemps(
						JSON.parse(localStorage.getItem(historyKey)),
						i,
					);
				} else {
					fetch(
						`https://api.weatherapi.com/v1/history.json?key=${weatherKey}&q=${location}&date=${hDay}`,
					)
						.then((res) => {
							return res.json();
						})
						.then((data) => {
							localStorage.setItem(historyKey, JSON.stringify(data));
							const newHistoricalData = history;
							newHistoricalData[i] = data;
							setHistory(newHistoricalData);

							populatePrecipitationTemps(data, i);
						});
				}
				return;
			});
		}, []);
		return;
	};

	//Create data arrays of past precipitation and temperature data from all past weather requests
	const populatePrecipitationTemps = function (dayData, i) {
		const precip =
			dayData?.forecast?.forecastday?.[0]?.day?.totalprecip_in || 0;
		const tempHigh = dayData?.forecast?.forecastday?.[0]?.day?.maxtemp_f;
		const tempLow = dayData?.forecast?.forecastday?.[0]?.day?.mintemp_f;

		const newPrecipData = precipitation;
		const newPastTempData = pastTemps;

		newPrecipData[i] = precip;
		newPastTempData[i] = {
			low: tempLow,
			high: tempHigh,
		};

		setPrecipitation(newPrecipData);
		setPastTemps(newPastTempData);
	};

	GetData();

	const forecastDays = forecast?.forecast?.forecastday;
	let tempUnit = "F";

	let locationName = "";
	if (!forecast) locationName = "Loading....";
	if (forecast?.error) {
		locationName = "Location Not Found";
	} else if (forecast?.location?.name) {
		locationName = `${forecast?.location?.name || ""}, ${forecast?.location?.region || ""}`;
	}

	const timezone = forecast?.location?.tz_id;

	return (
		<div className="m-8">
			<Header></Header>

			{/* WEB */}
			<div className="hidden md:flex">
				<Overview
					location={locationName}
					tz={timezone}
					currentTemp={forecast?.current?.temp_f || ""}
					lowTemp={forecastDays?.[0]?.day?.mintemp_f || ""}
					hiTemp={forecastDays?.[0]?.day?.maxtemp_f || ""}
					conditionText={forecast?.current?.condition?.text || ""}
					conditionIcon={forecast?.current?.condition?.icon.slice(-7, -4)}
					tempUnit={tempUnit}
				/>

				<div className="flex flex-col w-2/3">
					<div className="flex w-full">
						<ForecastDay
							dayOfWeek={dayjs().add(1, "day").format("dddd")}
							lowTemp={forecastDays?.[1]?.day?.mintemp_f || ""}
							hiTemp={forecastDays?.[1]?.day?.maxtemp_f || ""}
							condition={forecastDays?.[1]?.day?.condition?.icon.slice(-7, -4)}
							tempUnit={tempUnit}
						/>
						<ForecastDay
							dayOfWeek={dayjs().add(2, "day").format("dddd")}
							lowTemp={forecastDays?.[2]?.day?.mintemp_f || ""}
							hiTemp={forecastDays?.[2]?.day?.maxtemp_f || ""}
							condition={forecastDays?.[2]?.day?.condition?.icon.slice(-7, -4)}
							tempUnit={tempUnit}
						/>
						{/*Only two future days supported with free API*/}
						{/*	<ForecastDay
							dayOfWeek={dayjs().add(3, "day").format("ddd")}
							lowTemp={forecastDays?.[3]?.day?.mintemp_f || ""}
							hiTemp={forecastDays?.[3]?.day?.maxtemp_f || ""}
							condition={forecastDays?.[3]?.day?.condition?.icon.slice(-7, -4)}
							tempUnit={tempUnit}
						/>
						<ForecastDay
							dayOfWeek={dayjs().add(4, "day").format("ddd")}
							lowTemp={forecastDays?.[4]?.day?.mintemp_f || ""}
							hiTemp={forecastDays?.[4]?.day?.maxtemp_f || ""}
							condition={forecastDays?.[4]?.day?.condition?.icon.slice(-7, -4)}
							tempUnit={tempUnit}
						/>
						<ForecastDay
							dayOfWeek={dayjs().add(5, "day").format("ddd")}
							lowTemp={forecastDays?.[5]?.day?.mintemp_f || ""}
							hiTemp={forecastDays?.[5]?.day?.maxtemp_f || ""}
							condition={forecastDays?.[5]?.day?.condition?.icon.slice(-7, -4)}
							tempUnit={tempUnit}
						/>*/}
					</div>
					<Conditions
						uv={forecast?.current?.uv || 0}
						airQuality={forecast?.current?.air_quality?.["us-epa-index"] || 0}
						humidity={forecast?.current?.humidity || 0}
						windSpeed={forecast?.current?.wind_mph || 0}
						windDirection={forecast?.current?.wind_dir}
					/>
				</div>
			</div>
			<div className="hidden md:flex">
				<PrecipitationGraph precipitation={precipitation} />
				<RecentTempsGraph temperatures={pastTemps} />
			</div>

			{/* MOBILE */}
			<div className="md:hidden flex flex-col">
				<Overview
					location={locationName}
					tz={timezone}
					currentTemp={forecast?.current?.temp_f || ""}
					lowTemp={forecastDays?.[0]?.day?.mintemp_f || ""}
					hiTemp={forecastDays?.[0]?.day?.maxtemp_f || ""}
					conditionText={forecast?.current?.condition?.text || ""}
					conditionIcon={forecast?.current?.condition?.icon.slice(-7, -4)}
					tempUnit={tempUnit}
				/>

				<div className="flex w-full mx-2">
					<ForecastDay
						dayOfWeek={dayjs().add(1, "day").format("ddd")}
						lowTemp={forecastDays?.[1]?.day?.mintemp_f || ""}
						hiTemp={forecastDays?.[1]?.day?.maxtemp_f || ""}
						condition={forecastDays?.[1]?.day?.condition?.icon.slice(-7, -4)}
						tempUnit={tempUnit}
					/>
					<ForecastDay
						dayOfWeek={dayjs().add(2, "day").format("ddd")}
						lowTemp={forecastDays?.[2]?.day?.mintemp_f || ""}
						hiTemp={forecastDays?.[2]?.day?.maxtemp_f || ""}
						condition={forecastDays?.[2]?.day?.condition?.icon.slice(-7, -4)}
						tempUnit={tempUnit}
					/>
					{/*Only two future days supported with free API*/}
					{/* <ForecastDay
						dayOfWeek={dayjs().add(3, "day").format("ddd")}
						lowTemp={forecastDays?.[3]?.day?.mintemp_f || ""}
						hiTemp={forecastDays?.[3]?.day?.maxtemp_f || ""}
						condition={forecastDays?.[3]?.day?.condition?.icon.slice(-7, -4)}
						tempUnit={tempUnit}
					/>*/}
				</div>
				<Conditions
					uv={forecast?.current?.uv || 0}
					airQuality={forecast?.current?.air_quality?.["us-epa-index"] || 0}
					humidity={forecast?.current?.humidity || 0}
					windSpeed={forecast?.current?.wind_mph || 0}
					windDirection={forecast?.current?.wind_dir}
				/>
				<PrecipitationGraph precipitation={precipitation} />
				<RecentTempsGraph temperatures={pastTemps} />
			</div>
			<Footer></Footer>
		</div>
	);
};
