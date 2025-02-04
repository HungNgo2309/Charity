import React, { useState, useEffect, useContext } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import database from '@react-native-firebase/database';
import { AuthenticatedUserContext } from '../Context/UserContext';
import axios from 'axios';
import { Avatar } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { callApi } from '../Component/fetchData';

const NotificationsScreen = ({navigation}) => {
  const [notifications, setNotifications] = useState([]);
  const { userInfo } = useSelector((state) => state.auth);
  const[userId,setUserID]=useState(userInfo.id)
  console.log(userId);
  useEffect(() => {
    const fetchNotifications = () => {// Thay thế bằng userID thật
      database().ref(`/notifications/${userId}`).on('value', snapshot => {
        if (snapshot.exists()) {
          setNotifications(Object.entries(snapshot.val()).map(([id, data]) => ({ id, ...data })));
        }
      });
    };

    fetchNotifications();
  }, [])
  const markAsRead = async(item) => {
    try {
      console.log(item.type);
      if(item.type==2)
      {
        database().ref(`/notifications/${userId}/${item.id}`).update({
          read: true,
        });
        navigation.navigate('Setting', { screen: 'History'})
      }else if(item.type==4)
      {
        if(item.read==true)
        {
          navigation.navigate('Setting', { screen: 'Chat'})
        }else{
          database().ref(`/notifications/${userId}/${item.id}`).update({read: true});
          navigation.navigate('Setting', { screen: 'Chat', params: {id: item.id_charity,text:'Đơn hàng của tôi tới trễ so với thời hạn quyên góp ' } })
        }
      }else{
      const response = await callApi('GET', `/Charity/${item.id_charity}`);
       console.log(response);
      if (response) {
        database().ref(`/notifications/${userId}/${item.id}`).update({
          read: true,
        });
        navigation.navigate("Detail", { item: response });
      }
    }
    } catch (error) {
        console.log(error);
    }
  }; 
  function parseDateString(dateString) {
    // Thay dấu "-" giữa giờ, phút, giây thành ":"
    const parts = dateString.split(" ");
    if (parts.length === 2) {
      const datePart = parts[0]; // "2024-10-03"
      const timePart = parts[1].replace(/-/g, ":"); // "21:09:25"
      return `${datePart}T${timePart}`; // "2024-10-03T21:09:25"
    }
    return dateString; // Trả về chuỗi gốc nếu không khớp
  }
  
  // Hàm tính khoảng cách thời gian
  function calculateTimeDifference(id) {
    const now = new Date(); // Lấy thời gian hiện tại
    const isoDate = parseDateString(id); // Chuẩn hóa chuỗi
    const parsedDate = new Date(isoDate); // Chuyển đổi sang Date
  
    if (isNaN(parsedDate)) {
      console.error(`Không thể chuyển đổi chuỗi "${id}" sang Date.`);
      return "Lỗi định dạng ngày giờ";
    }
  
    const diffMs = now - parsedDate; // Khoảng cách thời gian (ms)
  
    // Chuyển đổi ms sang các đơn vị
    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
  
    // Trả về chuỗi mô tả thời gian
    if (days > 0) return `${days} ngày trước`;
    if (hours > 0) return `${hours} giờ trước`;
    if (minutes > 0) return `${minutes} phút trước`;
    return `${seconds} giây trước`;
  }
  const renderItem = ({ item }) => {
    //console.log(item.id)
    const type = Number(item.type);
    let imageSource;
    switch (type) {
      case 1:
        imageSource = require('../../assets/img/accept.png');
        break;
      case 2:
        imageSource = require('../../assets/img/delivery.png');
        break;
      case 3:
        imageSource = require('../../assets/img/refuse.jpg');
        break;
      case 4:
        imageSource = require('../../assets/img/latetime.png');
        break;
      default:
        console.error(`Unexpected type: ${item.type}`);
        imageSource = require('../../assets/img/refuse.jpg'); // Ensure a fallback image exists
        break;
    }
    
    console.log(imageSource)
    return(
    <TouchableOpacity  onPress={() => markAsRead(item)}>
      <View style={{flex:1,flexDirection:'row', backgroundColor: item.read ? 'white' : '#b5dcf5', paddingRight:10,paddingVertical:10}}>
        <Avatar.Image style={{marginRight:10}} size={50}  source={imageSource} />
        <View>
        <Text style={{fontWeight:'bold'}}>{item.title}</Text>
        <Text style={{paddingRight:40}}> {item.message}</Text>
        <Text>{calculateTimeDifference(item.id)}</Text>
        </View>
      </View>
    </TouchableOpacity>
    )
  };
  return (
    <View style={{flex:1}}>
    <FlatList
      
      data={notifications}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
    />
    </View>
  );
};

export default NotificationsScreen;