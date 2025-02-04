import React, { useEffect, useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Avatar, Divider, Text } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import Icon from 'react-native-vector-icons/FontAwesome6';
import { logout, updatePoint } from "../Redux/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Setting=({ navigation })=>{
    const { userInfo } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    return(
        <View style={{backgroundColor:'white',flex:1}}>
            <View style={{height:150,flexDirection:'row',position:'relative',alignItems:'center'}}>
                <Image style={{position:'absolute'}}  height={150} width={400} resizeMode="cover" source={{uri:"https://i.pinimg.com/736x/d3/f4/f2/d3f4f28104ca19a2b199b52a8b9208a1.jpg"}}/>
                {
                    userInfo.avatar?<Avatar.Image source={{uri:userInfo.avatar}}/>:null
                }
                <View style={{marginLeft:10,justifyContent:'center'}}>
                    <Text style={{fontSize:22,fontWeight:'400'}}>{userInfo.userName}</Text>
                    <Text>{userInfo.point}</Text>
                </View>
            </View>
            <View>
                <TouchableOpacity onPress={()=>navigation.navigate('Info')} style={style.element}>
                    <Text><Icon name="user" color="black"/> Thông tin cá nhân</Text>
                </TouchableOpacity>
                <Divider/>
                <TouchableOpacity onPress={()=>navigation.navigate("Main")} style={style.element}><Text>
                <Icon name="gift" color="black"/> Đổi thưởng</Text></TouchableOpacity>
                <Divider/>
                <TouchableOpacity onPress={()=>navigation.navigate("Ranking")} style={style.element}><Text>
                <Icon name="ranking-star" color="black"/> Bảng Vinh Danh</Text></TouchableOpacity>
                <Divider/>
                <TouchableOpacity onPress={()=>navigation.navigate("Chat")} style={style.element}><Text>
                <Icon name="message" color="black"/> Liện hệ </Text></TouchableOpacity>
                <Divider/>
                <TouchableOpacity onPress={()=>navigation.navigate("Request")} style={style.element}><Text>
                <Icon name="bullhorn" color="black"/> Gửi yêu cầu </Text></TouchableOpacity>
                <Divider/>
                <TouchableOpacity style={style.element}
                
                onPress={async()=>{
                    await AsyncStorage.setItem('@username','');
                    await AsyncStorage.setItem('@password', '');
                     dispatch(logout());
                }}><Text><Icon name="right-from-bracket" color="black"/> Đăng xuất</Text></TouchableOpacity>
            </View>
        </View>
    )
}
export default Setting;

const style=StyleSheet.create({
    element:{
        backgroundColor:'white',
        padding:10,
        fontSize:20
    }
})