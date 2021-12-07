import React, { useEffect, useState } from "react";
import ClientInfoForm from "./ClientInfoForm";
import ServiceInfoForm from "./ServiceInfoForm";
import AvailabilityDetails from "./AvailabilityDetails";
import Success from "./Success";
import axios from "axios";
import { LocationAndServiceInfoUrl, reserve_url } from "../constants/urls";

export default function Reservation() {
  const [serviceAndLocation, setServiceAndLocation] = useState({});
  const [step, setStep] = useState(1);
  const [clientInfo, setClientInfo] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    email: "",
  });
  const [serviceInfo, setServiceInfo] = useState({
    name: "",
    location: "",
    date: "",
  });
  const [avails, setAvailabilities] = useState({});

  useEffect(() => {
    axios.get(LocationAndServiceInfoUrl).then((response) => {
      setServiceAndLocation(response.data);
      console.log(response.data);
    });
  }, []);

  const nextStep = () => {
    setStep((prevStep) => {
      return prevStep + 1;
    });
  };

  const prevStep = () => {
    setStep((prevStep) => {
      return prevStep - 1;
    });
  };

  const handleChangeClient = (input) => (e) => {
    setClientInfo((prevState) => {
      return {
        ...prevState,
        [input]: e.target.value,
      };
    });
  };

  const handleChangeService = (input) => (e) => {
    setServiceInfo((prevState) => {
      return {
        ...prevState,
        [input]: e.target.value,
      };
    });
  };
  const handleChangeAvailabilities = (value) => {
    console.log(value);
    setAvailabilities(value);
  };

  // const handleReservation = (slot, employee_id) => {
  //     const start_time = slot[0]
  //     const end_time = slot[1]
  //     axios({
  //         method: 'post',
  //         url: reserve_url,
  //         data: {
  //             client: {
  //                 first_name: clientInfo.first_name,
  //                 last_name: clientInfo.last_name,
  //                 phone_number: clientInfo.phone_number,
  //                 email: clientInfo.email,
  //             },
  //             service: {
  //                 name: serviceInfo.name,
  //                 location: serviceInfo.location,
  //                 date: serviceInfo.date,
  //             },
  //             reservation: {
  //                 start_time: start_time,
  //                 end_time: end_time,
  //                 employee_id: employee_id,
  //             }
  //         }
  //       });
  // }

  // const {first_name, last_name, phone_number, email} = clientInfo
  // const {name, location, date} = serviceInfo

  switch (step) {
    case 1:
      return (
        <ClientInfoForm
          nextStep={nextStep}
          handleChangeClient={handleChangeClient}
          clientInfo={clientInfo}
          serviceInfo={serviceInfo}
        />
      );
    case 2:
      return (
        <ServiceInfoForm
          nextStep={nextStep}
          prevStep={prevStep}
          serviceAndLocation={serviceAndLocation}
          handleChangeService={handleChangeService}
          handleChangeAvailabilities={handleChangeAvailabilities}
          clientInfo={clientInfo}
          serviceInfo={serviceInfo}
        />
      );
    case 3:
      return (
        <AvailabilityDetails
          nextStep={nextStep}
          prevStep={prevStep}
          clientInfo={clientInfo}
          serviceInfo={serviceInfo}
          avails={avails}
        />
      );
    case 4:
      return <Success />;
  }
  return <div></div>;
}
