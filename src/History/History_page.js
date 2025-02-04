import React, { useCallback, useContext, useEffect, useState } from "react";
import { Alert, ImageBackground, Pressable, TouchableOpacity, View, VirtualizedList } from "react-native";
import { Divider, Text } from "react-native-paper";

import { useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { callApi } from "../Component/fetchData";
import QRCode from "react-native-qrcode-svg";
import Icon from 'react-native-vector-icons/FontAwesome6';
import { LoadingIndicator } from "../Component/LoadingIndicator";

const HistoryPage = ({ navigation }) => {
    const { userInfo } = useSelector((state) => state.auth);
    const [data, setData] = useState([]);
    const [selected, setSelected] = useState();
    const [hide, setHide] = useState(false);
    const [loading,setLoading]=useState(false);
    const [post, setPost] = useState([]);
    useFocusEffect(
        useCallback(() => {
            const fetchAllData = async () => {
                try {
                    setLoading(false);
                    const [posts, charityData] = await Promise.all([
                        callApi('GET', '/Post'),
                        callApi('GET', '/Charity/FindUserID', { UserID: userInfo.email }),
                    ]);
                    setPost(posts || []);
                    setData(charityData || []);
                } catch (error) {
                    console.error('Error fetching data:', error);
                    Alert.alert('Không thể tải dữ liệu. Vui lòng thử lại sau.');
                } finally {
                    setLoading(true);
                }
            };
            fetchAllData();
        }, [userInfo.email])
    );
    

    const getItem = (data, index) => data[index];
    const getItemCount = (data) => data?.length;
    
    
    
    const DonationItem = useCallback(({ item,post }) => {
        if (!post) return null;
        return (
            <TouchableOpacity 
                disabled={item.amountMoney > 0} 
                onPress={() => navigation.navigate("DonationItem", { item })} 
                style={{flex:1, flexDirection: 'row', justifyContent: 'space-between', margin: 10 }}
            >
                <View style={{flex:7}}>
                    <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{post.title}</Text>
                    <Text>Trạng thái đã được cập nhật</Text>
                    <Text>{item.date}</Text>
                    {
                        item.status === "3"&& item.amountMoney == 0?<Pressable onPress={() => { setSelected(item); setHide(true); }}>
                        <Icon size={20} name="qrcode" />
                    </Pressable>:null
                    }
                    
                </View>
                <View style={{ flex:3,justifyContent: 'space-between' }}>
                    <View 
                        style={{ backgroundColor: item.status === "4" || item.amountMoney > 0 ? "#c1f5d7" : "#f5c6ab", alignSelf: 'center', padding: 7, borderRadius: 15 }}
                    >
                        <Text style={{ color: item.status === "4" || item.amountMoney > 0 ? "#0BE914" : "#C44500" }}>
                            {item.status === "4"|| item.amountMoney > 0 ? "Successful" : "Waiting"}
                        </Text>
                    </View>
                    {item.amountMoney > 0 ? (
                        <Text style={{ color: '#FFB800' }}>
                            {Intl.NumberFormat('vi-VN', {
                                style: 'currency',
                                currency: 'VND',
                            }).format(item.amountMoney)}
                        </Text>
                    ) : (
                        item.listOther.map((otherItem, idx) => (
                            <Text key={idx}>{otherItem.name}: {otherItem.quantity}</Text>
                        ))
                    )}
                </View>
            </TouchableOpacity>
        );
    }, [navigation]);

    const renderItem = useCallback(({ item }) => {
        const relatedPost = post?.find((s) => s.id === item.postID);
        if (!relatedPost) {
            console.warn('No related post found for item:', item);
        }
        return <DonationItem item={item} post={relatedPost} />;
    }, [post]);
    
    return (
        <View style={{ flex: 1 }}>
            {
                loading?
            <ImageBackground 
                style={{ flex: 1, position: 'relative' }} 
                source={require('../../assets/img/background.jpg')} 
                imageStyle={{ opacity: 0.05 }}
            >
                <Text style={{ margin: 10, fontSize: 25, textAlign: 'center' }}>Lịch sử quyên góp</Text>
                {data?
                <VirtualizedList
                    data={data}
                    initialNumToRender={4}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    getItem={getItem}
                    getItemCount={getItemCount}
                    ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: '#ddd', marginHorizontal: 16 }} />}
                />
                :<Text style={{textAlign:'center'}}>Bạn chưa tham gia hoạt động quyên góp nào</Text>}
                {hide && selected ? (
                    <TouchableOpacity 
                        style={{
                            flex: 1, position: 'absolute', alignItems: 'center', top: 0, bottom: 0, left: 0, right: 0, 
                            justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)'
                        }}
                        onPress={() => setHide(false)}
                    >
                        <View style={{backgroundColor:"white",paddingHorizontal:10,paddingVertical:10}}>
                        <Text style={{textAlign:'center',marginBottom:10}}>QR xác nhận quyên góp</Text>
                        <QRCode
                            value={`http://admincharityofhung.somee.com/CharityMoney/Detail?id=${selected.charityID}`}
                            size={230}
                        />
                        </View>
                    </TouchableOpacity>
                ) : null}
            </ImageBackground>:
                <View style={{position:'absolute',alignItems:'center',justifyContent:'center',backgroundColor: 'rgba(0, 0, 0, 0.5)'
                    ,bottom:0,right:0,top:0,left:0}}>
                        <LoadingIndicator/>
                    </View>
            }
        </View>
    );
};

export default HistoryPage;
