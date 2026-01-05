import React, { useEffect, useState } from "react";
import { View, Keyboard, KeyboardEvent, Animated, Platform, StyleSheet } from "react-native";

interface KeyboardAwareInputProps {
  children: React.ReactNode;
  bottomOffset?: number; // optional padding from keyboard
}

const KeyboardAwareInput: React.FC<KeyboardAwareInputProps> = ({ children, bottomOffset = 10 }) => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const animatedValue = new Animated.Value(0);

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", (e: KeyboardEvent) => {
      setKeyboardHeight(e.endCoordinates.height);
      Animated.timing(animatedValue, {
        toValue: e.endCoordinates.height + bottomOffset,
        duration: 250,
        useNativeDriver: false,
      }).start();
    });

    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 250,
        useNativeDriver: false,
      }).start(() => setKeyboardHeight(0));
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          bottom: animatedValue,
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 999,
    paddingHorizontal: 20,
  },
});

export default KeyboardAwareInput;
