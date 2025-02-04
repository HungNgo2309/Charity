import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import NotificationsScreen from "./Notification";
import DonationItem from "../Explore/DonationItem_page";
const Stack = createStackNavigator();
const StackNotifi = () => {
    return (
        <Stack.Navigator initialRouteName="Main">
          <Stack.Screen name="Main" component={NotificationsScreen} options={{ title: 'Thông báo' }} />
          <Stack.Screen name="Detail" component={DonationItem}/>
        </Stack.Navigator>
    );
  };

export default StackNotifi;