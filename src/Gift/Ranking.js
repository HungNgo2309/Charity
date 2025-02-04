import React, { useEffect, useState } from "react";
import { FlatList, Image, Pressable, View } from "react-native";
import { Text } from "react-native-paper";
import { callApi } from "../Component/fetchData";
import { useSelector } from "react-redux";

const Ranking =()=>{
    const { userInfo } = useSelector((state) => state.auth);
    const [datamonney,setDataMoney]=useState([]);
    const [dataitem,setDataItem]=useState([]);
    const [state, setState]= useState(false);/// trạng thái tiền hoặc hiện vật
    const [email,setEmail]= useState();
    useEffect(()=>{
        const Fetchmoney=async()=>{
            try {
                const response =  await callApi('GET', '/Charity/RankMoney');
                setDataMoney(response);
            } catch (error) {
                console.error(error)
            }
        }
        const FetchItem=async()=>{
            try {
                const response =  await callApi('GET', '/Charity/RankItem');
                setDataItem(response);
            } catch (error) {
                console.error(error)
            }
        }
        setEmail(userInfo.email)
        Fetchmoney();
        FetchItem();
    },[])
    const images = [
        require('../../assets/img/rank1.png'),
        require('../../assets/img/rank2.png'),
        require('../../assets/img/rank3.png'),
      ];
    const renderItem=({item, index })=>{
        const img = images[index] || null;
        return(
        <View style={{flexDirection:'row',padding:10}}>
            {
                img!=null?
                <Image source={img} style={{ width: 30, height: 30, marginRight: 10 }} resizeMode="contain" />
                :<Text style={{flex:1}}>{index + 1}</Text>
            }
            <Text style={{flex:2}}>{item.userID}</Text>
            <Text style={{flex:2}}>{!state?Intl.NumberFormat('vi-VN', {
                                style: 'currency',
                                currency: 'VND',
                            }).format(item.totalAmountMoney):item.totalItemQuantity+" hiện vật"}</Text>
        </View>
        )
    }
    return(
        <View style={{backgroundColor:'white',flex:1,position:'relative'}}>
            <View style={{flexDirection:'row'}}>
                <Pressable style={{flex:1,alignItems:'center',padding:10,borderBottomWidth:2,borderBottomColor:!state?'blue':"white"}} onPress={()=>setState(false)}><Text>Quyên góp tiền</Text></Pressable>
                <Pressable style={{flex:1,alignItems:'center',padding:10,borderBottomWidth:2,borderBottomColor: state?'blue':"white"}} onPress={()=>setState(true)}><Text>Quyên hiện vật</Text></Pressable>
            </View>
            <FlatList
                data={state?dataitem:datamonney}
                renderItem={renderItem}
            />
            <View style={{position:'absolute',backgroundColor:'aqua',left:0,right:0,bottom:0,elevation:5,padding:10}}>
                <Text style={{textAlign:'center'}}>Xếp hạng của bạn là: {
                    !state?datamonney?.findIndex(s=>s.userID==email)+1:dataitem?.findIndex(s=>s.userID==email)+1
                    }</Text>
            </View>
        </View>
    )
}
export default Ranking;