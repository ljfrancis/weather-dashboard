import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudSun } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

export const Header = ({ location }) => {
  const [searchText, setSearchText] = useState("");

  const handleSearchChange = async (e) => {
    let cleanSearchText = e.target.value;
    setSearchText(cleanSearchText);
  };

  return (
    <div className="flex justify-between md:mb-4 mb-2">
      <div className="flex">
        <FontAwesomeIcon
          icon={faCloudSun}
          size="2x"
          className="text-indigo-500 m-2 md:mr-4 mr-2"
        />
        <h1 className="md:text-2xl text-lg font-semibold text-indigo-500 py-2 md:block hidden">
          Weather Dashboard
        </h1>
      </div>
      <div className="flex justify-end">
        <input
          type="text"
          placeholder="Search Location"
          onChange={handleSearchChange}
          className="searchBar border-2 border-slate-300 rounded-md p-2  md:mr-2 mr-1 w-3/5"
        />

        <a
          id="searchButton"
          href={`${window.location.href.split('?')[0]}?location=${searchText}`}
          className="md:px-6 py-3 px-2 text-white bg-indigo-500 rounded-md cursor-pointer"
        >
          Search
        </a>
      </div>
    </div>
  );
};
