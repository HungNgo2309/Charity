import axios from "axios";
import React, { useContext, useMemo, useState } from "react";
import { Pressable, View } from "react-native";
import { Text, TextInput } from "react-native-paper";
import { AuthenticatedUserContext } from "../Context/UserContext";

const Login=({ navigation })=>{
    const { user, setUser } = useContext(AuthenticatedUserContext)
    const[email,setEmail]=useState("");
    const[validEmail,setValidEmail]=useState(true);
    const[password,setPassword]=useState("");
    const[validPassword,setValidPassword]=useState(true);
    const CheckEmail =useMemo(() => {
        if ( email == "") {
            setValidEmail(false);
        } else {
            setValidEmail(true);
        }
        password==""?setValidPassword(false):setValidPassword(true)
    },[email,password])
    const handleLogin = async () => {
        try {
            const url = 'http://192.168.23.160:8080/login';
            const response = await axios.get(url, {
                params: {
                    Email: email,
                    password: password
                }
            });
            console.log(response.data);
            setUser(response.data);
            navigation.navigate('BottomTab')
        } catch (error) {
            console.log(error);
        }
    };    
    return(
        <View style={{flex: 1,margin:10,justifyContent:'center'}}>
            <Text style={{fontSize:25,textAlign:'center'}}>Login</Text>
            <TextInput
            style={{marginTop:10,marginBottom:10}}
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
                    validEmail?null:<TextInput.Icon  icon="alert-outline" color="yellow" />
                }
            />
            <TextInput
             style={{marginTop:10,marginBottom:10}}
                mode="outlined"
                placeholder="Mật khẩu"
                value={password}
                onChangeText={setPassword}
                onBlur={CheckEmail}
                left={
                    <TextInput.Icon icon="key-variant" />
                }
                right={
                    validPassword?null:<TextInput.Icon  icon="alert-outline" color="yellow" />
                }
            />
            <Pressable onPress={handleLogin} style={{backgroundColor:'yellow',alignItems:'center',padding:10,borderRadius:10}}>
                <Text>Đăng nhập</Text>
            </Pressable>
            <Text style={{textAlign:'center'}}>Nếu chưa có tài khoản nhấn vào  <Text style={{color:'aqua',textDecorationLine:'underline'}}>Đăng ký tài khoản</Text></Text>
        </View>
    )
}
export default Login;