import React, { useContext, useState } from "react";
import { Image, KeyboardAvoidingView, Pressable, useWindowDimensions, View } from "react-native";
import { Button, Checkbox, IconButton, Text, TextInput } from "react-native-paper";
import { AuthenticatedUserContext } from "../Context/UserContext";

const PaymentPage = ({route,navigation}) => {
    const { user, setUser } = useContext(AuthenticatedUserContext);
    const{id}=route.params;
    console.log(id);
    const [number, setNumber] = useState(0);
    const [content, setContent] = useState('');
    const [checked, setChecked] = useState(false);
    const [money,setMoney]= useState(0)
    const layout = useWindowDimensions();
    const EnterContent = (content) => {
        if(content.length>150)
        {
            return
        }
        setContent(content);
        setNumber(content.length); 
    };

    return (
        <KeyboardAvoidingView
        style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}  // Adjust based on platform
            keyboardVerticalOffset={80}>
        <View style={{ flex: 1, margin: 10,position:'relative' }}>
            <Text>Thanh toán</Text>
            <View style={{ margin: 10, borderRadius: 15, backgroundColor: '#f2c099', flexDirection: 'column', padding: 10, borderColor: '#FBB800', borderWidth: 2 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text>Phương thức thanh toán</Text>
                    <IconButton icon="credit-card-refresh-outline" />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', margin: 10 }}>
                    <Image 
                        source={require('../../assets/img/vnpay.png')}
                        resizeMode="cover"
                        style={{ height: 50, width: 50, marginRight: 10 }}
                    />
                    <Text>Thanh toán qua VNPAY</Text>
                </View>
            </View>
            <Text>Số tiền</Text>
            <TextInput value={money.toString()} onChangeText={setMoney} mode="outlined" placeholder="0đ" style={{ margin: 10 }} keyboardType="numeric" />
            <Text>Nội dung ({number.toString()}/150) </Text>
            <TextInput
                mode="outlined"
                placeholder="Nội dung quyên góp..."
                multiline
                style={{ margin: 10,padding:5 }}
                value={content}
                onChangeText={(val) => EnterContent(val)} // Fixed onChange to onChangeText
            />
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Checkbox
                    status={checked ? 'checked' : 'unchecked'}
                    onPress={() => {
                        setChecked(!checked);
                    }}
                />
                <Text>Ẩn danh</Text>
            </View>
            <View style={{position:"absolute",bottom:0,alignSelf:'center',width:layout.width}}>
                <Pressable style={{margin:20,backgroundColor:'#FBB800',padding:15,borderRadius:15}} 
                onPress={() => navigation.navigate('VNPAY',{money:money,content:content,id:id,username:user.email
                    ,anonymus:false
                })}>
                    <Text style={{textAlign:'center'}}>Tiếp tục</Text>
                </Pressable>
            </View>
        </View>
        </KeyboardAvoidingView>
    );
};

export default PaymentPage;
