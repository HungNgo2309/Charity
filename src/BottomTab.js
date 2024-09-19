import React from 'react';
import { View, StyleSheet } from 'react-native';

import { CommonActions } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, BottomNavigation } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome6';
import HomePage from './Home/Home_page';
import StackEx from './Explore/Stack';
import DetailDonation from './DetailDonation_page';
import StackHome from './Home/StackHome';
import ThankYou from './ThankYou';
import HistoryPage from './History/History_page';
import StackHistory from './History/StackHistory';
import GiftMain from './Gift/GiftMain';
import StackGift from './Gift/GiftStack';

const Tab = createBottomTabNavigator();

 const BottomTab=()=> {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={({ navigation, state, descriptors, insets }) => (
        <BottomNavigation.Bar
          navigationState={state}
         safeAreaInsets={insets}
          onTabPress={({ route, preventDefault }) => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (event.defaultPrevented) {
              preventDefault();
            } else {
             navigation.dispatch({
                ...CommonActions.navigate(route.name, route.params),
                target: state.key,
              });
            }
          }}
          renderIcon={({ route, focused, color }) => {
            const { options } = descriptors[route.key];
            if (options.tabBarIcon) {
              return options.tabBarIcon({ focused, color, size: 24 });
            }

            return null;
          }}
          getLabelText={({ route }) => {
            const { options } = descriptors[route.key];
            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                ? options.title
                : route.title;

            return label;
          }}
        />
      )}
    >
      <Tab.Screen
        name="Home"
        component={StackHome}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => {
            return <Icon name="house" size={size} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name="Explore"
        component={StackEx}
        options={{
          tabBarLabel: 'Explore',
          tabBarIcon: ({ color, size }) => {
            return <Icon name="searchengin" size={size} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name="Historis"
        component={StackHistory}
        options={{
          tabBarLabel: 'History',
          tabBarIcon: ({ color, size }) => {
            return <Icon name="clock-rotate-left" size={size} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name="Gift"
        component={StackGift}
        options={{
          tabBarLabel: 'Gift',
          tabBarIcon: ({ color, size }) => {
            return <Icon name="gift" size={size} color={color} />;
          },
        }}
      />
    </Tab.Navigator>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default BottomTab;