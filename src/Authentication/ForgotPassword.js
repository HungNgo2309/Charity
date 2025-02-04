import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Button, Dialog, Portal, TextInput } from 'react-native-paper';
import { callApi } from '../Component/fetchData';

const OTPInputScreen = ({navigation}) => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(0); // 5 phút = 300 giây
  const [token,setToken]=useState();
  const [permission,setPermission]=useState(true);
  const [newpass,setNewpass]=useState('');
  const [accept,setAccept]=useState(false);
  const [email,setEmail]=useState('');
  const [visible, setVisible] = useState(false);
  const hideDialog = () => setVisible(!visible);
  const generateRandomOTP = () => {
    return Math.floor(1000 + Math.random() * 9000); // Tạo số từ 1000 đến 9999
  };
 async function SendOTP()
  {
        try {
            const token =generateRandomOTP()
            setToken(token);
            await callApi('GET', `/User/ForgotPassword?email=${email}&token=${token}`);
            setPermission(false);
            setTimer(180);
        } catch (error) {
            console.error(error)
        }
  }
  // Xử lý đếm ngược
  useEffect(() => {
    if (timer > 0 && !permission) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if(timer==0 && !permission) {
      Alert.alert('Thông báo', 'Mã OTP đã hết hạn!');
      setToken();
    }
  }, [timer]);

  // Hàm định dạng thời gian
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Xử lý thay đổi OTP
  const handleOtpChange = (value, index) => {
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    // Tự động focus ô tiếp theo
    if (value && index < 3) {
      const nextInput = index + 1;
      refs[nextInput]?.focus();
    }
  };

  const refs = Array(4).fill(null);

  // Xử lý khi nhấn nút xác nhận
  const handleSubmit = () => {
    if (otp.join('').length === 4) {
      if (otp.join('') == token) {
        setAccept(true);
    } else {
        Alert.alert('Thông báo', 'Nhập sai mã ' + token + otp.join(''));
    }
    
    } else {
      Alert.alert('Thông báo', 'Vui lòng nhập đủ 4 chữ số OTP!');
    }
  };
  const ChangePass=()=>{
    try {
       callApi('PUT', `/User/UpdatePassword?email=${email}&newpass=${newpass}`);
       hideDialog();
    } catch (error) {
        console.error(error);
    }
  }
  return (
    <View style={styles.container}>
      {
        !accept?

        permission?<>
        <TextInput style={{marginVertical:10}} mode='outlined' value={email} onChangeText={setEmail} placeholder='Enter your email'/>
        <Button mode='outlined' onPress={()=>SendOTP()}>Gửi yêu cầu</Button>
        </>:
        <>
          <Text style={styles.title}>Nhập mã OTP</Text>
          <Text style={styles.timer}>Thời gian còn lại: {formatTime(timer)}</Text>
          
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (refs[index] = ref)}
                style={styles.input}
                keyboardType="numeric"
                maxLength={1}
                value={digit}
                onChangeText={(value) => handleOtpChange(value, index)}
              />
            ))}
          </View>
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Xác nhận</Text>
          </TouchableOpacity>
        </>
        :<>
            <TextInput mode='outlined'style={{marginVertical:10}} value={newpass} onChangeText={setNewpass} placeholder='Enter your new password'/>
            <Button mode='outlined' onPress={()=>ChangePass()}>Đổi mật khẩu</Button>
        </>
      }
       <Portal>
            <Dialog visible={visible} onDismiss={hideDialog}>
                        <Dialog.Title>Thông báo</Dialog.Title>
                        <Dialog.Content>
                            <Text variant="bodyMedium">
                                Cập nhật mật khẩu thành công
                            </Text>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={()=>navigation.navigate("Login")}>Ok</Button>
                        </Dialog.Actions>
                    </Dialog>
            </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: 'center',
    //alignItems: 'center',
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  timer: {
    fontSize: 16,
    color: '#FF0000',
    marginBottom: 20,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  input: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 18,
    backgroundColor: '#fff',
    marginHorizontal: 5,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OTPInputScreen;
