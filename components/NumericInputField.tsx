import {
    TextInput,
    View,
    Text,
    Image,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard,
    Platform,
  } from "react-native";
  
  interface NumericInputFieldProps {
    label: string;
    icon?: any;
    value: number | null;
    onChange: (value: number | null) => void;
    labelStyle?: string;
    containerStyle?: string;
    inputStyle?: string;
    iconStyle?: string;
  }
  
  const NumericInputField = ({
    label,
    icon,
    value,
    onChange,
    labelStyle,
    containerStyle,
    inputStyle,
    iconStyle,
  }: NumericInputFieldProps) => {
    const handleChange = (text: string) => {
      // If empty → allow clearing
      if (text === "") {
        onChange(null);
        return;
      }
  
      // Only allow digits
      const numeric = text.replace(/[^0-9]/g, "");
      onChange(Number(numeric));
    };
  
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="my-2 w-full">
            <Text className={`text-lg font-JakartaSemiBold mb-3 ${labelStyle}`}>
              {label}
            </Text>
  
            <View
              className={`flex flex-row justify-start items-center relative bg-neutral-100 rounded-full border border-neutral-100 ${containerStyle}`}
            >
              {icon && (
                <Image source={icon} className={`w-6 h-6 ml-4 ${iconStyle}`} />
              )}
  
              <TextInput
                className={`rounded-full p-4 font-JakartaSemiBold text-[15px] flex-1 ${inputStyle} text-left`}
                keyboardType="numeric"
                value={value !== null ? String(value) : ""}
                onChangeText={handleChange}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  };
  
  export default NumericInputField;
  