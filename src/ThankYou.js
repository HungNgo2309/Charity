import LottieView from "lottie-react-native";
import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, Image } from 'react-native';
import { AuthenticatedUserContext } from "./Context/UserContext";
import axios from "axios";
const ThankYou=({route,navigation})=>{
    const {data,code}=route.params;
    const [post,setPost]=useState({});
    const { user, setUser } = useContext(AuthenticatedUserContext);
    useEffect(()=>{
      const LoadData = async () => {
        try {
            const url = `http://192.168.23.160:8080/Post/${data.postID}`;
            const response = await axios.get(url);
            setPost(response.data);
             // in ra dữ liệu phản hồi
        } catch (error) {
            console.log(error);
        }
    }; 
    LoadData()
    },[data.postID])
    console.log(post)
    return(
        <View style={styles.container}>
      {/* Logo */}
      <LottieView 
        source={require('../assets/lottie/thankyou.json') } 
        style={styles.logo} 
        autoPlay loop
      />
      
      {/* Title */}
      <Text style={styles.title}>
        CHUNG TAY GÂY QUỸ
      </Text>
      
      {/* Description */}
      <Text style={styles.subtitle}>
        {
          post.title
        }
      </Text>
      <Text style={styles.description}>
        Support 40 orphans and disadvantaged children{'\n'}
        affected by the Covid-19 pandemic
      </Text>

      {/* Donation Information */}
      <View style={styles.donationInfo}>
        <View style={{alignItems:'center',}}>
          <Text style={styles.label}>Donate Amount:</Text>
          <Text style={{fontSize:18,borderWidth:1,alignSelf:'center',padding:10,borderStyle:"dashed",borderRadius:10,borderColor:"#FBB800"}}>{Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(data.amountMoney)}</Text>
        </View>
        <View style={{flexDirection:'row',justifyContent:"space-between"}}>
            <View style={{alignItems:'center'}}>
            <Text style={styles.label}>Full Name:</Text>
            <Text style={styles.value}>{user.userName}</Text>
            </View>
            <View style={{alignItems:'center'}}>
            <Text style={styles.label}>Transaction Id:</Text>
            <Text style={styles.value}>{code}</Text>
            </View>
        </View>
      </View>

      {/* Message */}
      <View style={styles.messageBox}>
        <Text style={styles.message}>
          Nội dung: {data.content}
        </Text>
      </View>

      {/* Payment Info */}
      <View style={styles.paymentInfo}>
        <View style={{flexDirection:'row',alignItems:'center'}}>
        <Text>Thanh toán qua   </Text>
        <Image 
          source={require('../assets/img/vnpay.png')}
          style={styles.paymentIcon} 
        />
        </View>
        <Text style={styles.date}>Thời gian:{'\n'} {data.date}</Text>
      </View>
    </View>
    )
}
export default ThankYou;
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f6ebd5',
      padding: 20,
      alignItems: 'center',
    },
    logo: {
      width: 200,
      height: 50,
      resizeMode: 'contain',
      marginBottom: 20,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#4b7b42',
      marginBottom: 5,
    },
    subtitle: {
      fontSize: 16,
      textAlign: 'center',
      color: '#e76d45',
      fontWeight: 'bold',
    },
    description: {
      fontSize: 14,
      textAlign: 'center',
      color: '#7b7b7b',
      marginVertical: 10,
    },
    donationInfo: {
      width: '100%',
      padding: 15,
      backgroundColor: '#fff',
      borderRadius: 10,
      marginVertical: 10,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 5,
    },
    label: {
      fontWeight: 'bold',
      color: '#7b7b7b',
    },
    value: {
      fontSize:14,borderWidth:1,padding:10,borderStyle:"dashed",borderRadius:10,borderColor:"#FBB800"
    },
    messageBox: {
      backgroundColor: '#fff',
      padding: 15,
      borderRadius: 10,
      marginVertical: 10,
      width: '100%',
    },
    message: {
      fontStyle: 'italic',
      color: '#7b7b7b',
    },
    paymentInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 20,
      width: '100%',
    },
    paymentIcon: {
      width: 50,
      height: 50,
      resizeMode: 'contain',
    },
    date: {
      color: '#7b7b7b',
    },
  });