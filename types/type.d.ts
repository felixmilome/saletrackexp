import { TextInputProps, TouchableOpacityProps } from "react-native";

// ToLocationStore

declare interface Driver {
  user_id: number;
  name: string;
  profile_image_slug: string;
  vehicle_type: number;
  driver_rating?: number;
}

declare interface MarkerData {
  latitude: number;
  longitude: number;
  user_id: number;
  title?: string;
  profile_image_slug: string;
  vehicle_type: number;
  rating?: number;
  name: string;
  time?: number;
  price?: number | string;
  phone?: string;
}

declare interface MapProps {
  destinationLatitude?: number;
  destinationLongitude?: number;
  onDriverTimesCalculated?: (driversWithTimes: MarkerData[]) => void;
  selectedDriver?: number | null;
  onMapReady?: () => void;
}
// declare interface Ride {
//   id?: number | null;
//   origin_address?: string | null;
//   destination_address?: string | null;
//   origin_latitude?: number | null;
//   origin_longitude?: number | null;
//   destination_latitude?: number | null;
//   destination_longitude?: number | null;
//   service_type?: number | null;
//   ride_state?: number | null;
//   price?: number | null;
//   trip_estimate_minutes?: number | null;  // estimated total trip duration
//   trip_duration_minutes?: number | null;  // actual trip duration
//   pickup_estimate_minutes?: number | null; // estimated time to reach patient
//   pickup_duration_minutes?: number | null; // actual time taken to reach patient
//   description?: string | null;
//   created_at?: number | null;
//   client_data?: {
//     id: number | null;
//     name: string | null;
//     phone: string | null;
//     image_slug: string | null;
//   } | null;
//   driver_data?: {
//     id: number | null;
//     name: string | null;
//     vehicle_type: number | null;
//     phone: string | null;
//     image_slug: string | null;
//   } | null;
// }

declare interface Ride {
  // DB fields
  id?: number | null;
  client_id?: number | null;
  rider_id?: number | null;
  hospital_id?: number | null;
  ambulance_id?: number | null;
  pickup_address?: string | null;
  pickup_latitude?: number | null;
  pickup_longitude?: number | null;
  dropoff_address?: string | null;
  dropoff_latitude?: number | null;
  dropoff_longitude?: number | null;
  ride_state?: number | null; // e.g., 'requested', 'in_progress', 'completed'
  service_type?: number | null; 
  requested_at?: Date | null;
  started_at?: Date | null;
  completed_at?: Date | null;
  rider_latitude?: number | null;
  rider_longitude?: number | null;
  rider_address?: string | null;
  price?: number | null; 
  trip_estimate_minutes?: number | null;
  trip_duration_minutes?: number | null;
  pickup_estimate_minutes?: number | null;
  pickup_duration_minutes?: number | null;
  description?: string | null;

  // Nested convenient objects
  client_data?: {
    id?: number | null;
    name?: string | null;
    phone?: string | null;
    image_slug?: string | null;
  } | null;

  driver_data?: {
    id?: number | null;
    name?: string | null;
    phone?: string | null;
    vehicle_type?: number | null;
    image_slug?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    address?: string | null;
  } | null;
}

interface RideStore {
  ride: Ride | null;
  setRide: (ride: Ride) => void;
  updateRide: (ride: Partial<Ride>) => void;
  clearRide: () => void;
}
interface SessionStore {
  token: string | null;
  email: string | null;
  setSession: (token: string, email: string) => void;
  clearSession: () => void;
}


declare interface ButtonProps extends TouchableOpacityProps {
  title: string;
  bgVariant?: "primary" | "secondary" | "danger" | "outline" | "success";
  textVariant?: "primary" | "default" | "secondary" | "danger" | "success";
  IconLeft?: React.ComponentType<any>;
  IconRight?: React.ComponentType<any>;
  className?: string;
}

declare interface GoogleInputProps {
  icon?: string;
  initialLocation?: string;
  containerStyle?: string;
  textInputBackgroundColor?: string;
  handlePress: ({
    latitude,
    longitude,
    address,
  }: {
    latitude: number;
    longitude: number;
    address: string;
  }) => void;
}

declare interface InputFieldProps extends TextInputProps {
  label: string;
  icon?: any;
  secureTextEntry?: boolean;
  labelStyle?: string;
  containerStyle?: string;
  inputStyle?: string;
  iconStyle?: string;
  className?: string;
}

declare interface PaymentProps {
  fullName: string;
  email: string;
  amount: string;
  driverId: number;
  rideTime: number;
}

declare interface LocationStore {
  userLatitude: number | null;
  userLongitude: number | null;
  userAddress: string | null;
  originLatitude: number | null;
  originLongitude: number | null;
  originAddress: string | null;
  originLatitude: number | null;
  originLongitude: number | null;
  originAddress: string | null;
  destinationLatitude: number | null;
  destinationLongitude: number | null;
  destinationAddress: string | null;
  setUserLocation: ({
    latitude,
    longitude,
    address,
  }: {
    latitude: number;
    longitude: number;
    address: string;
  }) => void;
  setOriginLocation: ({
    latitude,
    longitude,
    address,
  }: {
    latitude: number;
    longitude: number;
    address: string;
  }) => void;
  setDestinationLocation: ({
    latitude,
    longitude,
    address,
  }: {
    latitude: number;
    longitude: number;
    address: string;
  }) => void;

  clearDestination: () => void;
  clearOrigin: () => void;



}

declare interface DriverStore {
  drivers: MarkerData[];
  selectedDriver: number | null;
  setSelectedDriver: (driverId: number) => void;
  setDrivers: (drivers: MarkerData[]) => void;
  clearSelectedDriver: () => void;
}


declare interface DriverCardProps { 
  item: AmbulanceMarker;
  selected: number;
  setSelected: () => void;
}

declare interface PackageStore {
  packageWeight: number | null;
  packageDescription: string | null;

  setPackageWeight: (weight: number) => void;
  setPackageDescription: (description: string) => void;

  clearPackage: () => void;
}


type ProfileData = {
  id: number | null;
  name?: string | null;
  email: string | null ;
  phone?: string | null ;
  account_type: number | null ;
  image_slug?: string | null; 
  created_at: number | null;
  rating?: number[] | null;
  id_image_slug?: string | null;
  conduct_image_slug: string | null;
  current_address: string | null;
  current_latitude: number | null;
  current_longitude: number | null;



} 
type AmbulanceData = {
  id: number | null;
  profession: string | null;
  vehicle_type: 0 | 1 | 2 | 3 | null;
  user_id: number | null;
  number_plate: string | null;
  colour: string | null;
  model: string | null;
  description: string | null;
  current_latitude: number | null;
  current_longitude: number | null;
  status: number | null;
  hospital_id: number | null;
  hospital_name?: number | null;
  verified: boolean;
  id_image_slug: string | null;
  rating: number[] | null;
  created_at: number | null;
};

type AmbulanceMarker = ProfileData & {
  ambulance_data: AmbulanceData | null;
};


interface AmbulanceMarkersStore {
  ambulances: AmbulanceMarker[];
  selectedAmbulance: number | null;
  setSelectedAmbulance: (id: number) => void;
  setAmbulances: (ambulances: AmbulanceMarker[]) => void;
  clearSelectedAmbulance: () => void;
}

type ProfileStore = {
  profile: ProfileData | any;
  setProfile: (data: ProfileData) => void;
  clearProfile: () => void;
};

type HospitalData = {
  id: number;            // SERIAL PRIMARY KEY → number
  user_id: number | null; // UNIQUE, can be null if not assigned
  name: string;          // NOT NULL → must exist
  address: string | null;
  license_image_slug: string | null;
  latitude: number | null;  // NUMERIC(10,7)
  longitude: number | null; // NUMERIC(10,7)
  created_at: string | null; // TIMESTAMP as ISO string
}

type HospitalStore = {
  hospital: HospitalData | any;
  setHospital: (data: HospitalData) => void;
  clearHospital: () => void;
};

type AmbulanceData = {
  id: number; // SERIAL PRIMARY KEY → always a number
  profession: string | null;  
  vehicle_type: number | null;
  user_id: number | null; // UNIQUE
  number_plate: string | null;
  colour: string | null;
  id_image_slug: string | null;
  verified: boolean;
  model: string | null;
  rating: number[] | null;
  description: string | null;
  current_latitude: number | null; // NUMERIC(10,7)
  current_longitude: number | null; // NUMERIC(10,7)
  status: string | null; // defaults to 'available'
  created_at: string | null; // TIMESTAMP as ISO string
  hospital_id: number | null;
}
type AmbulanceStore = {
  ambulance: AmbulanceData | any;
  setAmbulance: (data: AmbulanceData) => void;
  clearAmbulance: () => void;
};

type SocketStore = {
  socket: Socket | null;
  setSocket: (socket: Socket | null) => void;
};

// Car seat replaced to be type
// 0=Messenger 1=Trolley 2=Cart 3=Cyclist 4=Motorcycle 5=Tuktuk 6=Pickup 7=Lorry
// Function in lib/utils
//
//

//Trip_Status
//offline, available, assigned, arrived, on_ride

// LOCATIONS >>>>>>>>>>>>>>>>>>>>>>>
export type DeviceLocation = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
  address: string;
  heading: number;
};

type DeviceLocationStore = {
  deviceLocation: DeviceLocation | null;
  setDeviceLocation: (loc: DeviceLocation) => void;
  clearDeviceLocation: () => void;
};
export type FromLocation = {
  latitude: number;
  longitude: number;
  address: string;
};

type FromLocationStore = {
  fromLocation: FromLocation | null;
  setFromLocation: (loc: FromLocation) => void;
  clearFromLocation: () => void;
};
export type ToLocation = {
  latitude: number;
  longitude: number;
  address: string;

};

type ToLocationStore = {
  toLocation: ToLocation | null;
  setToLocation: (loc: ToLocation) => void;
  clearToLocation: () => void;
};