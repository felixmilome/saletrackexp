import { Tabs } from "expo-router";
import { Image, ImageSourcePropType, View } from "react-native";
import { useEffect } from "react";

import { icons } from "@/constants";
import { fetchAPI } from "@/lib/fetch";
import {
  useProfileStore,
  useSessionStore,
  useAmbulanceStore,
  useHospitalStore,
  useSocketStore,
} from "@/store";

import { initSocket, onHello } from "@/lib/socket";
import { Ride } from "@/types/type";

const TabIcon = ({
  source,
  focused,
}: {
  source: ImageSourcePropType;
  focused: boolean;
}) => (
  <View
    className={`h-14 w-14 p-2 items-center justify-center rounded-full ${
      focused ? "bg-general-300" : ""
    }`}
  >
    <View
      className={`h-14 w-14 p-2 items-center justify-center rounded-full ${
        focused ? "bg-general-400" : ""
      }`}
    >
      <Image
        source={source}
        tintColor={focused ? "white" : "grey"}
        resizeMode="contain"
        className="w-10 h-10"
      />
    </View>
  </View>
);

export default function Layout() {
  // const { email } = useSessionStore();

  const {
    profile,
    setProfile,
  } = useProfileStore();

  const { socket } = useSocketStore();

  const { setAmbulance } = useAmbulanceStore();
  const { setHospital } = useHospitalStore();

  // // 1. FETCH USER (ONLY when email changes)
  // useEffect(() => {
  //   if (!email) return;

  //   const fetchUser = async () => {
  //     try {
  //       const res = await fetchAPI(
  //         `/(api)/user?email=${encodeURIComponent(email)}`
  //       );

  //       if (res?.success) {
  //         setProfile(res.data.user);

  //         if (res.data.ambulance?.id) {
  //           setAmbulance(res.data.ambulance);
  //         }

  //         if (res.data.hospital?.id) {
  //           setHospital(res.data.hospital);
  //         }
  //       }
  //     } catch (err) {
  //       console.error("Error fetching user:", err);
  //     }
  //   };

  //   fetchUser();
  // }, [email]);

  // 2. INIT SOCKET (ONLY when profile is ready)
  // useEffect(() => {
  //   if (!email) return;
  //   if (!profile?.id) return;
  //   if (socket) return;

  //   initSocket(email, profile.id);
  // }, [email, profile?.id, socket]);

  // 3. LISTENERS (ONLY when socket is ready)
  // useEffect(() => {
  //   if (!socket) return;

  //   const cleanup = onHello((msg) => {
  //     console.log("Received hello:", msg);
  //     alert(msg);
  //   });

  //   return () => {
  //     cleanup?.();
  //   };
  // }, [socket]);



  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "white",
        tabBarShowLabel: false,
      tabBarStyle: {
  backgroundColor: "transparent",
  position: "absolute",

  borderTopWidth: 0,
  elevation: 0,
  shadowOpacity: 0,

  marginHorizontal: 0,
  marginBottom: 50,

  height: 70, // keep REAL height
}
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon source={icons.home} focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="rides"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon source={icons.list} focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon source={icons.profile} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}