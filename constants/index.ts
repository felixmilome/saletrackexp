import arrowDown from "@/assets/icons/arrow-down.png";
import arrowUp from "@/assets/icons/arrow-up.png";
import backArrow from "@/assets/icons/back-arrow.png";
import chat from "@/assets/icons/chat.png";
import checkmark from "@/assets/icons/check.png";
import close from "@/assets/icons/close.png";
import dollar from "@/assets/icons/dollar.png";
import email from "@/assets/icons/email.png";
import eyecross from "@/assets/icons/eyecross.png";
import google from "@/assets/icons/google.png";
import home from "@/assets/icons/home.png";
import list from "@/assets/icons/list.png";
import lock from "@/assets/icons/lock.png";
import map from "@/assets/icons/map.png";
import marker from "@/assets/icons/marker.png";
import out from "@/assets/icons/out.png";
import person from "@/assets/icons/person.png";
import pin from "@/assets/icons/pin.png";
import point from "@/assets/icons/point.png";
import profile from "@/assets/icons/profile.png";
import search from "@/assets/icons/search.png";
import selectedMarker from "@/assets/icons/selected-marker.png";
import star from "@/assets/icons/star.png";
import target from "@/assets/icons/target.png";
import to from "@/assets/icons/to.png";
import check from "@/assets/images/check.png";
import getStarted from "@/assets/images/get-started.png";
import message from "@/assets/images/message.png";
import noResult from "@/assets/images/no-result.png";
import onboarding1 from "@/assets/images/onboarding1.png";
import onboarding2 from "@/assets/images/onboarding2.png";
import onboarding3 from "@/assets/images/onboarding3.png";
import signUpCar from "@/assets/images/signup-car.png";
import delvan from "@/assets/images/delvan.jpeg";
import delvan2 from "@/assets/images/delvan2.jpeg";
import delvan3 from "@/assets/images/delvan3.jpeg";
import delorry from "@/assets/images/delorry.jpeg";
import vehicles from "@/assets/images/vehicles.png";
import ambnoma from "@/assets/images/ambnoma.png";
import ambenz from "@/assets/images/ambenz.png";
import ambike from "@/assets/images/ambike.png";
import ambusy from "@/assets/images/ambusy.png";
import specbike from "@/assets/images/specbike.png";

 
export const images = {
  onboarding1,
  onboarding2,
  onboarding3,
  getStarted,
  signUpCar,
  check,
  noResult,
  message,
  delvan,
  delvan2,
  delvan3,
  delorry,
  vehicles,
  ambnoma,
  ambenz,
  ambike,
  ambusy,
  specbike
};

export const icons = {
  arrowDown,
  arrowUp,
  backArrow,
  chat,
  checkmark,
  close,
  dollar,
  email,
  eyecross,
  google,
  home,
  list,
  lock,
  map,
  marker,
  out,
  person,
  pin,
  point,
  profile,
  search,
  selectedMarker,
  star,
  target,
  to,
};

export const onboarding = [
  {
    id: 1,
    title: "Order An Ambulance!",
    description:
      "Get fast, reliable medical assistance anytime, anywhere, with professional paramedics ready to respond.",
    image:images.ambnoma
  },
  {
    id: 2,
    title: "Book Specimen Collection",
    description:
      "Book a trained medical professional to collect your lab samples—blood, urine, or swabs—safely from home and deliver them to trusted labs",
    image:images.specbike
  },
  {
    id: 3,
    title: "Immediate Emergency Assistance!",
    description:
      "When every second matters, our ambulances and paramedics are just a tap away, providing urgent care and rapid transport in critical situations.",
    image:images.ambusy
  },
];

export const data = { 
  onboarding,
};

export const accountNames = {agent: 'Agent', admin: 'Admin'}
export const serviceTypes = { specimen_delivery: 'Specimen Delivery', bike_ambulance: 'Bike Ambulance', bls_ambulance:'BLS Ambulance', acls_ambulance:'ACLS AMBULANCE'}


