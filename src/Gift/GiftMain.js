import React, { useContext, useEffect, useState } from "react";
import { FlatList, Image, Pressable, ScrollView, TouchableOpacity, View } from "react-native";
import { Appbar, Badge, Button, Dialog, Portal, Text } from "react-native-paper";
import Icon from 'react-native-vector-icons/FontAwesome6';
import { AuthenticatedUserContext } from "../Context/UserContext";
import LottieView from "lottie-react-native";
import { useSelector } from "react-redux";
import axios from "axios";
import Cart from "./Cart";
import { callApi } from "../Component/fetchData";

const GiftMain=({navigation})=>{
    const [charityData,setCharitydata]=useState([]);
    const { userInfo } = useSelector((state) => state.auth);
    const [visible, setVisible] = useState(false);
    const [hidecart,setHideCart]=useState(false);
    const hideDialog = () => setVisible(false);
    const [cart,setCart]=useState([]);
    const [pointtemp,setPointTemp]=useState();
    const HandleChangeGift = (item, action = 'increase') => {
        const find = cart.find(s => s.id === item.id);
        const stock = charityData.find(s => s.id === item.id)?.stock;
    
        const itemPoint = Number(item.point); // Chuyển đổi point thành số
    
        if (action === 'increase') {
            if (stock < 1) return;
    
            if (find && pointtemp >= itemPoint) {
                setCart(prev =>
                    prev.map(s =>
                        s.id === item.id
                            ? { ...s, quantity: s.quantity + 1 }
                            : s
                    )
                );
                setPointTemp(pointtemp - itemPoint);
            } else if (pointtemp >= itemPoint) {
                setCart(prev => [
                    ...prev,
                    {
                        id: item.id,
                        name: item.name,
                        image: item.image,
                        quantity: 1,
                        point: itemPoint, // Đảm bảo point là số
                    }
                ]);
                setPointTemp(pointtemp - itemPoint);
            } else {
                setVisible(true);
            }
        } else if (action === 'decrease') {
            if (find) {
                if (find.quantity > 1) {
                    setCart(prev =>
                        prev.map(s =>
                            s.id === item.id
                                ? { ...s, quantity: s.quantity - 1 }
                                : s
                        )
                    );
                    setPointTemp(pointtemp + itemPoint);
                } else {
                    setCart(prev => prev.filter(s => s.id !== item.id));
                    setPointTemp(pointtemp + itemPoint);
                }
            }
        }
    };
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
          setCart([]);
          setHideCart(false);
          setPointTemp(parseInt(userInfo.point))
        });
        console.log("bắt được");
        return unsubscribe;
      }, [navigation, userInfo.point]);      
    useEffect(() => {
        setPointTemp(parseInt(userInfo.point))
        const fetchItem = async () => {
            try {
                const response = await callApi('GET', '/Gift');
                setCharitydata(response);
            } catch (error) {
                console.log(error);
            }
        };
        fetchItem();
    }, []);
    function ChangeHideCart()
    {
        setHideCart(!hidecart);
    }
    const renderItem=({item})=>{
        return(
            <TouchableOpacity onPress={()=>HandleChangeGift(item)} style={{flexDirection:'row',alignItems:'center',marginLeft:10,backgroundColor:'white'}}>
                <Image style={{flex:2}}  source={{uri:item.image}} height={100} width={100}/>
                <Text style={{flex:3,marginLeft:10}}>{item.name}</Text>
                <Text style={{flex:3}}>{item.point} <Icon name="coins" size={20} color="#FFB800" /></Text>
            </TouchableOpacity>
        )
    }
    return(
        
        <View style={{flex:1,position:'relative'}}>
            <Image source={{uri:"https://tlclighting.com.vn/wp-content/uploads/2021/09/Thumnail-Slide-APP-08-800x400.png"}} height={250}  resizeMode="cover" />
            <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                <Text>Số điểm của bạn: {pointtemp} <Icon name="coins" size={20} color="#FFB800" />
                </Text>
                <View style={{flexDirection:'row'}}>
                <Pressable onPress={()=>navigation.navigate("History")}><Icon name="clock" color="black" size={20}/></Pressable>
                <Pressable onPress={()=>setHideCart(true)} style={{position:'relative',marginRight:5}}>
                    <Icon name="cart-shopping" size={25}/>
                    <Badge style={{position:'absolute',marginBottom:10}} size={15}>{cart.length}</Badge>
                </Pressable>   
                </View>   
            </View>
            <FlatList
                data={charityData}
                renderItem={renderItem}
            />
            {hidecart?<Cart item={cart} ChangeHideCart={ChangeHideCart}  HandleChangeGift={HandleChangeGift} navigation={navigation}/>:null}
            <Portal>
            <Dialog visible={visible} onDismiss={hideDialog}>
                <Dialog.Title>Không đủ điểm để quy đổi</Dialog.Title>
                <Dialog.Content>
                <LottieView 
                    autoPlay
                    source={require('../../assets/lottie/pool.json') }
                    style={{height:200,width:200,alignSelf:'center'}}
                />
                </Dialog.Content>
            </Dialog>
            </Portal>
        </View>
    );
}
export default GiftMain;