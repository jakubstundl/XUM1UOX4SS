export type ContextData = FlightData[];

export type FlightData = {
  id: number;
  from: string;
  to: string;
  departure: string;
  arrival: string;
  duration: string;
  price: number;
  seats: {
    id: number;
    number: string;
    available: boolean;
  }[];
};

export type Reserved = {
  [k: string]: {
    name: string;
    email:string;
    passportId: string;
    dayOfBirth: string };
};

export type SelectFilter = {
  from: string | undefined;
  to: string | undefined;
  departure: string | undefined;
  arrival: string | undefined;
  price: number|undefined;
};
