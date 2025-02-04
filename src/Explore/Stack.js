import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import ExplorePage from "./Explore_page";
import DetailPage from "../Home/Detail_page";
import PaymentPage from "./Payment_page";
import VNPAY from "./VnPay";
import DonationItem from "./DonationItem_page";
import ThankYou from "../ThankYou";
import DetailDonation from "../DetailDonation_page";
import Result from "./Result";
const Stack = createStackNavigator();
const StackEx = () => {
    return (
        <Stack.Navigator initialRouteName="Main" screenOptions={{headerShown:false}}>
          <Stack.Screen name="Main" component={ExplorePage} options={{ title: 'Khám phá' }}  />
          <Stack.Screen name="Details" component={DetailPage} options={{ title: 'Chi tiết' }} />
          <Stack.Screen name="Payment" component={PaymentPage} options={{title:'Thanh toan'}}/>
          <Stack.Screen name="VNPAY" component={VNPAY}/>
          <Stack.Screen name="DonateItem" component={DonationItem}/>
          <Stack.Screen name="ThankYou" component={ThankYou}/>
          <Stack.Screen name="DetailDonation" component={DetailDonation}/>
          <Stack.Screen name="Result" component={Result}/>
        </Stack.Navigator>
    );
  };

export default StackEx;