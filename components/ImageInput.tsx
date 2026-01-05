import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Platform,
  } from "react-native";
   
  import * as ImagePicker from "expo-image-picker";
  import { ReactNode } from "react";
  
  type ImageInputFieldProps = { 
    label?: string;
    icon?: ReactNode;
    value?: string | null;
    onChange: (uri: string | null ) => void;
    labelStyle?: string;
    containerStyle?: string;
    iconStyle?: string;
    imageStyle?: string;
    placeholder?: string;
  };
  
  const ImageInput = ({
    label,
    icon,
    value,
    onChange,
    labelStyle,
    containerStyle,
    iconStyle,
    imageStyle,
    placeholder = "Tap to upload image",
  }: ImageInputFieldProps) => {
    const pickImage = async () => {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 0.8,
      });
  
      if (!result.canceled) {
        onChange(result.assets[0].uri);
      }
    };
  
    return (
      <View className="my-2 w-full">
        {label && (
          <Text className={`text-lg font-JakartaSemiBold mb-3 ${labelStyle}`}>
            {label}
          </Text>
        )}
  
        <TouchableOpacity
          onPress={pickImage}
          activeOpacity={0.8}
          className={`flex flex-row items-center bg-neutral-100 rounded-lg border border-neutral-100 p-4 ${containerStyle}`}
        >
          {icon && (
         <View className="mr-2">{icon}</View>
          )}
  
          {value ? (
            <Image
              source={{ uri: value }}
              className={`w-16 h-16 rounded-lg ${imageStyle}`}
            />
          ) : (
            <Text className="text-[15px] text-gray-400 font-JakartaSemiBold">
              {placeholder}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };
  
  export default ImageInput;
  