// components/RatingWithCommentInput.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
} from "react-native";

type RatingPayload = {
  rating: number;
  comment: string;
};

type Props = {
  maxRating?: number;
  onSubmit: (data: RatingPayload) => void;
};

export default function RatingWithCommentInput({
  maxRating = 5,
  onSubmit,
}: Props) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    onSubmit({
      rating,
      comment: comment.trim(),
    });
  };

  return (
    <View style={styles.container}>
      {/* Rating */}
      <View style={styles.stars}>
        {Array.from({ length: maxRating }).map((_, i) => {
          const value = i + 1;
          return (
            <Pressable key={value} onPress={() => setRating(value)}>
              <Text style={[styles.star, rating >= value && styles.active]}>
                ★
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Comment */}
      <TextInput
        placeholder="Write a comment..."
        value={comment}
        onChangeText={setComment}
        multiline
        style={styles.input} 
      />

      {/* Submit */}
      <Pressable
        style={[
          styles.button,
          rating === 0 && styles.buttonDisabled,
        ]}
        disabled={rating === 0}
        onPress={handleSubmit}
      >
        <Text style={styles.buttonText}>Submit</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  stars: {
    flexDirection: "row",
    marginBottom: 12,
  },
  star: {
    fontSize: 32,
    color: "#ccc",
    marginHorizontal: 4,
  },
  active: {
    color: "#f5b301",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
    textAlignVertical: "top",
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#000",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#999",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
