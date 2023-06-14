import React, { FunctionComponent, useContext, useState } from "react";
import { MyContext } from "../MyContext";
import { FlightData, SelectFilter } from "../schemas";

const FlightFinder: FunctionComponent = (): JSX.Element => {
  const { data, selectedFlightID, setSelectedFlightId } = useContext(MyContext);

  const [selectFilter, setSelectFilter] = useState<SelectFilter>({
    from: undefined,
    to: undefined,
    departure: undefined,
    arrival: undefined,
    price: undefined,
  });

  const filterBySelects = (flightData: FlightData, ignore: string) => {
    let key: keyof SelectFilter;
    for (key in selectFilter) {
      if (
        selectFilter[key] &&
        ignore !== key &&
        `${selectFilter[key]}` !== `${flightData[key]}`
      )
        return false;
    }
    return (
      flightData.seats.filter((seatAvailable) => seatAvailable.available)
        .length > 0
    );
  };

  const isDate = (date: string) => {
    return !isNaN(Date.parse(date));
  };

  const setFlightId = (id: number) => {
    if (setSelectedFlightId) {
      if (selectedFlightID === id) {
        setSelectedFlightId(undefined);
      } else {
        setSelectedFlightId(id);
      }
    }
  };

  return (
    <>
      <h2 className="text-2xl">FlightFinder</h2>
      <div>
        {(Object.keys(selectFilter) as (keyof SelectFilter)[]).map(
          (filterKey) => (
            <label key={filterKey}>
              {filterKey[0].toUpperCase() +
                filterKey.slice(1, filterKey.length) +
                ": "}
              <select
                key={filterKey}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setSelectFilter({
                    ...selectFilter,
                    [filterKey]: e.target.value,
                  })
                }
                value={selectFilter[filterKey] ? selectFilter[filterKey] : ""}
              >
                <option key={-1} value={""}>
                  Any
                </option>
                {[
                  ...new Set(
                    data
                      ?.filter((filterValue) =>
                        filterBySelects(filterValue, filterKey)
                      )
                      .map((filterValue) => {
                        return filterValue[filterKey];
                      })
                  ),
                ].map((data) => {
                  const dataToDisplay =
                    isDate(`${data}`) &&
                    (filterKey === "departure" || filterKey === "arrival")
                      ? new Date(data).toLocaleString("cs")
                      : data;
                  return (
                    <option key={data} value={data}>
                      {dataToDisplay}
                    </option>
                  );
                })}
              </select>
            </label>
          )
        )}
      </div>

      <h2>Flights</h2>
      <ul className="flex flex-wrap">
        {data ? (
          data
            .filter((flight) => filterBySelects(flight, ""))
            .map((flight) => {
              return (
                <li
                  className="border-[2px] text-start max-w-[500px]"
                  style={{
                    backgroundColor:
                      flight.id === selectedFlightID ? "yellow" : "white",
                  }}
                  key={flight.id}
                  onClick={() => {
                    setFlightId(flight.id);
                  }}
                >
                  Id:{flight.id} <br />
                  From: {flight.from} <br />
                  To: {flight.to} <br />
                  Departure: {new Date(flight.departure).toLocaleString(
                    "cs"
                  )}{" "}
                  <br />
                  Arrival:{new Date(flight.arrival).toLocaleString("cs")} <br />
                  Duration: {flight.duration} <br />
                  Price: {flight.price} <br />
                </li>
              );
            })
        ) : (
          <></>
        )}
      </ul>
    </>
  );
};

export default FlightFinder;
