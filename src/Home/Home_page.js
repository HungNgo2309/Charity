import React, { memo, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { FlatList, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Avatar, IconButton, Searchbar, TextInput } from "react-native-paper";
import axios from "axios";
import Icon from 'react-native-vector-icons/FontAwesome6';
import CharityItem from "../Component/CharityItem";
import { LoadingContext } from "../Context/LoadingContext";
import { useSelector } from "react-redux";
import { callApi } from "../Component/fetchData";
import { useFocusEffect } from "@react-navigation/native";

const HomePage = ({ navigation }) => {
    const { userInfo,token } = useSelector((state) => state.auth);
    const { loading,setLoading } = useContext(LoadingContext);
    const [catedd, setCatedd] = useState([{ id: "", name: "Tất cả", image: "https://media.istockphoto.com/id/1456197843/photo/express-yourself.jpg?s=612x612&w=0&k=20&c=nLe-qiKQOJYPVkYsl2-W_3OuXFE0QeKfff0faKBc6cU=" }]);
    const [username, setUsername] = useState('');
    const [result,setResult]=useState([]);
    useEffect(() => {
        if (userInfo && userInfo.userName) {
            setUsername(userInfo.userName); // Update username when userInfo is available
        }
    }, [userInfo]);
    const [cate, setCate] = useState([]);
    const [data, setData] = useState([]);
    const [money,setMoney]=useState([])
    
    useEffect(()=>{
        
    },[])
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [posts, categories, results] = await Promise.all([
                    callApi('GET', '/Post/Sort', { number: 5 }),
                    callApi('GET', '/Category'),
                    callApi('GET', '/Result'),
                ]);
    
                if (posts) setData(posts);
            if (categories) setCate([...catedd, ...categories]);
           setResult(results);
            } catch (error) {
                console.error(error);
            }
        };
    
        fetchData();
    }, []);
    
    useFocusEffect(
        useCallback(() => {
            const LoadMoney = async () => {
                try {
                   const response= await callApi('GET', '/Charity/Report');
                   await setMoney(response);
                } catch (error) {
                    console.log(error);
                }
            };
            LoadMoney();
        },[]))
    const rendercate = ({ item }) => (
        <TouchableOpacity style={{ marginRight:10,marginVertical:10, width: 100, height: 100 }}
            onPress={() => navigation.navigate('Explore', { screen: 'Main', params: { select: item.id } })}>
            <View style={{ height: 70, width: 70, alignSelf: 'center' }}>
                <Image source={{ uri: item.image }} style={{ width: '100%', height: '100%', borderRadius: 10 }} resizeMode="cover" />
            </View>
            <Text style={{ textAlign: 'center' }}>{item.name}</Text>
        </TouchableOpacity>
    );
    const loadMoney = (id) => {
        const result = money?.find(s => s.postID === id);
        return result || null;
    };
    return (
        <ScrollView style={{backgroundColor:'white'}}>
            <View style={{ marginTop: 10, marginBottom:10, flexDirection: "row", justifyContent: "space-between" }}>
                <View style={{ flexDirection: "row", alignItems: 'center' }}>
                    <Avatar.Image size={50} source={{uri:userInfo.avatar}} />
                    <View style={{ flexDirection: "column" }}>
                        <Text>Hello! {username}!</Text>
                        <Text>Chao buoi sang?</Text>
                    </View>
                </View>
                <View style={{ backgroundColor: "white",padding:10, borderRadius: 15, marginRight: 10 ,flexDirection:'row',alignItems:'center'}}>
                    <Icon name="coins" size={20} color="#FFB800" />
                    <Text style={{fontSize:20,marginLeft:10}}>{userInfo.point}</Text>
                </View>
            </View>
            {/* <Searchbar placeholder="Search" /> */}
            <View>
                <Image source={require('../../assets/img/benefits-of-charity.jpg')} style={{ height: 220, width: 370, borderRadius: 15, margin: 10 }} />
                <View style={{marginLeft:10}}>
                    <Text style={{fontSize:20,fontWeight:'400',color:'black'}}>Danh mục</Text>
                    <FlatList horizontal data={cate} renderItem={rendercate} showsHorizontalScrollIndicator={false} />
                </View>


                <View style={{marginLeft:10}}>
                    <Text style={{fontSize:20,fontWeight:'400',color:'black'}}>Chiến dịch gần đây</Text>
                    <FlatList horizontal data={data} renderItem={({ item }) => <CharityItem item={item} money={money?.find(s=>s.postID==item.id)} navigation={navigation} />} showsHorizontalScrollIndicator={false} />
                </View>
                {/* <FlatList horizontal data={result} renderItem={({ item }) => <ResultItem item={item} money={money.find(s=>s.postID==item.id)} navigation={navigation}/>} showsHorizontalScrollIndicator={false}/>
                 */}
                 
                 <Text style={{marginLeft:10,marginBottom:5,fontSize:20,fontWeight:'400',color:'black'}}>Kết quả đạt được</Text>
                <View style={{width: '100%', flexDirection: 'row', flexWrap: "wrap"}}>
                    {   
                        result?.length > 0?
                        result.map((item, index) => (
                            <TouchableOpacity key={index} style={{marginLeft:10,marginBottom:10, width: '45%',backgroundColor:'white',elevation:3,borderRadius:8}}
                            onPress={() => navigation.navigate('Result',{item:item})}>
                                <Image
                                    source={{uri:`data:image/jpeg;base64,${ item.image}`}}
                                    style={{
                                        height: 130,
                                        width: "100%",
                                    }}
                                    resizeMode="cover"
                                />
                                <Text style={{textAlign: 'center'}}>{item.title}</Text>
                                <View style={{marginLeft:5}}>
                                    <Text><Icon color="green" name="money-check-dollar" />: {loadMoney(item.postID)?.totalMoney.toLocaleString('vi-VN', {style: 'currency',currency: 'VND',}) || 0}</Text>
                                    <Text><Icon color="#0a46ad" name="user-group" /> : {loadMoney(item.postID)?.quantity || 0}</Text>
                                </View>
                            </TouchableOpacity>
                        )):null
                    }
                </View>

            </View>
        </ScrollView>
    );
};

export default HomePage;
