import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
const Delivery=({route})=>{
    const{data}=route.params;
    const[product,setProduct]=useState([]);
    useEffect(() => {
        data.map((gift) => {
            setProduct((prev) => {
                const existingProduct = prev.find((s) => s.name === gift.name);
                if (existingProduct) {
                    return prev.map((s) =>
                        s.name === gift.name
                            ? { ...s, quantity: s.quantity + 1 } 
                            : s
                    );
                } else {
                    return [...prev, { name: gift.name, quantity: 1 }];
                }
            });
        });
    }, [data]);
    return(
        <View>
            {product.map((item, index) => (
                <Text key={index}>{item.name}: {item.quantity}</Text>
            ))}
        </View>
    )
}
export default Delivery;