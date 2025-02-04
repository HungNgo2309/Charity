import React, { useContext, useEffect, useState } from 'react';
import { Alert, ImageBackground, PermissionsAndroid, SafeAreaView, ToastAndroid, View } from 'react-native';
import { PaperProvider, MD3LightTheme as DefaultTheme, Text } from 'react-native-paper';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import messaging from '@react-native-firebase/messaging';
import BottomTab from './src/BottomTab';
import { NavigationContainer } from '@react-navigation/native';
import Login from './src/Authentication/Login';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthenticatedUserContext, AuthenticatedUserProvider } from './src/Context/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from './src/Redux/store';
import { login } from './src/Redux/auth';
import LottieView from 'lottie-react-native';
import Register from './src/Authentication/Register';
import Toast from 'react-native-root-toast';
import { useNavigation } from '@react-navigation/native';
import useDebounce from './src/hook/UseDebounce';
import { callApi } from './src/Component/fetchData';
import Test from './src/Test';
import SocialMedia from './src/testsocial';
import OTPInputScreen from './src/Authentication/ForgotPassword';
const Stack = createStackNavigator();

function App() {
  const[tokenDV,setTokenDV]=useState("");
  useEffect(() => {
    const requestUserPermission = async () => {
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Authorization status:', authStatus);
        const tokendv = await messaging().getToken();
        setTokenDV(tokendv);
        console.log('FCM token:', tokendv);
      }
    };
    requestUserPermission();
  }, []);
  

  return (
    <Provider store={store}>
        <Main tokendv={tokenDV}/>
    </Provider>
  );
}

export default App;

const Main=({tokendv})=>{
  const dispatch = useDispatch();
  const { isLoggedIn,userInfo,token } = useSelector((state) => state.auth);
  const[loading,setLoading]=useState(true)
  const [check,setCheck] =useState(false)
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      text: Colors.black,
    },
  };
  
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const username = await AsyncStorage.getItem('@username');
        const password = await AsyncStorage.getItem('@password');
        if(username!=null&&password!=null)
        {
          await dispatch(login(username, password));
        }
      } catch (error) {
        console.log('Lỗi khi kiểm tra trạng thái đăng nhập: ', error);
      } 
    };
   
    
    checkLoginStatus();
  const timer = setTimeout(() => {
    setCheck(true); // Dừng Lottie sau 15 giây
  }, 10000);

    return () => clearTimeout(timer); // Cleanup timer khi component bị unmount
  }, []);
  useEffect(()=>{
    const checkDeviceID=async()=>{
      try {
        console.log("ChangeDV----"+tokendv+userInfo.deviceID)
        if (userInfo && userInfo.deviceID !== tokendv) {
          await callApi('PUT', `/User/UpdateDevice?email=${userInfo.email}&DeviceID=${tokendv}`)
          console.log('update ok!!!');
          setLoading(false)
        }
      } catch (error) {
        console.log('Wrong device: ', error);
      }
    }
    checkDeviceID()
  },[userInfo])
  // Hiển thị màn hình chờ khi đang kiểm tra đăng nhập
  if (!check) { // Dừng Lottie khi `check` thành true
    return (
      <View style={{ flex: 1 }}>
        <LottieView
          style={{ width: '100%', height: '100%' }}
          source={require('./assets/lottie/donate_main.json')}
          autoPlay
          loop
        />
      </View>
    );
  }
  console.log("kt" +isLoggedIn)
  return(
    <PaperProvider theme={theme}>
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
          <NavigationContainer  key={isLoggedIn}>
            <Stack.Navigator screenOptions={{
              headerShown: false,
            }}>
              {isLoggedIn ? (<Stack.Screen name="BottomTab" component={BottomTab} />):
              (
                <>
              <Stack.Screen name="Login" component={Login}/>
              <Stack.Screen name="Register" component={Register} />
              <Stack.Screen name="ForgotPassword" component={OTPInputScreen} options={{title:"Quên mật khẩu"}}/>
              </>
              )
              }
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaView>
      </PaperProvider>
  )
}