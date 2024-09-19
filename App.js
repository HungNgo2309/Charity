import React from 'react';
import { ImageBackground, SafeAreaView, View } from 'react-native';
import Homepage from './src/Home/Home_page';
import { PaperProvider, MD3LightTheme as DefaultTheme } from 'react-native-paper';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import ExplorePage from './src/Explore/Explore_page';
import BottomNavigation from './src/BottomTab';
import BottomTab from './src/BottomTab';
import { NavigationContainer } from '@react-navigation/native';
import Login from './src/Authentication/Login';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthenticatedUserProvider } from './src/Context/UserContext';
const Stack = createStackNavigator();
function App() {
  const theme = {
    ...DefaultTheme,
    // Tùy chỉnh theme với màu chữ đen
    colors: {
      ...DefaultTheme.colors,
      text: Colors.black,  // Đặt màu chữ toàn cục là màu đen
    },
  };

  return (
    <AuthenticatedUserProvider>
    <PaperProvider theme={theme}>
      <SafeAreaView style={{flex:1, backgroundColor:theme.colors.background}}>
        <NavigationContainer>
        <Stack.Navigator initialRouteName="Login" screenOptions={{
        headerShown: false,
      }}>
        <Stack.Screen name="BottomTab" component={BottomTab} />
        <Stack.Screen name="Login" component={Login} />
      </Stack.Navigator>
          </NavigationContainer>
      </SafeAreaView>
    </PaperProvider>
    </AuthenticatedUserProvider>
  );
}

export default App;
