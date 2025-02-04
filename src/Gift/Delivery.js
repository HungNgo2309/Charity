import React, { useEffect, useState } from "react";
import { FlatList, Image, TextInput, View } from "react-native";
import { Button, Dialog, Portal, Text } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { callApi } from "../Component/fetchData";
import { updatePoint } from "../Redux/auth";
import { LoadingIndicator } from "../Component/LoadingIndicator";

const Delivery = ({ route,navigation }) => {
    const { data } = route.params;
    const [address, setAddress] = useState("");
    const { userInfo } = useSelector((state) => state.auth);
    const [itemExchange,setItemExChange]= useState([]);
    const [phone,setPhone]= useState(0);
    const [consignee,setConsignee]=useState("");
    const dispatch = useDispatch();
    const [visible, setVisible] = useState(false);
    const hideDialog = () => setVisible(false);
    const [isLoading,setIsLoading]=useState(false);
    const handleUpdatePoint = (point) => {
        console.log(point)
        const newPoint = parseInt(userInfo.point)-parseInt(point); 
        console.log(newPoint)// Điểm mới bạn muốn cập nhật
        dispatch(updatePoint(newPoint));
        console.log(userInfo) // Gửi action cập nhật điểm
      };
      const calculateTotalMoney = (data) => {
        return data.reduce((total, item) => total + (item.point*item.quantity), 0);
    };
    useEffect(()=>{
        data.map((item)=>{
            console.log(item.id)
            setItemExChange((prev)=>[...prev,{
                itemID:item.id,
                quantity:item.quantity,
                point:item.point
            }])
        });
        setAddress(userInfo.address);
        setPhone(userInfo.phone);
        setConsignee(userInfo.userName);
    },[])
    const SenData = async () => {
        try {
                setIsLoading(true);
                console.log("why"+calculateTotalMoney(itemExchange));
                const point = calculateTotalMoney(itemExchange);
                console.log(point)
                const timestampSec = Math.floor(Date.now() / 1000); 
                const body = {
                    userID: userInfo.id,
                    giftID: itemExchange,
                    address: address,
                    phone:phone,
                    consignee:consignee,
                    time: timestampSec// Dùng địa chỉ từ state
                };
                console.log(body)
                const response= await callApi('POST', '/ExchangeGift',body)
                handleUpdatePoint(point);
                setVisible(true);
                setIsLoading(false)
        } catch (error) {
            console.log("Error:", error);
        }
    };
    console.log("check_____"+isLoading);
    // if (isLoading) {
    //     return <LoadingIndicator/>;
    // }

    return (
        <View style={{position:"relative",flex:1}}>
        <View style={{flexDirection:'column'}}>
            <FlatList
                data={data}
                renderItem={({ item }) => (
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between',marginLeft:5, marginVertical: 5, alignItems: 'center' }}>
                        <Text style={{flex:2}}>{item.name}</Text>
                        <Image source={{ uri: item.image }} style={{ height: 50, width: 50 }} />
                        <Text style={{flex:2}}>Số lượng {item.quantity}</Text>
                        <Text style={{flex:2}}>{item.point*item.quantity} points</Text>
                    </View>
                )}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={{ marginBottom: 10 }}
            />
            <Text>Địa chỉ nhận hàng</Text>
            <TextInput 
                value={address} 
                onChangeText={setAddress} 
                style={{ borderWidth: 1, margin: 10, borderRadius: 5 }} 
                placeholder="Nhập nơi nhận hàng"
            />
            <Text>Tên người nhận</Text>
            <TextInput 
                value={consignee} 
                onChangeText={setConsignee} 
                style={{ borderWidth: 1, margin: 10, borderRadius: 5 }} 
                placeholder="Tên người nhận hàng"
            />
             <Text>Số điện thoại</Text>
            <TextInput 
                value={phone.toString()} 
                onChangeText={setPhone} 
                style={{ borderWidth: 1, margin: 10, borderRadius: 5 }} 
                placeholder="Số điện thoại"
            />
            <Button mode="elevated" style={{ alignSelf: 'center' }} onPress={()=>SenData()}>
                Xác nhận quy đổi
            </Button>
            <Portal>
                    <Dialog visible={visible} onDismiss={hideDialog}>
                        <Dialog.Title>Đổi quà thành công</Dialog.Title>
                        <Dialog.Content>
                            <Text variant="bodyMedium">
                                Đã ghi nhận thông tin của bạn. Bạn có thể xem lại trong phần lịch sử đổi quà
                            </Text>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={()=>navigation.navigate("Main")}>Ok</Button>
                        </Dialog.Actions>
                    </Dialog>
            </Portal>
            
        </View>
        {
            isLoading?<View style={{position:'absolute',alignItems:'center',justifyContent:'center',backgroundColor: 'rgba(0, 0, 0, 0.5)'
            ,bottom:0,right:0,top:0,left:0}}>
                <LoadingIndicator/>
            </View>:null
        }
        </View>
    );
};

export default Delivery;
