import { createContext } from "react";
import { ContextData } from "./schemas";

export const MyContext = createContext<{
  data: ContextData | undefined;
  setData: React.Dispatch<React.SetStateAction<ContextData>> | undefined;
  selectedFlightID: number | undefined;
  setSelectedFlightId: React.Dispatch<React.SetStateAction<number|undefined>> | undefined;
}>({
  data: undefined,
  setData: undefined,
  selectedFlightID: undefined,
  setSelectedFlightId: undefined,
});


