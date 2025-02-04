import React, { useEffect, useState } from "react";
import { Button, FlatList, Image, Pressable, ScrollView, View } from "react-native";
import { Avatar, IconButton, Text, TextInput } from "react-native-paper";
import database from '@react-native-firebase/database';
import { useSelector } from "react-redux";
import { callApi } from "../Component/fetchData";

const Result = ({ route,navigation }) => {
  const { item } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const { userInfo } = useSelector((state) => state.auth);
  const getTimeDifference = (timestamp) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInSeconds = Math.floor((now - messageTime) / 1000);
  
    if (diffInSeconds < 60) {
      return `${diffInSeconds} giây trước`;
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} phút trước`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} giờ trước`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ngày trước`;
    }
  };
  const sendMessage = () => {
    database().ref('/messages').push({
      text: newMessage,
      postID:item.postID,
      userType:userInfo.userName,
      timestamp: database.ServerValue.TIMESTAMP,
    });
    setNewMessage('');
  };
  const[post,setPost]=useState([]);
  console.log(item.postID);
  useEffect(()=>{
    const LoadData = async () => {
        try {
            const response =  await callApi('GET', `/Post/${item.postID}`);
            setPost(response);
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    }; 
    LoadData()
  },[])
  useEffect(() => {
    const messagesRef = database().ref('/messages')
  .orderByChild('postID')
  .equalTo(item.postID)
  .limitToLast(20);
    messagesRef.on('value', (snapshot) => {
      const messageList = [];
      snapshot.forEach((child) => {
        const message = child.val();
        if (message.postID === item.postID) {
          messageList.push({
            id: child.key,
            text: message.text,
            postID: message.postID,
            userType: message.userType,
            timestamp: message.timestamp,
          });
        }
      });
      setMessages(messageList);
    });
  
    return () => messagesRef.off('value');
  }, []); // Removed messages from dependency array

  return (
    <FlatList
    data={messages.sort((a, b) => b.timestamp - a.timestamp)}
    keyExtractor={(item) => item.id}
    ListHeaderComponent={
      <View style={{flex:1,backgroundColor: "white"}}>
        <Text style={{fontSize: 30, textAlign: 'center'}}>{item.title}</Text>
        <Pressable onPress={() => navigation.navigate('Details', { item: post, timeRemain: 0 })}>
          <Text style={{fontSize: 20, textAlign: 'center'}}>{post.title}</Text>
        </Pressable>
        <Text style={{fontStyle: "italic", color: 'blue', alignSelf: 'flex-end', margin: 10}}>Vào ngày: {item.date}</Text>
        <Text>{item.content}</Text>
        <View style={{width: '100%', flexDirection: 'column'}}>
        {item?.result?.map((it, index) => (
          <View key={index} style={{alignItems:'center',flex:1}}>
          <Text style={{marginLeft:15}}>{it.content}</Text>
          <Image
            style={{
              width: 170,
              height: 150,
              marginBottom: 10,
              marginLeft:15,
            }}
            key={index}
            source={{uri:`data:image/jpeg;base64,${it.image}`}}
            resizeMode="cover"
          />
          <Text style={{fontStyle: "italic", color: 'blue',alignSelf:'center'}}>ảnh minh chứng</Text>
          </View>
        ))}
        </View>
        <View style={{margin: 10}}>
          <Text>Bình luận</Text>
          <View style={{flexDirection: "row", alignItems: 'center'}}>
            <Avatar.Text label="hihi" size={45} />
            <TextInput mode="outlined"  value={newMessage} onChangeText={setNewMessage} multiline style={{width: '70%', marginLeft: 10}} placeholder="Nhập bình luận" />
            <IconButton icon="send" onPress={sendMessage} />
          </View>
        </View>
      </View>
  }
  showsVerticalScrollIndicator={false}
  renderItem={({ item }) => (
    <View style={{margin: 10}}>
      <View style={{flexDirection: "row", alignItems: 'center'}}>
        <Avatar.Text label="Cus 1" size={45} />
        <Text>
          <Text style={{color: 'blue', fontWeight: 'bold', marginRight: 10}}>{item.userType}  </Text>{item.text}
        </Text>
      </View>
      <Text>{getTimeDifference(item.timestamp)}</Text>
    </View>
  )}
/>

  );
};

export default Result;
