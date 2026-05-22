import { useUser } from "@clerk/clerk-expo";
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import RideCard from "@/components/RideCard";
import { images } from "@/constants";
import { useFetch } from "@/lib/fetch";
import { Ride } from "@/types/type";
import { useHospitalStore, useMyAgentsStore, useMyRidesStore, useProfileStore } from "@/store";
import { fetchAPI } from "@/lib/fetch";
import { useEffect, useState } from "react";
import { formatDateTime } from "@/lib/utils";
import { router } from "expo-router";

const Agents = () => {
  // const { user } = useUser();
  const {profile} = useProfileStore();
  const {myAgents, setMyAgents, setSelectedAgentId} = useMyAgentsStore();
  const [loading, setLoading] = useState(true);
  const {hospital} = useHospitalStore();
 
  

  // const {
  //   data: recentRides,
  //   loading,
  //   error,
  // } = useFetch<Ride[]>(`/(api)/ride/${user?.id}`);
  console.log({myAgents})

  return (
    <SafeAreaView className="flex-1 bg-white">
      {myAgents.length > 0 &&
      <FlatList
        data={myAgents}
        keyExtractor={(item, index) =>
            item?.id != null ? item.id.toString() : index.toString()
        }
        className="px-5"
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="bg-white p-4 mb-4 rounded-2xl border border-gray-200 shadow-sm"
            onPress={() => {
              if(item?.id){
              setSelectedAgentId(item?.id); 
              router.push("/(root)/agent-errands");
              }
            }}
          >
            {/* Agent Name */}
            <Text className="text-lg font-JakartaBold">
              {item.name}
            </Text>

            {/* Address */}
            <Text className="text-sm text-gray-500 mt-1">
              📍 {item.current_address}
            </Text>

            {/* Coordinates */}
            {/* <Text className="text-xs text-gray-400 mt-1">
              Lat: {item.current_latitude} | Lng: {item.current_longitude}
            </Text> */}

            {/* Agent Meta */}
            <View className="flex-row justify-between mt-3">
              {/* <Text className="text-sm">
                Task ID: {item.agent_data?.latest_errand_id ?? "None"}
              </Text> */}

              <Text
                className={`text-sm font-semibold ${
                  item.agent_data?.status === 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {item?.agent_data?.status === 0 ? "Available" : "Busy"}
              </Text>
            </View>

            {/* Created */}
            <Text className="text-xs text-gray-400 mt-2">
              Joined:{" "}
              {item?.created_at ? formatDateTime(item.created_at) : "—"}
            </Text>
          </TouchableOpacity>
        )}
        ListHeaderComponent={
          <Text className="text-2xl font-JakartaBold my-5">
            Agents
          </Text>
        }
      />
    }
    </SafeAreaView>
  );
};

export default Agents;
