import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import HistoryPage from "./History_page";
import DonationItem from "../Explore/DonationItem_page";
const Stack = createStackNavigator();
const StackHistory= () => {
    return (
        <Stack.Navigator initialRouteName="Main">
          <Stack.Screen name="Main" component={HistoryPage}  />
          <Stack.Screen name="DonationItem" component={DonationItem}/>
        </Stack.Navigator>
    );
  };

export default StackHistory;