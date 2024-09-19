import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import GiftMain from "./GiftMain";
import Delivery from "./Delivery";
const Stack = createStackNavigator();
const StackGift = () => {
    return (
        <Stack.Navigator initialRouteName="Main">
          <Stack.Screen name="Main" component={GiftMain}   />
          <Stack.Screen name="Delivery" component={Delivery}/>
        </Stack.Navigator>
    );
  };

export default StackGift;