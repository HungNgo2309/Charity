import React, { useState } from "react";
import { FlatList, Image, ImageBackground, Pressable, ScrollView, View } from "react-native";
import { Text } from "react-native-paper";
import Icon from 'react-native-vector-icons/FontAwesome6';
import TabViewCustom from "../TabViewCustomer";
import HTMLContentComponent from "../Component/HTMLContentComponent ";
import Share from 'react-native-share';

const DetailPage=({route, navigation})=>{
    const { item, timeRemain } = route.params;
    //console.log("whu"+item.image);
    const options={
        url:item.image[0],
        message:item.title,
    }
    const fun = async () => {
        try {
            const shareResponse = await Share.open(options);
            console.log(shareResponse);
        } catch (error) {
            //console.error(error)
        }
        
      };
    return(
        <View style={{ flex: 1 ,backgroundColor:'#f9faf0'}}>
            <ScrollView>
            <View style={{backgroundColor:"white"}}>
            <View style={{flexDirection:"row",justifyContent:'space-between',margin:10}}>
                <Pressable onPress={()=>navigation.goBack()}><Icon name="arrow-left" size={25}/></Pressable>
                <Text style={{fontSize:20,flex:8,textAlign:'center'}}>{item.title}</Text>
                <Pressable onPress={()=>fun()}><Icon name="share-from-square" size={25}/></Pressable>
            </View>
            <Slide item={item.image} />
            
            <Text style={{color:'black',fontSize:18,fontWeight:'700'}}>Thông tin chi tiết</Text>
            <View style={{flexDirection:'row',margin:10}}>
                <Icon name="calendar-days" size={18} />
                <Text style={{marginLeft:10}}>từ ngày {item.createDay} đến {item.endDay}</Text>
            </View>
            <View style={{flexDirection:'row',margin:10}}> 
                <Icon name="location-dot" size={18}/>
                <Text style={{marginLeft:10}}>{item.address}</Text>
            </View>
            <Text style={{color:'black',fontSize:18,fontWeight:'700'}}> Mô tả</Text>
            <HTMLContentComponent htmlContent={item.content} />
            
            <View style={{backgroundColor:'#f9faf0',height:10}}>

            </View>
            </View>
            {/* <TabViewExample/> */}
            <TabViewCustom timeRemain={timeRemain} id={item.id} navigate={navigation} post={item}/>
            </ScrollView>
        </View>
    )
}
const Slide = ({ item }) => {
    // Check if item is an array and contains data
    if (!item || !Array.isArray(item) || item.length === 0) {
        return <Text>No images to display</Text>;
    }

    return (
        <FlatList
            data={item} // item is already an array, no need to split
            keyExtractor={(url, index) => index.toString()} // Unique key for each image
            renderItem={({ item: url }) => (
                <Image
                    source={{ uri: url }} // Use the URL as the image source
                    style={{
                        height: 220,
                        width: 370,
                        borderRadius: 15,
                        margin: 10,
                        
                    }}
                />
            )}
            horizontal // Make the list scroll horizontally
            showsHorizontalScrollIndicator={false} // Hide the horizontal scroll bar
        />
    );
};


export default DetailPage;