import React, { useEffect } from 'react';
import { CommonActions } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomNavigation } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome6';
import StackEx from './Explore/Stack';
import StackHome from './Home/StackHome';
import StackHistory from './History/StackHistory';
import StackGift from './Gift/GiftStack';
import StackNotifi from './Notification/StackNotifi';
import messaging from '@react-native-firebase/messaging';
import Toast from 'react-native-root-toast';

const Tab = createBottomTabNavigator();

const BottomTab = ({ navigation }) => {
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      const title = remoteMessage.notification.title;
      const body = remoteMessage.notification.body;
      const toastMessage = `${title}\n${body}`;

      const toast = Toast.show(toastMessage, {
        duration: 15000,
        position: Toast.positions.TOP,
        shadow: true,
        animation: true,
        backgroundColor: 'green',
        textColor: 'white',
        opacity: 0.9,
        containerStyle: {
          width: 600,
          alignSelf: 'center',
          padding: 10,
          borderRadius: 10,
        },
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold',
        },
        onPress: () => {
          Toast.hide(toast);
          navigation.dispatch(
            CommonActions.navigate({
              name: 'BottomTab',
              params: { screen: 'Notifications' },
            })
          );
        },
      });
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          navigation.dispatch(
            CommonActions.navigate({
              name: 'BottomTab',
              params: { screen: 'Notifications' },
            })
          );
        }
      });
  }, [navigation]);

  useEffect(() => {
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      navigation.dispatch(
        CommonActions.navigate({
          name: 'BottomTab',
          params: { screen: 'Notifications' },
        })
      );
    });
  }, [navigation]);

  const getInitialRouteForTab = (tabName) => {
    switch (tabName) {
      case 'Home':
        return 'Main';
      case 'Explore':
        return 'Main';
      case 'Historis':
        return 'Main';
      case 'Notifications':
        return 'Main';
      case 'Setting':
        return 'Home';
      default:
        return null;
    }
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarButton: (props) => {
          const stackInitRoute = getInitialRouteForTab(route.name);
          const isFocused = props.accessibilityState.selected;

          return (
            <TouchableOpacity
              {...props}
              onPress={() => {
                if (isFocused && stackInitRoute) {
                  navigation.dispatch({
                    ...CommonActions.reset({
                      index: 0,
                      routes: [{ name: stackInitRoute }],
                    }),
                  });
                } else {
                  props.onPress();
                }
              }}
            />
          );
        },
      })}
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
            return options.tabBarLabel ?? options.title ?? route.title;
          }}
        />
      )}
    >
      <Tab.Screen
        name="Home"
        component={StackHome}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => <Icon name="house" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Explore"
        component={StackEx}
        options={{
          tabBarLabel: 'Explore',
          tabBarIcon: ({ color, size }) => <Icon name="earth-americas" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Historis"
        component={StackHistory}
        options={{
          tabBarLabel: 'History',
          tabBarIcon: ({ color, size }) => <Icon name="clock-rotate-left" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={StackNotifi}
        options={{
          tabBarLabel: 'Notifications',
          tabBarIcon: ({ color, size }) => <Icon name="bell" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Setting"
        component={StackGift}
        options={{
          tabBarLabel: 'Setting',
          tabBarIcon: ({ color, size }) => <Icon name="gear" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTab;
