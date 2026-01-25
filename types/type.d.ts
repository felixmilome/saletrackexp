import { TextInputProps, TouchableOpacityProps } from "react-native";

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

declare interface Ride {
  id?: string | null
  origin_address: string | null;
  destination_address: string | null;
  origin_latitude: number | null;
  origin_longitude: number | null;
  destination_latitude: number | null;
  destination_longitude: number | null;
  ride_state: string;
  ride_time: number;
  fare_price: number;
  driver_id: number;
  user_id: string; 
  created_at?: string | null ; 
  package_weight: number | null;
  package_description: string | null;
  user_data: {
    name: string;
    phone: string;
    profile_image_slug: string;
  };
  driver_data: {
    name: string;
    vehicle_type: number;
    phone: string;
    profile_image_slug: string;
  };
}

interface RideStore {
  ride: Ride | null;
  setRide: (ride: Ride) => void;
  updateRide: (ride: Partial<Ride>) => void;
  clearRide: () => void;
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
  item: MarkerData;
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
  
  name?: string | null;
  email: string | null ;
  phone?: string | null ;
  account_type: string | null | undefined;
  clerk_id: string | null | undefined;
  user_id: string | null | undefined;
  vehicle_type?: number | null ;
  profile_image_slug?: string | null;
  id_image_slug?: string | null ;
  conduct_image_slug?: string | null ;
  description?: string | null ;
  driver_rating?: number | null;
  client_rating?: number | null;
  trip_status?: string | null;


} 
type ProfileStore = {
  profile: ProfileData | any;
  setProfile: (data: ProfileData) => void;
  clearProfile: () => void;
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