import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

import { icons } from "@/constants";
import { useEffect } from "react";
import { formatTime, getVehicleType, roundToNearestTen, getServiceByNumber, imageUrlCombiner, calculateAmbulancePrice} from "@/lib/utils";
import { DriverCardProps } from "@/types/type";
import { useDeviceLocationStore, useProfileStore, useFromLocationStore, useRideStore, useToLocationStore } from "@/store";

const DriverCard = ({ item, selected, setSelected }: DriverCardProps) => {

  function random700to1500(): number {
  return Math.floor(Math.random() * (1500 - 700 + 1)) + 700;
}
const {fromLocation} = useFromLocationStore();
const {deviceLocation} = useDeviceLocationStore();
const {toLocation} = useToLocationStore();
const {profile} = useProfileStore();
type PriceCalculatorResult = {
  distanceToPatient: number
  distanceToHospital: number
  timeToPatientMinutes: number
  timeToHospitalMinutes: number
  totalETA: number
  price: number
}
const [ambulanceXtra, setAmbulanceXtra] = useState<PriceCalculatorResult>()
const {ride, setRide} = useRideStore();


// Random number between 3 and 20 (inclusive)
function random3to20(): number {
  return Math.floor(Math.random() * (20 - 3 + 1)) + 3;
}
// type CalculatorInput = {
//   baseFee: number
//   driverLoc: LatLng
//   patientLoc: LatLng
//   hospitalLoc: LatLng
//   type: AmbulanceType
// }
useEffect(() => {
  const runCalculation = async () => {
    try {
      if (
        item?.current_latitude &&
        item?.current_longitude &&
        fromLocation?.latitude &&
        fromLocation?.longitude &&
        toLocation?.latitude &&
        toLocation?.longitude &&
        item?.ambulance_data?.vehicle_type !== undefined &&
        item?.ambulance_data?.vehicle_type !== null
      ) {
        const ambulanceExtra = await calculateAmbulancePrice({
          baseFee: 500,
          driverLoc: {
            lat: item.current_latitude,
            lng: item.current_longitude,
          },
          patientLoc: {
            lat: fromLocation.latitude,
            lng: fromLocation.longitude,
          },
          hospitalLoc: {
            lat: toLocation.latitude,
            lng: toLocation.longitude,
          },
          type: item.ambulance_data.vehicle_type,
   
        });

        setAmbulanceXtra(ambulanceExtra);

        //console.log("Ambulance price data:", ambulanceExtra);
      }
    } catch (error) {
      console.error("Error calculating ambulance price:", error);
    }
  };

  runCalculation();
}, [
  item?.current_latitude,
  item?.current_longitude,
  fromLocation,
  toLocation,
  item?.ambulance_data?.vehicle_type
]);

// const ambulanceExtra = calculateAmbulancePrice({
//   baseFee: 500, 
//   driverLoc: {lat:item?.current_latitude, lng:item?.current_longitude},
//   patientLoc: {lat:fromLocation?.latitude, lng:fromLocation?.longitude},
//   hospitalLoc: {lat:toLocation?.latitude, lng:toLocation?.longitude},
//   type: item?.ambulance_data?.vehicle_type
// })

const createRideLocally = () =>{

 
    if (!item) return;

    //  setRide({
    //     ...ride,                // spread previous values
    //     service_type: val,
    //   } as Ride);

      const newRide = {
        id: null,
        client_id: profile?.id,
        rider_id: item?.id,
        hospital_id: item?.ambulance_data?.hospital_id,
        ambulance_id: item?.ambulance_data?.id,
        rider_address: item?.current_address,
        rider_latitude: item?.current_latitude,
        rider_longitude: item?.current_longitude,
        pickup_address: fromLocation?.address,
        pickup_latitude: fromLocation?.latitude,
        pickup_longitude: fromLocation?.longitude,
        dropoff_address: toLocation?.address,
        dropoff_latitude: toLocation?.latitude,
        dropoff_longitude: toLocation?.longitude,
        ride_state: 0,
        service_type: item?.ambulance_data?.vehicle_type,
        price: ambulanceXtra?.price,
        trip_estimate_minutes: ambulanceXtra?.totalETA,
        trip_duration_minutes: null,
        pickup_estimate_minutes: ambulanceXtra?.timeToPatientMinutes,
        pickup_duration_minutes: null,
        description: ride?.description,
        requested_at: new Date(),
        started_at: null,
        completed_at:null,
  


        client_data: { //for frontend temp
          id: profile?.id,
          name: profile?.name || null, 
          phone: profile?.phone || null,
          image_slug: profile?.image_slug || null,
        },
        driver_data: { // for frontend temp
          id: item?.id,
          name: item?.name || null,
          vehicle_type: item?.ambulance_data?.vehicle_type || null,
          phone: item?.phone || null,
          image_slug: item?.image_slug || null,
        },
      };
      setRide(newRide);

   // router.push("/(root)/book-ride")


  }
  //console.log({ride});

  return (
    <TouchableOpacity
        onPress={() => {
          setSelected();   // first function
          createRideLocally(); // second function
        }}
      className={`${
        selected === item.id ? "bg-general-600" : "bg-white"
      } flex flex-row items-center justify-between py-3 px-3 rounded-xl`}
    >
    
       <Image
        source={item.ambulance_data?.vehicle_type!==null ? item.ambulance_data?.vehicle_type!==undefined && getVehicleType(item.ambulance_data?.vehicle_type)?.image : ""}
        className="h-14 w-14"
        resizeMode="contain"
      />

      <View className="flex-1 flex flex-col items-start justify-center mx-3">
        <View className="flex flex-row items-center justify-start mb-1">
          <Text className="text-sm font-JakartaRegular">{item.name}</Text>

          <View className="flex flex-row items-center space-x-1 ml-2">
            <Image source={icons.star} className="w-3.5 h-3.5" />
            <Text className="text-sm font-JakartaRegular">4</Text>
          </View>
          <Text className="text-sm font-JakartaRegular text-general-800 mx-1">
            |
          </Text>
          <Text className="text-sm font-JakartaRegular">
            {item?.ambulance_data?.vehicle_type!==null && item?.ambulance_data?.vehicle_type!==undefined && getServiceByNumber(item?.ambulance_data?.vehicle_type)}
          </Text>
        </View>

        

        <View className="flex flex-row items-center justify-start">
          <View className="flex flex-row items-center">
            {/* <Image source={icons.dollar} className="w-4 h-4" /> */}
            <Text className="text-md font-bold font-JakartaRegular ml-0">
              {/* Kshs. {roundToNearestTen(item.price)} */}
              Kshs. {ambulanceXtra?.price} 
            </Text>
          </View>

          <Text className="text-sm font-JakartaRegular text-general-800 mx-1">
          |
          </Text>

          <Text className="text-sm font-JakartaRegular text-general-800">
            {/* {formatTime(item.time!)} */}
              {ambulanceXtra?.distanceToPatient} Km away
          </Text>
        
        </View>

        <View className="flex flex-row items-center justify-start">
         
          <Text className="text-sm font-JakartaRegular ml-0">
             Pick Up: {ambulanceXtra?.timeToPatientMinutes}Min
          </Text>

          <Text className="text-sm font-JakartaRegular text-general-800 mx-1">
          |
          </Text>
          <Text className="text-sm font-JakartaRegular ml-0">
            Delivery: {ambulanceXtra?.timeToHospitalMinutes}Min
          </Text>
           <Text className="text-sm font-JakartaRegular text-general-800 mx-1">
          =
          </Text>
          <Text className="text-sm font-bold font-JakartaRegular ml-0">
            {ambulanceXtra?.totalETA} Mins
          </Text>
        
        </View>

         <View className="flex flex-row items-center justify-start">
          <View className="flex flex-row items-center">
            {/* <Image source={icons.dollar} className="w-4 h-4" /> */}
            <Text className="text-sm font-JakartaRegular ml-0">
              {/* Kshs. {roundToNearestTen(item.price)} */}
              {item?.ambulance_data?.hospital_name} 
            </Text>
          </View>

          <Text className="text-sm font-JakartaRegular text-general-800 mx-1">
          |
          </Text>

          <Text className="text-sm font-JakartaRegular ">
            {/* {formatTime(item.time!)} */}
              Fleet Code: {item?.ambulance_data?.hospital_id}
          </Text>
        
        </View>
      </View>

      {/* <Image
          source={{
              uri: item?.image_slug!==null  ? imageUrlCombiner("image_slug", item?.image_slug ) : ''
            }}

        className="w-12 h-12 rounded-full"
      /> */}
    </TouchableOpacity>
  );
};

export default DriverCard;
