import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ListRenderItem,
} from "react-native";
import { useChatsStore, useProfileStore } from "@/store";
import { Message } from "@/types/type";
import { useRideStore } from "@/store";
import { useMessagesStore } from "@/store";
import { fetchAPI } from "@/lib/fetch";
import { sendMessageSocket } from "@/lib/socket";




type Props = {
  visible: boolean;
  onClose: () => void;
};

const ChatModal: React.FC<Props> = ({ visible, onClose}) => {


  const [input, setInput] = useState<string>("");
  const {ride} = useRideStore();
  const {messages, setMessages, addMessage} = useMessagesStore();
  const {profile} = useProfileStore();
 // console.log({ride})

const participantsObj = [ride?.client_data, ride?.driver_data];

const otherParticipantObj = participantsObj.find(
  (participant) => participant?.id !== profile?.id
);




  const sendMessage = async() => {
    if (!input.trim()) return;

      const newMessage: Message = {
        id: undefined,
        chat_id: null, // include if required by your type
        sender_id: profile?.id ?? 0,
        receiver_id: otherParticipantObj?.id!, // set this if you know the receiver
        text: input,
        type: 0,
        ride_id: ride?.id || null || undefined,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

     // console.log(newMessage);

      //add to backend
      const res = await fetchAPI("/(api)/messages", { 
                method: "POST",
                body: JSON.stringify(newMessage),
      });
     // console.log({res})
      if(res?.message?.id){

       // console.log(res?.message?.id)
         addMessage(res?.message);
          setInput("");
          sendMessageSocket(res?.message)
   
      }else{
        //console.log("error")
      }

   
  };

  const renderItem: ListRenderItem<Message> = ({ item }) => (
    <View
      style={[
        styles.messageBubble,
        item?.sender_id === profile?.id ? styles.myMessage : styles.otherMessage,
      ]}
    >
      <Text style={styles.messageText}>{item?.text}</Text>
    </View>
  );

  const cleanMessages = messages?.filter(Boolean);
  // console.log({messages})

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        
        {/* Header */}
        <View className= "flex flex-row p-3 w-full bg-gray-100 justify-between border-gray-300">
          <View className='mx-4'>
          <Text style={styles.username}>{otherParticipantObj?.name || "User Name"}</Text>
          <Text style={styles.status}>Online</Text>
          </View>

          <TouchableOpacity className="rounded-md flex flex-row justify-center items-center bg-gray-200 w-20 h-10" onPress={onClose}>
            <Text className="font-bold text-red-600">Close</Text>
          </TouchableOpacity>
        </View>

        {/* Messages */}
        
        {messages?.length>0 &&
          <FlatList
            data={cleanMessages}
            keyExtractor={(item) => item?.id!.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.messagesContainer}
          />
        }

        {/* Input */}

        <View style={styles.inputContainer}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Type a message..."
            style={styles.input}
          />
          <TouchableOpacity className="flex justify-center items-center" onPress={sendMessage}>
            <Text style={styles.sendBtn}>Send</Text>
          </TouchableOpacity>
        </View>

      </View>
    </Modal>
  );
};

export default ChatModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  header: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },

  username: {
    fontSize: 18,
    fontWeight: "bold",
  },

  status: {
    fontSize: 12,
    color: "gray",
  },

  closeBtn: {
    position: "absolute",
    padding:5,
    right: 15,
    top: 15,
    color: "blue",
  },

  messagesContainer: {
    padding: 10,
  },

  messageBubble: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    maxWidth: "75%",
  },

  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#c6e7f8",
  },

  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#eee",
  },

  messageText: {
    fontSize: 16,
  },

  inputContainer: {
    flexDirection: "row",
    padding: 10,
    marginVertical:40,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },

  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 15,
  },

  sendBtn: {
    marginLeft: 10,
    alignSelf: "center",
    color: "blue",
    fontWeight: "bold",
  },
});