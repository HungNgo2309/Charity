import React from "react";
import { FlatList, Image, Pressable, TouchableOpacity, View } from "react-native";
import { IconButton, Text } from "react-native-paper";

const Cart = ({ item,ChangeHideCart,HandleChangeGift,navigation }) => {
  console.log(item);
  return (
    <View style={{ position: 'absolute',height:'100%',bottom:0, width: '100%' }}>
      <TouchableOpacity style={{height:'40%',backgroundColor: 'rgba(0, 0, 0, 0.5)'}} onPress={()=>ChangeHideCart()}>

      </TouchableOpacity>
      <View style={{ height: '60%', backgroundColor: 'white' }}>
        <Text>Sản phẩm trong giỏ hàng</Text>
        <FlatList
          data={item}
          keyExtractor={(item, index) => index.toString()} // Ensure unique keys
          renderItem={({ item }) => (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5,alignItems:'center' }}>
              <Text style={{flex:2}}>{item.name}</Text>
              <Image style={{flex:2}} source={{uri:item.image}} height={50} width={50} resizeMode="contain"/>
              <View  style={{alignItems:"center",flexDirection:'row',flex:2}}>
                <IconButton size={15} icon="plus" onPress={()=>HandleChangeGift(item)}/>
                <Text>{item.quantity}</Text>
                <IconButton size={15} icon="minus" onPress={() => HandleChangeGift(item, 'decrease')} />
              </View>
              <Text style={{flex:2}}>{item.point*item.quantity} points</Text>
            </View>
          )}
        />
        <Pressable style={{alignItems:'center',margin:5,backgroundColor:'yellow',padding:10}} onPress={()=>navigation.navigate("Delivery",{data:item})}>
            <Text>Quy đổi</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default Cart;
