import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

import { icons } from "@/constants";
import { formatTime, getVehicleType, roundToNearestTen, getServiceByNumber, imageUrlCombiner} from "@/lib/utils";
import { DriverCardProps } from "@/types/type";

const DriverCardCope = ({ item, selected, setSelected }: DriverCardProps) => {

  function random700to1500(): number {
  return Math.floor(Math.random() * (1500 - 700 + 1)) + 700;
}

// Random number between 3 and 20 (inclusive)
function random3to20(): number {
  return Math.floor(Math.random() * (20 - 3 + 1)) + 3;
}

function getRandomStatus(): string {
  const statuses = ["Busy", "Available", "Offline"];
  const randomIndex = Math.floor(Math.random() * statuses.length);
  return statuses[randomIndex];
}

  return (
    <TouchableOpacity
      onPress={setSelected}
      className={`${
        selected === item.id ? "bg-general-600" : "bg-white"
      } flex flex-row items-center justify-between py-3 px-3 mt-1 rounded-xl`}
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
              {getRandomStatus()}
            </Text>
          </View>

          <Text className="text-sm font-JakartaRegular text-general-800 mx-1">
          |
          </Text>

          <Text className="text-sm font-JakartaRegular text-general-800">
            {/* {formatTime(item.time!)} */}
              {item?.phone}
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

export default DriverCardCope;
