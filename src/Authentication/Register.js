import React, { useEffect, useState } from "react";
import { Image, StyleSheet, View, Pressable, Alert, PermissionsAndroid } from "react-native";
import { Text, TextInput } from "react-native-paper";
import Icon from 'react-native-vector-icons/FontAwesome6';
import messaging from '@react-native-firebase/messaging';
import { launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import axios from "axios";
import { LoadingIndicator } from "../Component/LoadingIndicator";
const Register = ({navigation}) => {
  const [token,setToken]=useState('');
  const [isLoading,setIsLoading]=useState(false);
  useEffect(() => {
    const requestUserPermission = async () => {
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Authorization status:', authStatus);
        const token = await messaging().getToken();
        setToken(token);
        //console.log('FCM token:', token);
      }
    };

    requestUserPermission();
  }, []);
    const [imgUrl, setImgUrl] = useState('https://cdn-icons-png.flaticon.com/512/219/219986.png');
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        phone: '',
        address: ''
    });
    const [errors, setErrors] = useState({});

    const pickImage = () => {
        let options = {
            storageOptions: {
                path: 'image',
            },
        };
        launchImageLibrary(options, (response) => {
            if (response.assets && response.assets.length > 0 && response.assets[0].uri) {
                const selectedImageUrl = response.assets[0].uri;
                setImgUrl(selectedImageUrl);
            } else if (response.didCancel) {
                console.log('Hủy chọn hình ảnh');
            } else if (response.error) {
                Alert.alert('Lỗi', 'Không có ảnh được chọn.');
            }
        });
    };

    const handleInputChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
        setErrors({ ...errors, [field]: '' });
    };

    const validateForm = () => {
        let valid = true;
        let newErrors = {};

        if (!formData.username) {
            newErrors.username = "Tên người dùng không được để trống";
            valid = false;
        }
        if (!formData.password) {
            newErrors.password = "Mật khẩu không được để trống";
            valid = false;
        }
        if (!formData.email) {
            newErrors.email = "Email không được để trống";
            valid = false;
        } else if (!formData.email.includes('@gmail.com')) {
            newErrors.email = "Email không đúng định dạng";
            valid = false;
        }        
        if (!formData.phone) {
            newErrors.phone = "Số điện thoại không được để trống";
            valid = false;
        }
        if (!formData.address) {
            newErrors.address = "Địa chỉ không được để trống";
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = () => {
            validateForm();
            setIsLoading(true);
            //uploadImageAndAddService();
            uploadImageAndAddService()
            setIsLoading(false);
    };
    const uploadImageAndAddService = async () => {
        const response = await fetch(imgUrl);
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
            const url = 'https://desktop-fakfvcn.tailaff69d.ts.net/User'; 
            const body = {
                userName: formData.username,
                password: formData.password,
                phone: formData.password,  // phone có thể cần sửa thành đúng giá trị
                address: formData.password, // address cũng vậy
                email: formData.email,
                point: 0,
                deviceID: token,
                avatar: image,
                passlock:formData.password
            };
    
            const response = await axios.post(url, body);
    
            // Xử lý thành công (status code 200 - 299)
            if (response.status === 201) {
                Alert.alert('Đăng ký thành công');
                navigation.navigate("Login");
                setIsLoading(false);
            }
        } catch (error) {
            // Xử lý lỗi (status code 400 trở lên)
            if (error.response) {
                // Kiểm tra lỗi từ server
                if (error.response.status === 400) {
                    Alert.alert('Email của bạn đã được sử dụng');
                } else {
                    Alert.alert('Lỗi không mong muốn: ' + error.response.status);
                }
            } else {
                // Lỗi không phải từ server (network issue, etc.)
                Alert.alert('Đăng ký thất bại: ' + error.message);
            }
        }
    };
    console.log(imgUrl);
    return (
        <View style={{ flex: 1, backgroundColor: 'white',position:'relative' }}>
            <Text style={{ textAlign: 'center', fontSize: 20 }}>Đăng ký tài khoản</Text>
            <Pressable onPress={pickImage}>
                <Image
                    source={{ uri: imgUrl }}
                    style={styles.img}
                />
            </Pressable>
            <TextInput
                mode="outlined"
                label="Họ và tên người dùng"
                value={formData.username}
                onChangeText={(value) => handleInputChange('username', value)}
                error={!!errors.username}
                left={<TextInput.Icon icon={() => <Icon style={styles.icon} name="user" size={20} />} />}
                style={styles.textip}
            />
            {errors.username ? <Text style={styles.error}>{errors.username}</Text> : null}

            <TextInput
                mode="outlined"
                label="Mật khẩu đăng nhập"
                value={formData.password}
                onChangeText={(value) => handleInputChange('password', value)}
                error={!!errors.password}
                left={<TextInput.Icon icon={() => <Icon style={styles.icon} name="lock" size={20} />} />}
                style={styles.textip}
                secureTextEntry
            />
            {errors.password ? <Text style={styles.error}>{errors.password}</Text> : null}

            <TextInput
                mode="outlined"
                label="Địa chỉ Email"
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                error={!!errors.email}
                left={<TextInput.Icon icon={() => <Icon style={styles.icon} name="envelope" size={20} />} />}
                style={styles.textip}
            />
            {errors.email ? <Text style={styles.error}>{errors.email}</Text> : null}

            <TextInput
                mode="outlined"
                label="Số điện thoại người dùng"
                value={formData.phone}
                onChangeText={(value) => handleInputChange('phone', value)}
                error={!!errors.phone}
                left={<TextInput.Icon icon={() => <Icon style={styles.icon} name="phone" size={20} />} />}
                style={styles.textip}
                keyboardType="numeric"
            />
            {errors.phone ? <Text style={styles.error}>{errors.phone}</Text> : null}

            <TextInput
                mode="outlined"
                label="Địa chỉ liên hệ"
                value={formData.address}
                onChangeText={(value) => handleInputChange('address', value)}
                error={!!errors.address}
                left={<TextInput.Icon icon={() => <Icon style={styles.icon} name="location-dot" size={20} />} />}
                style={styles.textip}
            />
            {errors.address ? <Text style={styles.error}>{errors.address}</Text> : null}

            <Pressable style={styles.button} onPress={handleSubmit}>
                <Text>Đăng ký</Text>
            </Pressable>
            {
                isLoading?<View style={{position:'absolute',alignItems:'center',justifyContent:'center',backgroundColor: 'rgba(0, 0, 0, 0.5)'
                    ,bottom:0,right:0,top:0,left:0}}>
                        <LoadingIndicator/>
                    </View>:null
            }
        </View>
    );
}

export default Register;

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
