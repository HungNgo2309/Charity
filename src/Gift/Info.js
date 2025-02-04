import React, { useEffect, useState } from "react";
import { Alert, Image, Pressable, StyleSheet, View } from "react-native";
import { Button, IconButton, TextInput } from "react-native-paper";
import { useSelector } from "react-redux";
import { launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import axios from "axios";
import { callApi } from "../Component/fetchData";
import { set } from "@react-native-firebase/database";

const Info=()=>{
    const { userInfo } = useSelector((state) => state.auth);
    const [username,setUsername]=useState('');
    const [address,setAddress]=useState('');
    const [phone,setPhone]=useState(0);
    const [email,setEmail]=useState('')
    const [avatar,setAvatar]=useState('');
    const [change, setChange]=useState(false);
    useEffect(()=>{
        setUsername(userInfo.userName);
        setAddress(userInfo.address);
        setAvatar(userInfo.avatar);
        setPhone(userInfo.phone);
        setEmail(userInfo.email);
    },[])
    const pickImage = () => {
        let options = {
            storageOptions: {
                path: 'image',
            },
        };
        launchImageLibrary(options, (response) => {
            if (response.assets && response.assets.length > 0 && response.assets[0].uri) {
                const selectedImageUrl = response.assets[0].uri;
                setAvatar(selectedImageUrl);
                setChange(true);
            } else if (response.didCancel) {
                setChange(false);
                console.log('Hủy chọn hình ảnh');
            } else if (response.error) {
                setChange(false);
                Alert.alert('Lỗi', 'Không có ảnh được chọn.');
            }
        });
    };
    const uploadImageAndAddService = async () => {
        if(!change)
        {
            return;
        }
        const response = await fetch(avatar);
        console.log(response);
        const blob = await response.blob();
        const storageRef = storage().ref(new Date().getTime().toString());
        const uploadTask = storageRef.put(blob);
        uploadTask.on(
            'state_changed',
            (snapshot) => {
                // Theo dõi tiến trình upload nếu cần
            },
            (error) => {
                console.error('Error uploading image:', error);
            },
            () => {
                uploadTask.snapshot.ref.getDownloadURL().then(async (downloadURL) => {
                    console.log('File available at', downloadURL);
                    await SendItem(downloadURL);
                });
            }
        );
    };
    const SendItem = async (image) => {
        try {
            const body = {
                userName:username,
                password: userInfo.password,
                phone: phone,  // phone có thể cần sửa thành đúng giá trị
                address: address, // address cũng vậy
                email: email,
                point: userInfo.point,
                deviceID: userInfo.deviceID,
                avatar: change?image:userInfo.avatar,
            };
            const response= await callApi('PUT', `/User/${userInfo.id}`,body)
            console.log(response)
            Alert.alert('Cập nhật thành công')
        } catch (error) {
                // Lỗi không phải từ server (network issue, etc.)
                Alert.alert('Cập nhật thất bại: ' + error.message);
        }
    };
    return(
        <View>
            {
                avatar?<Pressable onPress={pickImage}>
                <Image
                    source={{ uri: avatar }}
                    style={styles.img}
                    />
                </Pressable>:null
            }
                
                <TextInput
                    value={username}
                    onChangeText={setUsername}
                    style={styles.textip}
                />
                <TextInput
                    value={address}
                    onChangeText={setAddress}
                    style={styles.textip}
                />
                <TextInput
                    value={phone.toString()}
                    onChangeText={setPhone}
                    style={styles.textip}
                />
                <TextInput
                    value={email}
                    onChangeText={setEmail}
                    style={styles.textip}
                />
                <Button onPress={()=>change?uploadImageAndAddService():SendItem()}>Save</Button>
        </View>
    )
}
export default Info;

const styles = StyleSheet.create({
    textip: {
        marginHorizontal: 20,
        backgroundColor: 'white',
        borderColor: '#D2D2D2',
        marginVertical: 10,
        elevation: 10,
        shadowColor: 'gray', // Màu bóng
        shadowOffset: { width: 0, height: 2 }, // Dịch chuyển bóng
        shadowOpacity: 0.75, // Độ mờ bóng
        shadowRadius: 3.84,
    },
    icon: {
        color: '#FFB800'
    },
    img: {
        width: "30%",
        height: 110,
        alignSelf: 'center',
        margin: 10
    },
    button: {
        backgroundColor: '#FFB800',
        alignItems: 'center',
        margin: 10,
        padding: 10,
        borderRadius: 10
    },
    error: {
        color: 'red',
        marginHorizontal: 20,
    }
});
