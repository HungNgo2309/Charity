import React, { useContext, useEffect, useState } from "react";
import { ImageBackground, TouchableOpacity, View, VirtualizedList } from "react-native";
import { Divider, Text } from "react-native-paper";
import { AuthenticatedUserContext } from "../Context/UserContext";
import axios from "axios";

const HistoryPage = ({ navigation }) => {
    const { user } = useContext(AuthenticatedUserContext);
    const [data, setData] = useState([]);

    useEffect(() => {
        const loadCharity = async () => {
            try {
                const url = `http://192.168.23.160:8080/Charity/FindUserID?UserID=${user.email}`;
                const response = await axios.get(url);
                setData(response.data);
            } catch (error) {
                console.log(error);
            }
        };
        loadCharity();
    }, [user]);

    const getItem = (data, index) => data[index];

    const getItemCount = (data) => data.length;

    const DonationItem = ({ item }) => {
        const [post, setPost] = useState(null);

        useEffect(() => {
            const fetchPost = async () => {
                try {
                    const url = `http://192.168.23.160:8080/Post/${item.postID}`;
                    const response = await axios.get(url);
                    setPost(response.data);
                } catch (error) {
                    console.log(error);
                }
            };
            fetchPost();
        }, [item.postID]);

        if (!post) return null; // Ensure the post data is loaded before rendering

        return (
            <TouchableOpacity disabled={item.amountMoney > 0?true:false} onPress={() => navigation.navigate("DonationItem", { item })} style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 10 }}>
                <View>
                    <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{post.title}</Text>
                    <Text>Trạng thái đã được cập nhật</Text>
                    <Text>{item.date}</Text>
                </View>
                <View style={{ justifyContent: 'space-between' }}>
                    <View style={{ backgroundColor: item.status === "4" ? "#c1f5d7" : "#f5c6ab", alignSelf: 'center', padding: 7, borderRadius: 15 }}>
                        <Text style={{ color: item.status === "4" ? "#0BE914" : "#C44500" }}>{item.status === "4" ? "Successful" : "Waiting"}</Text>
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
    };

    return (
        <View style={{ flex: 1 }}>
            <ImageBackground style={{ flex: 1 }} source={require('../../assets/img/background.jpg')} imageStyle={{ opacity: 0.05 }}>
                <Text style={{ margin: 10, fontSize: 25, textAlign: 'center' }}>Lịch sử quyên góp</Text>
                <VirtualizedList
                    data={data}
                    initialNumToRender={4}
                    renderItem={({ item }) => <DonationItem item={item} />}
                    keyExtractor={(item, index) => index.toString()}
                    getItem={getItem}
                    getItemCount={getItemCount}
                    ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: '#ddd', marginHorizontal: 16 }} />}
                />
            </ImageBackground>
        </View>
    );
};

export default HistoryPage;
