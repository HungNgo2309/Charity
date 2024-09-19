import React from "react";
import { Image, ImageBackground, ScrollView, View } from "react-native";
import { Text } from "react-native-paper";
import Icon from 'react-native-vector-icons/FontAwesome6';
import TabViewCustom from "../TabViewCustomer";

const DetailPage=({route, navigation})=>{
    const { item, timeRemain } = route.params;
    return(
        <View style={{ flex: 1 }}>
            <ScrollView>
            <Image
                source={require('../../assets/img/quanao.jpg')}
                style={{
                    height:220,
                    width:370,
                    borderRadius:15,margin:10,
                }}
            />
            <View style={{flexDirection:"row",justifyContent:'space-between',margin:10}}>
                <Text style={{color:'#FFB800',fontSize:20,flex:8,alignSelf:'center'}}>{item.title}</Text>
                <Text style={{color:'#FFB800',flex:2,alignSelf:'center',backgroundColor:'#f7dab0',padding:10,borderRadius:10}}><Icon color="#FFB800" name="clock-rotate-left" size={16} /> {timeRemain} ngày</Text>
            </View>
            <Text style={{color:'#FFB800'}}>Thong tin chi tiet</Text>
            <View style={{flexDirection:'row',margin:10}}>
                <Icon name="calendar-days" size={18} />
                <Text style={{marginLeft:10}}>từ ngày {item.createDay} đến {item.endDay}</Text>
            </View>
            <View style={{flexDirection:'row',margin:10}}> 
                <Icon name="location-dot" size={18}/>
                <Text style={{marginLeft:10}}>{item.address}</Text>
            </View>
            <Text> Mô tả</Text>
            <Text style={{marginBottom:10}}>
                {item.content}
            </Text>
            <ImageBackground source={require('../../assets/img/background.jpg')} imageStyle={{opacity:0.05}}>
            
            
            {/* <TabViewExample/> */}
            <TabViewCustom timeRemain={timeRemain} id={item.id} navigate={navigation}/>
            </ImageBackground>
            </ScrollView>
        </View>
    )
}
export default DetailPage;