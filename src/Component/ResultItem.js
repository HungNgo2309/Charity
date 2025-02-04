import React, { memo } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";
import Icon from 'react-native-vector-icons/FontAwesome6';

const ResultItem=({item,navigation,money})=>{
    return(
        <TouchableOpacity 
            style={{ 
                flex: 1, 
                position: 'relative', 
                alignItems: 'center', 
                margin: 10, 
                //padding: 10, 
                width: 300, 
                height: 250, 
                backgroundColor: 'white', 
                borderRadius: 15, 
                elevation: 5 
            }} 
            onPress={() => navigation.navigate('Result',{item:item})}
        >
            <View style={{ flex: 7 }}>
                <Image
                    source={{uri:item.images[0]}}
                    style={{
                        height: 160,
                        width: 300,
                        borderTopLeftRadius:15 ,
                        borderTopRightRadius:15 ,
                    }}
                    resizeMode="cover"
                />
                <Text style={{ textAlign: 'center' }}>{item.title}</Text>
            </View>
            <View style={{ flex:3, bottom: 0,marginLeft:10, marginTop: 15,alignSelf:'flex-start'}}>
                    <Text><Icon color="#FFB800" name="money-check-dollar" />: {money?.totalMoney.toLocaleString('vi-VN', {style: 'currency',currency: 'VND',})||0}</Text>
                    <Text><Icon color="#FFB800" name="user-group" /> : {money?.quantity || 0}</Text>
            </View>
        </TouchableOpacity>
    )
}
export default memo(ResultItem)