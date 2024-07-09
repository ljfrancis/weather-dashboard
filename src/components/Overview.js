import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { iconMap } from "../utils/iconMap.js";
import { faFaceFrown, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { Clock } from "./Clock.js";

export const Overview = ({
  location,
  tz,
  currentTemp,
  lowTemp,
  hiTemp,
  conditionText,
  conditionIcon,
  tempUnit,
}) => {
  return (
    <div className="bg-indigo-500 m-2 p-4 rounded-lg text-white md:w-1/3 w-full">
      <p className="text-2xl my-3">{location}</p>
      <Clock tz={tz} />
      <p className="text-lg my-1">{`${currentTemp}°F`}</p>
      <p className="text-lg my-1">{`${lowTemp}° / ${hiTemp}°`}</p>
      <p className="text-xl mt-6">{conditionText}</p>
      <FontAwesomeIcon
        icon={
          location === "Loading...."
            ? faSpinner
            : location === "Location Not Found"
              ? faFaceFrown
              : iconMap[conditionIcon]
        }
        size="4x"
        className="m-auto mt-8 md:mb-1 mb-4"
      />
    </div>
  );
};
