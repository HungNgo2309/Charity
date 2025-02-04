import axios from "axios";
import React, { memo, useEffect, useMemo, useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";
import Icon from 'react-native-vector-icons/FontAwesome6';


const CharityItem = ({ item ,navigation,money}) => {
    //const [data, setData] = useState([]);
    //const [money, setMoney] = useState();
    const [image,setImage]=useState(item.Image)
    const calculateDaysFromNow = useMemo(() => (endDate, startDate = null) => {
        const start = startDate ? new Date(startDate) : new Date();
        const end = new Date(endDate);
        const differenceInTime = end.getTime() - start.getTime();
        const differenceInDays = differenceInTime / (1000 * 3600 * 24);
        return Math.ceil(differenceInDays);
    }, [item.id]);    
    const daysRemaining = calculateDaysFromNow(item.endDay);
    const totalDays = calculateDaysFromNow(item.endDay, item.createDay);
    const progressPercentage = (totalDays - daysRemaining) / totalDays * 100;
    return (
        <TouchableOpacity 
            style={{ 
                flex: 1, 
                position: 'relative', 
                alignItems: 'center', 
                marginRight:10,
                marginVertical:10,
                //padding: 10, 
                width: 300, 
                height: 250, 
                backgroundColor: 'white', 
                borderRadius: 10, 
                elevation: 3 
            }}
            onPress={() => navigation.navigate('Details', { item: item, timeRemain: daysRemaining })} 
        >
            <View style={{ flex: 7 }}>
                <Image
                    source={{uri:item.image[0]}}
                    style={{
                        height: 160,
                        width: 300,
                        borderTopLeftRadius:10 ,
                        borderTopRightRadius:10 ,
                    }}
                    resizeMode="cover"
                />
                <Text style={{ textAlign: 'center',fontWeight:'600',fontSize:18 }}>{item.title}</Text>
            </View>
            <View style={{ flex:3, position: 'absolute', bottom: 0 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                    <Text>
                        <Icon color="#0a46ad" name="clock-rotate-left" size={16} /> {daysRemaining>0?daysRemaining+' ngày':'Hết thời hạn'}
                    </Text>
                    <Text><Icon color="#0a46ad" name="hourglass-end" /> {item.endDay}</Text>
                </View>
                <View style={{ height: 4, width: 250, backgroundColor: 'gray', position: 'relative', marginBottom: 5 }}>
                    <View style={{
                        height: 4,
                        backgroundColor: daysRemaining<5&&daysRemaining>0?'red' :"#0a46ad",
                        width: progressPercentage<100 ?`${progressPercentage}%`:'100%',
                        position: 'absolute'
                    }} />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text><Icon color="green" name="money-check-dollar" />: {money?.totalMoney.toLocaleString('vi-VN', {style: 'currency',currency: 'VND',})}</Text>
                    <Text><Icon color="#0a46ad" name="user-group" /> : {money?.quantity || 0}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};
export default memo(CharityItem);