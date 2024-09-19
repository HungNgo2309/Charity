import React, { memo, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { FlatList, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Avatar, IconButton, Searchbar, TextInput } from "react-native-paper";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { AuthenticatedUserContext } from "../Context/UserContext";
import axios from "axios";
import Icon from 'react-native-vector-icons/FontAwesome6';
import LottieView from "lottie-react-native";
import CharityItem from "../Component/CharityItem";

const HomePage = ({ navigation }) => {
    const { user } = useContext(AuthenticatedUserContext);
    const [catedd, setCatedd] = useState([{ id: "", name: "Tất cả", image: "https://media.istockphoto.com/id/1456197843/photo/express-yourself.jpg?s=612x612&w=0&k=20&c=nLe-qiKQOJYPVkYsl2-W_3OuXFE0QeKfff0faKBc6cU=" }]);
    const [username, setUsername] = useState(user.userName);
    const [cate, setCate] = useState([]);
    const [data, setData] = useState([]);
    useEffect(() => {
        const LoadData = async () => {
            try {
                const url = 'http://192.168.23.160:8080/Post/Sort?number=5';
                const response = await axios.get(url);
                setData(response.data);
            } catch (error) {
                console.log(error);
            }
        };
        const LoadCate = async () => {
            try {
                const url = 'http://192.168.23.160:8080/Category';
                const response = await axios.get(url);
                setCate([...catedd, ...response.data]);
            } catch (error) {
                console.log(error);
            }
        };
        LoadCate();
        LoadData();
    }, []);
    const rendercate = ({ item }) => (
        <TouchableOpacity style={{ margin: 10, width: 100, height: 100 }}
            onPress={() => navigation.navigate('Explore', { screen: 'Main', params: { select: item.id } })}>
            <View style={{ height: 70, width: 70, alignSelf: 'center' }}>
                <Image source={{ uri: item.image }} style={{ width: '100%', height: '100%', borderRadius: 10 }} resizeMode="cover" />
            </View>
            <Text style={{ textAlign: 'center' }}>{item.name}</Text>
        </TouchableOpacity>
    );

    return (
        <ScrollView>
            <View style={{ marginTop: 10, flexDirection: "row", justifyContent: "space-between" }}>
                <View style={{ flexDirection: "row", alignItems: 'center' }}>
                    <Avatar.Image size={50} source={require('../../assets/img/avatar.jpg')} />
                    <View style={{ flexDirection: "column" }}>
                        <Text>Hello! {username}!</Text>
                        <Text>Chao buoi sang?</Text>
                    </View>
                </View>
                <View style={{ backgroundColor: "white",padding:10, borderRadius: 15, marginRight: 10 ,flexDirection:'row',alignItems:'center'}}>
                    <Icon name="coins" size={20} color="#FFB800" />
                    <Text style={{fontSize:20,marginLeft:10}}>{user.point}</Text>
                </View>
            </View>
            <Searchbar placeholder="Search" />
            <View>
                <Image source={require('../../assets/img/quanao.jpg')} style={{ height: 220, width: 370, borderRadius: 15, margin: 10 }} />
                <Text>Danh mục</Text>
                <FlatList horizontal data={cate} renderItem={rendercate} showsHorizontalScrollIndicator={false} />
                <FlatList horizontal data={data} renderItem={({ item }) => <CharityItem item={item} navigation={navigation} />} showsHorizontalScrollIndicator={false} />
            </View>
        </ScrollView>
    );
};

export default HomePage;
