import { Tabs } from "expo-router";
import { Image, ImageSourcePropType, View } from "react-native";

import { icons } from "@/constants";
import { fetchAPI } from "@/lib/fetch";
import { useProfileStore, useSessionStore , useAmbulanceStore, useHospitalStore} from "@/store";
import { useUser } from "@clerk/clerk-expo";
import { useEffect } from "react";
import { initSocket, onHello} from "@/lib/socket";

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
  const { ambulance, setAmbulance } = useAmbulanceStore();
  const { hospital, setHospital } = useHospitalStore();
  const {email} = useSessionStore();

  const fetchUser = async (email:string) => {
    try {
      // setLoading(true);
      // setError(null);
  
      const res = await fetchAPI(`/(api)/user?email=${encodeURIComponent(email)}`);
      // console.log({response})
      // console.log('yohh')
      // const res = await response.data;
      console.log({res});
      if(res?.success === true){
          setProfile(res?.data?.user);
          if(res?.data?.ambulance?.id){
            setAmbulance(res?.data?.ambulance)
          }
          if(res?.data?.hospital?.id){ //rider can have hospital also
            setHospital(res?.data?.hospital)
          }
      }
      
      initSocket(email, res?.data?.user?.id);  

      // setProfile(data); // Save user to state

      // onHello((msg) => {
      //   console.log("Received hello:", msg);
      // });

    } catch (err) {

      console.error("Error fetching user:", err);

    }
  };

  console.log({profile})

  useEffect(() => {
    if(email?.length){
        fetchUser(email)
    }else{
        console.log('No User')
    }
  
  }, [email]);


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
