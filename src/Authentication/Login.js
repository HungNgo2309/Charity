import axios from "axios";
import React, { useContext, useMemo, useState } from "react";
import { Pressable, View,As, ImageBackground, Image } from "react-native";
import { Text, TextInput, Dialog, Portal } from "react-native-paper";
import { AuthenticatedUserContext } from "../Context/UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from 'react-redux';
import { loginFailure, loginSuccess } from "../Redux/auth";
import { LoadingIndicator } from "../Component/LoadingIndicator";
//import { useRoute } from "@react-navigation/native";

const Login=({ navigation })=>{
    const[email,setEmail]=useState("");
    const[validEmail,setValidEmail]=useState(true);
    const[password,setPassword]=useState("");
    const[validPassword,setValidPassword]=useState(true);
    const[startcheck,setStart]=useState(false)
    const dispatch = useDispatch();
    const { isLoggedIn, error } = useSelector(state => state.auth);
    const [isLoading,setIsLoading]=useState(false);
    const [visible, setVisible] = React.useState(false);

  const hideDialog = () => setVisible(false);
    const CheckEmail =useMemo(() => {
        if ( email == "") {
            setValidEmail(false);
        } else {
            setValidEmail(true);
        }
        password==""?setValidPassword(false):setValidPassword(true)
    },[email,password])
    const storeUserCredentials = async (username, password,user) => {
        try {
            ///console.log("init"+user)
          await AsyncStorage.setItem('@username', username);
          await AsyncStorage.setItem('@password', password);
          //await AsyncStorage.setItem('@user', JSON.stringify(user))
          //const test =await  AsyncStorage.getItem('@user');
         // console.log("check"+test);
        } catch (error) {
          console.log('Lỗi khi lưu thông tin đăng nhập: ', error);
        }
      };
    const handleLogin = async () => {
        try {
            if(!validEmail||!validPassword)
            {
                console.log(validPassword)
                setStart(true)
                return
            }
            setIsLoading(true);
            // Simulate an API call for authentication (replace with your actual API)
            const response = await fakeLoginApi(email, password);
            console.log(JSON.stringify(response))
            if (response.success) {

              // Dispatch success action if login is successful
              dispatch(loginSuccess(response.userInfo));
              storeUserCredentials(email,password,response.userInfo)
            } else {
              // Dispatch failure action if login fails
              //dispatch(loginFailure(response.message));
              setVisible(true);
            }
            setIsLoading(false)
          } catch (err) {
            setIsLoading(false)
            dispatch(loginFailure('Something went wrong. Please try again.'));
          }
    }; 
    const fakeLoginApi = async (email, password) => {
        try {
            const url = 'https://desktop-fakfvcn.tailaff69d.ts.net/login';
            const response = await axios.get(url, {
                params: {
                    Email: email,
                    password: password
                }
            });
            console.log(response.data.user);
            //setUser(response.data);
            await  AsyncStorage.setItem('@user_token', response.data.token);
            return { success: true, userInfo:response.data.user};
            //navigation.navigate('BottomTab')
        } catch (error) {
            console.log(error)
            return { success: false, message: 'Invalid credentials' };
        }
      };   
    return(
        <View style={{flex: 1,justifyContent:'center',position:'relative'}}>
            <Image source={require('../../assets/img/login.png')}
             style={{
                height:250,width:270,
                position:'absolute',top:0,alignSelf:'center'
             }}
            />
            <Text style={{fontSize:25,textAlign:'center'}}>Đăng nhập</Text>
            <TextInput
            style={{marginTop:10,marginBottom:10,marginHorizontal:10}}
                mode="outlined"
                label="Email"
                placeholder="Địa chỉ Email của bạn"
                onBlur={CheckEmail}
                value={email}
                onChangeText={setEmail}
                left={
                    <TextInput.Icon icon="email" />
                }
                right={
                    startcheck?<TextInput.Icon  icon="alert-outline" color="#ebd621" />:null
                }
            />
            <TextInput
             style={{marginTop:10,marginBottom:10,marginHorizontal:10}}
                mode="outlined"
                placeholder="Mật khẩu"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                onBlur={CheckEmail}
                left={
                    <TextInput.Icon icon="key-variant" />
                }
                right={
                    startcheck?<TextInput.Icon  icon="alert-outline" color="#ebd621" />:null
                }
            />
            <Pressable onPress={handleLogin} style={{backgroundColor:'#0a46ad',marginHorizontal:10,alignItems:'center',padding:10,borderRadius:10}}>
                <Text style={{color:'white'}}>Đăng nhập</Text>
            </Pressable>
            <Text style={{textAlign:'center'}}>Nếu chưa có tài khoản nhấn vào  <Pressable onPress={()=>navigation.navigate("Register")}><Text style={{color:'blue',textDecorationLine:'underline'}}>Đăng ký tài khoản</Text></Pressable></Text>
            <Pressable onPress={()=>navigation.navigate("ForgotPassword")} ><Text style={{textAlign:'center',textDecorationLine:'underline',color:'blue'}}>Quên mật khẩu</Text></Pressable>
            {
                isLoading?<View style={{position:'absolute',alignItems:'center',justifyContent:'center',backgroundColor: 'rgba(0, 0, 0, 0.5)'
                    ,bottom:0,right:0,top:0,left:0}}>
                        <LoadingIndicator/>
                    </View>:null
            }
            <Portal>
            <Dialog visible={visible} onDismiss={hideDialog}>
                <Dialog.Title>Đăng nhập</Dialog.Title>
                <Dialog.Content>
                <Text variant="bodyMedium">Sai Email hoặc mật khẩu</Text>
                </Dialog.Content>
            </Dialog>
            </Portal>
        </View>
    )
}
export default Login;