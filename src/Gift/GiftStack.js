import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import GiftMain from "./GiftMain";
import Delivery from "./Delivery";
import HistoryExchange from "./HistoryExchange";
import Setting from "./Setting";
import Info from "./Info";
import Ranking from "./Ranking";
import Request from "./Request";
import Chat from "./Chat";
const Stack = createStackNavigator();
const StackGift = () => {
    return (
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={Setting} options={{ title: 'Cài đặt' }}/>
          <Stack.Screen name="Main" component={GiftMain} options={{ title: 'Đổi thưởng' }}  />
          <Stack.Screen name="Delivery" component={Delivery} options={{ title: 'Giao hàng' }}/>
          <Stack.Screen name="History" component={HistoryExchange} options={{ title: 'Lịch sử đổi thưởng' }}/>
          <Stack.Screen name="Info" component={Info} options={{title:'Chỉnh sửa thông tin'}}/>
          <Stack.Screen name="Ranking" component={Ranking} options={{title:'Bảng Vinh Danh'}}/>
          <Stack.Screen name="Request" component={Request} /> 
          <Stack.Screen name="Chat" component={Chat} /> 
        </Stack.Navigator>
    );
  };

export default StackGift;