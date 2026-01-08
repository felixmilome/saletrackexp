import { Tabs } from "expo-router";
import { Image, ImageSourcePropType, View } from "react-native";

import { icons } from "@/constants";
import { useUser } from "@clerk/clerk-expo";
import { fetchAPI } from "@/lib/fetch";
import { useEffect } from "react";
import { useProfileStore } from "@/store";

const TabIcon = ({
  source,
  focused, 
}: {
  source: ImageSourcePropType;
  focused: boolean;
}) => (
  <View
    className={`flex flex-row h-16 w-16 justify-center items-center rounded-full ${focused ? "bg-general-300" : ""}`}
  >
    <View
      className={`rounded-full  h-16 w-16 items-center justify-center ${focused ? "bg-general-400" : ""}`}
    >
      <Image
        source={source}
        tintColor="white"
        resizeMode="contain"
        className="w-10 h-10"
      />
    </View>
  </View>
);

export default function Layout() {

  const { user } = useUser();
  const { profile, setProfile } = useProfileStore();

  const fetchUser = async (email:string) => {
    try {
      // setLoading(true);
      // setError(null);
  
      const response = await fetchAPI(`/(api)/user?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      setProfile(data); // Save user to state

    } catch (err) {

      console.error("Error fetching user:", err);

    }
  };

  useEffect(() => {
    if(user?.primaryEmailAddress?.emailAddress){
        fetchUser(user?.primaryEmailAddress?.emailAddress)
    }else{
        console.log('No User')
    }
  
  }, [user]);





  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "white",
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#333333",
          borderRadius: 50,
          paddingBottom: 30, // ios only
          overflow: "hidden",
          marginHorizontal: 10,
          marginBottom: 50,
          height: 70,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
          position: "absolute",
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon source={icons.home} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="rides"
        options={{
          title: "Rides",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon source={icons.list} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon source={icons.chat} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon source={icons.profile} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
