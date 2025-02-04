import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import HomePage from "./Home_page";
import DetailPage from "./Detail_page";
import VNPAY from "../Explore/VnPay";
import DonationItem from "../Explore/DonationItem_page";
import ThankYou from "../ThankYou";
import PaymentPage from "../Explore/Payment_page";
import Result from "../Explore/Result";
import DetailDonation from "../DetailDonation_page";
const Stack = createStackNavigator();
const StackHome = () => {
    return (
        <Stack.Navigator initialRouteName="Main" screenOptions={{headerShown:false}}>
          <Stack.Screen name="Main" component={HomePage}/>
          <Stack.Screen name="Details" component={DetailPage} options={{ title: 'Chi tiết' }} />
          <Stack.Screen name="Payment" component={PaymentPage} options={{title:'Thanh toan'}}/>
          <Stack.Screen name="VNPAY" component={VNPAY}/>
          <Stack.Screen name="DonateItem" component={DonationItem}/>
          <Stack.Screen name="ThankYou" component={ThankYou}/>
          <Stack.Screen name="Result" component={Result}/>
          <Stack.Screen name="DetailDonation" component={DetailDonation}/>
        </Stack.Navigator>
    );
  };

export default StackHome;