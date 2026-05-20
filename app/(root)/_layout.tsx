import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      
 
        <Stack.Screen name="create-errand" 
        options={{ headerShown: false }}
       />
        <Stack.Screen name="on-errand" 
        options={{ headerShown: false }}
       />

       <Stack.Screen
        name="choose-rider"
        options={{
          headerShown: false,
        }}
      />
        <Stack.Screen
        name="confirm-ride"
        options={{
          headerShown: false,
        }}
      />
  
       <Stack.Screen
        name="approaching"
        options={{
          headerShown: false,
        }}
      />
        <Stack.Screen
        name="waiting"
        options={{
          headerShown: false,
        }}
      />
        {/* <Stack.Screen
        name="on-ride"
        options={{
          headerShown: false,
        }}
      />
        <Stack.Screen
        name="completed"
        options={{
          headerShown: false,
        }}
      /> */}
    </Stack>
  );
};

export default Layout;
