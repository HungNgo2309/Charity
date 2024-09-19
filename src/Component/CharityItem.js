import axios from "axios";
import React, { memo, useEffect, useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";
import Icon from 'react-native-vector-icons/FontAwesome6';
const calculateDaysFromNow = (endDate, startDate = null) => {
    const start = startDate ? new Date(startDate) : new Date();
    const end = new Date(endDate);
    const differenceInTime = end.getTime() - start.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    return Math.ceil(differenceInDays);
};
const loadCharity = async (id) => {
    try {
        const url = `http://192.168.23.160:8080/Charity/Find?PostID=${id}`;
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.log(error);
    }
};
const CharityItem = ({ item ,navigation}) => {
    const [data, setData] = useState([]);
    const [money, setMoney] = useState(0);
    console.log(item.id);
    const daysRemaining = calculateDaysFromNow(item.endDay);
    const totalDays = calculateDaysFromNow(item.endDay, item.createDay);
    const progressPercentage = (totalDays - daysRemaining) / totalDays * 100;

    useEffect(() => {
        const fetchData = async () => {
            const charityData = await loadCharity(item.id);
            setData(charityData);
        };
        fetchData();
    }, [item]);

    useEffect(() => {
        const calculateTotalMoney = () => {
            const totalMoney = data?.reduce((total, item) => total + item.amountMoney, 0) || 0;
            setMoney(totalMoney);
        };
        calculateTotalMoney();
    }, [data]); // This useEffect runs whenever `data` is updated

    return (
        <TouchableOpacity 
            style={{ 
                flex: 1, 
                position: 'relative', 
                alignItems: 'center', 
                margin: 10, 
                padding: 10, 
                width: 300, 
                height: 250, 
                backgroundColor: 'white', 
                borderRadius: 15, 
                elevation: 5 
            }}
            onPress={() => navigation.navigate('Details', { item: item, timeRemain: daysRemaining })} 
        >
            <View style={{ flex: 1 }}>
                <Image
                    source={require('../../assets/img/quanao.jpg')}
                    style={{
                        height: 110,
                        width: 300,
                        borderRadius: 15,
                    }}
                    resizeMode="cover"
                />
                <Text style={{ textAlign: 'center' }}>{item.title}</Text>
            </View>
            <View style={{ flex: 1, position: 'absolute', bottom: 0, margin: 5 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                    <Text>
                        <Icon color="#FFB800" name="clock-rotate-left" size={16} /> {daysRemaining} ngày
                    </Text>
                    <Text><Icon color="#FFB800" name="hourglass-end" /> {item.endDay}</Text>
                </View>
                <View style={{ height: 4, width: 250, backgroundColor: 'gray', position: 'relative', marginBottom: 5 }}>
                    <View style={{
                        height: 4,
                        backgroundColor: "#FFB800",
                        width: `${progressPercentage}%`,
                        position: 'absolute'
                    }} />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text><Icon color="#FFB800" name="money-check-dollar" />: {money.toLocaleString('vi-VN', {style: 'currency',currency: 'VND',})}</Text>
                    <Text><Icon color="#FFB800" name="user-group" /> : {data?.length || 0}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};
export default memo(CharityItem);