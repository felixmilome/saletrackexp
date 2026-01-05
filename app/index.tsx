import { useAuth } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";


const Page = () => {
  const { isSignedIn } = useAuth();
  // console.log({isSignedIn});
  // console.log('mathe')

  if (isSignedIn) return <Redirect href="/(root)/(tabs)/home" />;

  return <Redirect href="/(auth)/welcome" />;
};

export default Page;
