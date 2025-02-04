import React, { useEffect, useMemo, useState }  from "react";
import { FlatList, Pressable, View } from "react-native";
import database from '@react-native-firebase/database';
import { Divider, IconButton, Text, TextInput } from 'react-native-paper';
import { useSelector } from "react-redux";
import { callApi } from "../Component/fetchData";

const Chat=({route})=>{
    const {id,text}=route.params|| {};
    //const id=10;
    const { userInfo } = useSelector((state) => state.auth);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const[userId,setUserID]=useState();
    const [userType,setType]=useState('user');
    const [changeCampain,setChange]=useState(false);
    const [post,setPost]=useState([]);
    const [visible,setVisible]=useState(false);
    const getVietnamTime = useMemo(() => {
        const now = new Date();
        const vietnamTime = now.toLocaleString("en-US", {
            timeZone: "Asia/Ho_Chi_Minh",
            hour12: true,
        });
    
        const [date, time] = vietnamTime.split(", ");
        let [month, day, year] = date.split("/");
    
        // Ensure month and day are zero-padded
        month = month.padStart(2, "0");
        day = day.padStart(2, "0");
    
        // Remove any whitespace before AM/PM
        const formattedTime = time.replace(/\s+(AM|PM)$/, "$1");
    
        return `${year}-${month}-${day}T${formattedTime}`;
    }, []);
    const part = `
        Chúng tôi xin lỗi vì vấn đề này.
        Chúng tôi đưa ra 2 đề xuất cho bạn:
        - Bạn muốn nhận lại đơn hàng.
        - Bạn muốn chuyển sang quyên góp cho chiến dịch khác.
        `;

        useEffect(() => {
            setUserID(userInfo.id);
            if (id !== undefined) {
                database().ref(`/messages/${userId}`).push({
                    text: text, // Lưu nội dung thông báo đơn giản
                    userId: userId,
                    userType: 'user',
                    timestamp: database.ServerValue.TIMESTAMP,
                });
                database().ref(`/messages/${userId}`).push({
                    text: part, // Lưu nội dung thông báo đơn giản
                    userId: userId,
                    userType: 'admin',
                    timestamp: database.ServerValue.TIMESTAMP,
                });
            }
        }, [id, userId, userInfo.id]);
        
    const sendMessage = () => {
        database().ref(`/messages/${userId}`).push({
        text: newMessage,
        userId:userId,
        userType:'user',
        timestamp: database.ServerValue.TIMESTAMP,
        });

        setNewMessage('');
    };
    const sendChoice = () => {
        database().ref(`/messages/${userId}`).push({
        text: "Cảm ơn bạn đã phản hồi! Chúng tôi sẽ gửi lại cho bạn trong thời gian sớm nhất",
        userId:userId,
        userType:'admin',
        timestamp: database.ServerValue.TIMESTAMP,
        });
        setVisible(true);
        const body = {
            userID: userInfo.id,
            charityID:id,
            date: getVietnamTime(),
        };
        callApi('POST', '/ReDelivery',body)
        setNewMessage('');
    };
  useEffect(() => {
    const messagesRef = database().ref(`/messages/${userId}`);
    messagesRef.on('value', (snapshot) => {
      const messageList = [];
      snapshot.forEach((child) => {
        const message = child.val();
        if ((message.userType === 'admin'&&message.userId===userId)||message.userId===userId) {
          messageList.push({
            id: child.key,
            text: message.text,
            userId: message.userId,
            userType: message.userType,
            timestamp: message.timestamp,
          });
        }
      });
      setMessages(messageList);
    });

    return () => messagesRef.off('value');
  }, [userType, userId]);
  useEffect(() => {
    if (changeCampain) {
        database().ref(`/messages/${userId}`).push({
            text: 'Người dùng đã chọn chuyển sang chiến dịch khác.',
            userId: userId,
            userType: 'admin',
            timestamp: database.ServerValue.TIMESTAMP,
        });
        setChange(false);
        const fetchPost = async () => {
            try {
                const data = await callApi('GET', '/Post');
                setPost(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchPost();
    }
    }, [changeCampain, userId]);
    const Accept=(name,idpost)=>{
        database().ref(`/messages/${userId}`).push({
            text: `Tôi muốn chuyển hiện vật sang cho chiến dịch ${name}`,
            userId:userId,
            userType:'user',
            timestamp: database.ServerValue.TIMESTAMP,
            });
        database().ref(`/messages/${userId}`).push({
                text: `Cảm ơn bạn đã phản hồi! Chúng tôi sẽ chuyển hiện vật sang cho chiến dịch ${name}`,
                userId:userId,
                userType:'admin',
                timestamp: database.ServerValue.TIMESTAMP,
            });
        callApi('PUT', `/Charity/ChangePost?id=${id}&postID=${idpost}&date=${getVietnamTime}`);
        setVisible(true);
    }
    return(
        <View style={{flex:1}}>
        <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <View>
                    <View style={{ flexDirection: 'row', justifyContent: item.userType === 'user' ? 'flex-end' : 'flex-start' }}>
                        <View style={{ backgroundColor: item.userType === 'user' ? 'lightgreen' : 'lightblue', padding: 10, borderRadius: 5, margin: 5 }}>
                            <Text>{item.text}</Text>
                            <Text style={{ fontSize: 10, textAlign: 'right' }}>
                                {new Date(item.timestamp).toLocaleTimeString()}
                            </Text>
                        </View>
                    </View>
                    {item.text.includes('Chúng tôi đưa ra 2 đề xuất cho bạn') && (
                        <View style={{ padding: 10, flexDirection: 'row', justifyContent: 'space-evenly' }}>
                            <Pressable disabled={visible} onPress={() => sendChoice() }>
                                <Text style={{ color: 'blue' }}>Nhận lại đơn hàng</Text>
                            </Pressable>
                            <Pressable disabled={visible} onPress={() => setChange(true)}>
                                <Text style={{ color: 'green' }}>Chuyển sang chiến dịch khác</Text>
                            </Pressable>
                        </View>
                    )}
                    {item.text.includes('Người dùng đã chọn chuyển sang chiến dịch khác.')&&(
                        post.filter(s=>s.id!=id).map((value,index)=>(
                            <View style={{padding: 10}}>
                            <Pressable key={index} onPress={()=>Accept(value.title,value.id)}>
                                <Text>{value.title}</Text>
                            </Pressable>
                            <Divider/>
                            </View>
                        ))
                    )}
                </View>
            )}
            
            />
            <View style={{height:100}}>

            </View>
            <View style={{position:'absolute',bottom:0,backgroundColor:'white',flexDirection:'row',alignItems: 'center', justifyContent: 'space-between',flex:1}}>
                    <TextInput
                        style={{flex:8}}
                        placeholder="Type your message..."
                        value={newMessage}
                        onChangeText={(text) => setNewMessage(text)}
                    />
                    <IconButton style={{flex:2}} iconColor='blue' icon='send' onPress={sendMessage} />
            </View>
    </View>
    )
}
export default Chat;