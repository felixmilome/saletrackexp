import { useUser } from "@clerk/clerk-expo";
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import RideCard from "@/components/RideCard";
import { images } from "@/constants";
import { useFetch } from "@/lib/fetch";
import { Ride } from "@/types/type";
import { useErrandStore, useHospitalStore, useMyAgentsStore, useMyRidesStore, useProfileStore } from "@/store";
import { fetchAPI } from "@/lib/fetch";
import { useEffect, useState } from "react";
import { formatDateTime } from "@/lib/utils";
import { router } from "expo-router";
import AgentErrands from "@/app/(root)/agent-errands";
import AgentItem from "@/components/AgentItem";

const Agents = () => {
  // const { user } = useUser();
  const {profile} = useProfileStore();
  const { setErrand } = useErrandStore();
  const {myAgents, setMyAgents, selectedAgentId, setSelectedAgentId} = useMyAgentsStore();
  const [loading, setLoading] = useState(true);
  const {hospital} = useHospitalStore();
 
  

  // const {
  //   data: recentRides,
  //   loading,
  //   error,
  // } = useFetch<Ride[]>(`/(api)/ride/${user?.id}`);
  console.log({myAgents})
  useEffect(() => {
   if(profile?.account_type === 1){
    setSelectedAgentId(profile?.id);
   }
  }, [profile?.id]);

  console.log(profile?.account_type);
  console.log(selectedAgentId);

  return (
    <SafeAreaView className="flex-1 bg-white">
      {myAgents.length > 0 && profile?.account_type === 2 &&
      <FlatList
        data={myAgents}
        keyExtractor={(item, index) =>
            item?.id != null ? item.id.toString() : index.toString()
        }
        className="px-5"
        contentContainerStyle={{ paddingBottom: 100 }}
         renderItem={({ item }) => <AgentItem item={item} />}
        ListHeaderComponent={
          <Text className="text-2xl font-JakartaBold my-5">
            Agents & Tasks
          </Text>
        }
      />
    }
    { profile?.account_type === 1 && selectedAgentId &&

        <AgentErrands />
    } 
    </SafeAreaView>
  );
};

export default Agents;
