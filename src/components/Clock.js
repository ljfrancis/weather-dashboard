import { useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export const Clock = ({ tz }) => {
  let time = new dayjs().tz(tz).format("h:mm A");

  const [ctime, setTime] = useState(time);
  const UpdateTime = () => {
    time = new dayjs().tz(tz).format("h:mm A");
    setTime(time);
  };
  setInterval(UpdateTime);
  return <p className="text-lg my-1">{ctime}</p>;
};
