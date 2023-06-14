import { FunctionComponent, useState } from "react";


import { MyContext } from "./MyContext";
import { ContextData } from "./schemas";
import FlightFinder from "./components/FlightFinder";
import BookFlight from "./components/BookFlight";
import { flightsData } from "./flightsData";

const App: FunctionComponent = (): JSX.Element => {
  const [data, setData] = useState<ContextData>(flightsData);
  const [selectedFlightID, setSelectedFlightId] = useState<number|undefined>();
  return (
    <div className="text-center">
      <MyContext.Provider value={{ data, setData, selectedFlightID, setSelectedFlightId }}>
        <h1>App</h1>
        <FlightFinder/>
        {selectedFlightID?<BookFlight/>:<></>}
      </MyContext.Provider>
    </div>
  );
};

export default App;
