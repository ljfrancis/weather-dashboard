import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { iconMap } from "../utils/iconMap.js";

export const ForecastDay = ({
  dayOfWeek,
  hiTemp,
  lowTemp,
  condition,
  tempUnit,
}) => {
  return (
    <div className="bg-gray-300 md:m-2 m-1 p-4 rounded-lg text-sm w-1/2">
      <p>{dayOfWeek}</p>
      <p>{`${Math.round(lowTemp)}° / ${Math.round(hiTemp)}°`}</p>
      {!lowTemp && !hiTemp && (
        <p className="text-xs mt-1">Forecast Not Available</p>
      )}
      {iconMap[condition] && (
        <FontAwesomeIcon
          icon={iconMap[condition]}
          size="2x"
          className="mt-2 text-indigo-600 opacity-70"
        />
      )}
    </div>
  );
};
