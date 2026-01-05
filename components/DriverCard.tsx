import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

import { icons } from "@/constants";
import { formatTime, getVehicleType, roundToNearestTen} from "@/lib/utils";
import { DriverCardProps } from "@/types/type";

const DriverCard = ({ item, selected, setSelected }: DriverCardProps) => {
  return (
    <TouchableOpacity
      onPress={setSelected}
      className={`${
        selected === item.id ? "bg-general-600" : "bg-white"
      } flex flex-row items-center justify-between py-3 px-3 rounded-xl`}
    >
    
       <Image
        source={getVehicleType(item.car_seats)?.image}
        className="h-14 w-14"
        resizeMode="contain"
      />

      <View className="flex-1 flex flex-col items-start justify-center mx-3">
        <View className="flex flex-row items-center justify-start mb-1">
          <Text className="text-sm font-JakartaRegular">{item.title}</Text>

          <View className="flex flex-row items-center space-x-1 ml-2">
            <Image source={icons.star} className="w-3.5 h-3.5" />
            <Text className="text-sm font-JakartaRegular">4</Text>
          </View>
          <Text className="text-sm font-JakartaRegular text-general-800 mx-1">
            |
          </Text>
          <Text className="text-sm font-JakartaRegular">
            {getVehicleType(item.car_seats)?.name}
          </Text>
        </View>

        <View className="flex flex-row items-center justify-start">
          <View className="flex flex-row items-center">
            {/* <Image source={icons.dollar} className="w-4 h-4" /> */}
            <Text className="text-md font-bold font-JakartaRegular ml-0">
              Kshs. {roundToNearestTen(item.price)}
            </Text>
          </View>

          <Text className="text-sm font-JakartaRegular text-general-800 mx-1">
            |
          </Text>

          <Text className="text-sm font-JakartaRegular text-general-800">
            {formatTime(item.time!)}
          </Text>

          

        
        </View>
      </View>

      <Image
        source={{ uri: item.profile_image_url }}
        className="w-12 h-12 rounded-full"
      />
    </TouchableOpacity>
  );
};

export default DriverCard;
