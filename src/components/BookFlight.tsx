import {
  FunctionComponent,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { MyContext } from "../MyContext";
import { FlightData, Reserved } from "../schemas";
import React from "react";

const BookFlight: FunctionComponent = (): JSX.Element => {
  const form = useRef(null);
  const { data, setData, selectedFlightID } = useContext(MyContext);
  const [reserved, setReserved] = useState<Reserved>({});
  const flightData: FlightData | undefined = data?.find(
    (flight) => flight.id === selectedFlightID
  );
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  useEffect(() => {
    setSelectedSeats([]);
    setReserved({});
  }, [selectedFlightID]);

  const seatInputsConsts = {
    numberOfInputs: 4,
    nameInputIndex: 0,
    emailInputIndex: 1,
    passportIdInputIndex: 2,
    dayOfBirthInputIndex: 3,
  };

  useEffect(() => {
    if (
      setData &&
      flightData &&
      selectedSeats.length === Object.keys(reserved).length
    ) {
      setData((prev) => {
        const flight = prev.find((flight) => flight.id === flightData.id);
        Object.keys(reserved).forEach((reservedSeat) => {
          const seat = flight?.seats.find(
            (seat) => reservedSeat === seat.number
          );
          if (seat) {
            seat.available = false;
          }
        });
        return prev;
      });
    }
  }, [reserved]);

  const handleSeatClick = (id: number) => {
    if (selectedSeats.includes(id)) {
      setSelectedSeats((prev) => {
        const temp = [...prev];
        temp.splice(prev.indexOf(id), 1);
        return temp;
      });
    } else {
      setSelectedSeats((prev) => {
        const temp = [...prev];
        temp.push(id);
        return temp;
      });
    }
  };

  const isInput = (element: any): element is HTMLInputElement => {
    return element instanceof HTMLInputElement;
  };

  return (
    <div className="text-start border-[5px]">
      {flightData &&
      reserved &&
      (Object.keys(reserved).length === 0 ||
        selectedSeats.length !== Object.keys(reserved).length) ? (
        <>
          <h1>Flight ID:{" " + selectedFlightID}</h1>
          <ul>
            <li> From:{flightData?.from}</li>
            <li> To:{flightData?.to}</li>
            <li>
              {" "}
              Departure:{new Date(flightData.departure).toLocaleString("cs")}
            </li>
            <li>
              {" "}
              Arrival:{new Date(flightData.arrival).toLocaleString("cs")}
            </li>
            <li> Duration:{flightData.duration}</li>
            <li> Price:{flightData?.price}</li>
            <li> Seats available:</li>
          </ul>
          <ul className="flex">
            {flightData?.seats.map((seat) => {
              return seat.available ? (
                <li
                  className="cursor-pointer"
                  style={{
                    backgroundColor: selectedSeats.includes(seat.id)
                      ? "green"
                      : "white",
                  }}
                  key={seat.id}
                  onClick={() => {
                    handleSeatClick(seat.id);
                  }}
                >
                  {seat.number}&nbsp;&nbsp;
                </li>
              ) : (
                <></>
              );
            })}
          </ul>

          <form
            className="flex"
            ref={form}
            onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
              e.preventDefault();
            }}
          >
            {selectedSeats.map((seat) => {
              return (
                <div key={seat}>
                  <h4>
                    Seat {flightData.seats.find((s) => s.id === seat)?.number}
                  </h4>
                  <label>
                    <br />
                    Name
                  </label>
                  <br />
                  <input type="text" required />
                  <br />
                  <label>
                    <br />
                    E-mail
                  </label>
                  <br />
                  <input type="email" required />
                  <br />
                  <label>
                    <br />
                    Passport number{" "}
                  </label>
                  <br />
                  <input type="text" required />
                  <br />
                  <label>
                    <br />
                    Day of birth{" "}
                  </label>
                  <br />
                  <input type="date" required />
                </div>
              );
            })}
          </form>
          {selectedSeats.length > 0 ? (
            <button
              className="border-[3px] border-black"
              onClick={() => {
                selectedSeats.forEach((seat, index) => {
                  const sn = flightData.seats.find(
                    (s) => s.id === seat
                  )?.number;
                  if (
                    form.current &&
                    isInput(
                      form.current[
                        index * seatInputsConsts.numberOfInputs +
                          seatInputsConsts.nameInputIndex
                      ]
                    ) &&
                    isInput(
                      form.current[
                        index * seatInputsConsts.numberOfInputs +
                          seatInputsConsts.emailInputIndex
                      ]
                    ) &&
                    isInput(
                      form.current[
                        index * seatInputsConsts.numberOfInputs +
                          seatInputsConsts.passportIdInputIndex
                      ]
                    ) &&
                    isInput(
                      form.current[
                        index * seatInputsConsts.numberOfInputs +
                          seatInputsConsts.dayOfBirthInputIndex
                      ]
                    ) &&
                    sn
                  ) {
                    const nameInput = form.current![
                      index * seatInputsConsts.numberOfInputs +
                        seatInputsConsts.nameInputIndex
                    ] as HTMLInputElement;
                    const emailInput = form.current![
                      index * seatInputsConsts.numberOfInputs +
                        seatInputsConsts.emailInputIndex
                    ] as HTMLInputElement;
                    const passportIdInput = form.current![
                      index * seatInputsConsts.numberOfInputs +
                        seatInputsConsts.passportIdInputIndex
                    ] as HTMLInputElement;
                    const dayOfBirthInput = form.current![
                      index * seatInputsConsts.numberOfInputs +
                        seatInputsConsts.dayOfBirthInputIndex
                    ] as HTMLInputElement;

                    if (
                      nameInput.validity.valid &&
                      emailInput.validity.valid &&
                      passportIdInput.validity.valid &&
                      dayOfBirthInput.validity.valid
                    ) {
                      setReserved((prev) => {
                        const temp = {
                          ...prev,
                          [sn]: {
                            name: nameInput.value,
                            email: emailInput.value,
                            passportId: passportIdInput.value,
                            dayOfBirth: dayOfBirthInput.value,
                          },
                        };
                        return temp;
                      });
                    } else {
                      alert(
                        `Check if all fields are filled properly for seat ${sn}`
                      );
                      return;
                    }
                  }
                });
              }}
            >
              Reserve
            </button>
          ) : (
            <></>
          )}
        </>
      ) : (
        <>
          <div>
            <h1>Flight {`(ID: ${selectedFlightID}) `} has been booked.</h1>
            <ul>
              <li>From:{flightData?.from}</li>
              <li>To:{flightData?.to}</li>
              <li>Departure:{flightData?.departure}</li>
              <li>
                Arrival:{new Date(flightData!.arrival).toLocaleString("cs")}
              </li>
              <li>Seats:</li>
            </ul>
          </div>
          {reserved
            ? Object.keys(reserved).map((key) => (
                <div key={key}>
                  {key}:{` Name: ${reserved[key].name}, `}
                  {` Email: ${reserved[key].email}, `}
                  {` PassportID: ${reserved[key].passportId}, `}
                  {` Day of birth: ${new Date(
                    reserved[key].dayOfBirth
                  ).toLocaleDateString("cs")}`}
                </div>
              ))
            : ""}
        </>
      )}
    </div>
  );
};

export default BookFlight;
