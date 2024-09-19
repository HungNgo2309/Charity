import React, { useContext, useState } from "react";
import { FlatList, Image, Pressable, TouchableOpacity, View } from "react-native";
import { Badge, Dialog, Portal, Text } from "react-native-paper";
import Icon from 'react-native-vector-icons/FontAwesome6';
import { AuthenticatedUserContext } from "../Context/UserContext";
import LottieView from "lottie-react-native";
const charityData = [
    { id: 1, name: "Giày", point: 5000,image:"https://product.hstatic.net/1000230642/product/bsm000600trg__2__297f6baef8e34e03bd3338bc422916af.jpg" },
    { id: 2, name: "Balo", point: 750,image:"https://macinsta.vn/wp-content/uploads/2023/04/BL99-2.jpg" },
    { id: 3, name: "Tai nghe", point: 100000 ,image:"https://3kshop.vn/wp-content/uploads/2022/12/3kshop-audeze-maxwell-3-1.png"},
    { id: 4, name: "Mũ bảo hiểm", point: 85000,image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRux45Ag3-hBK-epw_OYQbceeZOBX0HBZiNdQ&s" },
  ];
  
const GiftMain=({navigation})=>{
    const [visible, setVisible] = React.useState(false);
    const hideDialog = () => setVisible(false);
    const { user } = useContext(AuthenticatedUserContext);
    const [cart,setCart]=useState([]);
    const [pointtemp,setPointTemp]=useState(user.point);
    const HandleChangeGift=({item})=>{
        if (pointtemp >= item.point) {
            setCart((prev)=>[...prev,item]);
            setPointTemp(pointtemp-item.point)
            //navigation.navigate("Delivery", { item: item });
            console.log(cart);
          } else {
            setVisible(true);
          }
    }
    const renderItem=({item})=>{
        return(
            <TouchableOpacity onPress={()=>HandleChangeGift({item})} style={{flexDirection:'row',alignItems:'center',marginLeft:10,backgroundColor:'white'}}>
                <Image style={{flex:2}}  source={{uri:item.image}} height={100} width={100}/>
                <Text style={{flex:3,marginLeft:10}}>{item.name}</Text>
                <Text style={{flex:3}}>{item.point} <Icon name="coins" size={20} color="#FFB800" /></Text>
            </TouchableOpacity>
        )
    }
    return(
        <View style={{flex:1}}>
            <Image source={{uri:"https://tlclighting.com.vn/wp-content/uploads/2021/09/Thumnail-Slide-APP-08-800x400.png"}} height={250}  resizeMode="contain" />
            <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                <Text>Số điểm của bạn: {pointtemp} <Icon name="coins" size={20} color="#FFB800" /></Text>
                <Pressable onPress={()=>navigation.navigate("Delivery",{data:cart})} style={{position:'relative',marginRight:5}}>
                    <Icon name="cart-shopping" size={30}/>
                    <Badge style={{position:'absolute'}} size={15}>{cart.length}</Badge>
                </Pressable>
                
                
            </View>
            <FlatList
                data={charityData}
                renderItem={renderItem}
            />
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