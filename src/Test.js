import React, { useEffect, useState } from "react";
import { View, PermissionsAndroid, Alert, Linking, TouchableOpacity } from "react-native";
import Geolocation from '@react-native-community/geolocation';
import { Button, Text, TextInput } from "react-native-paper";
import QRCode from "react-native-qrcode-svg";
import axios from "axios";

const Test = () => {
    const [currentLocal, setCurrentLocal] = useState(null);

    const requestPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'Location Permission',
                    message: 'This app needs access to your location to show your current position.',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('You can use the LOCATION');
                getCurrentLocation();
            } else {
                console.log('LOCATION permission denied');
            }
        } catch (err) {
            console.warn(err);
        }
    };

    const getCurrentLocation = () => {
        Geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                setCurrentLocal({ latitude, longitude });
                console.log(latitude, longitude);
            },
            error => Alert.alert('Error', error.message),
            {
                //enableHighAccuracy: true,
                timeout: 30000, // Increased timeout to 30 seconds
                forceRequestLocationUpdate: true // For Android 12+ devices
            }
        );
    };
    

    const openMaps = () => {
        if (currentLocal?.latitude && currentLocal?.longitude) {
            const url = `https://www.google.com/maps/search/?api=1&query=${currentLocal.latitude},${currentLocal.longitude}`;
            //const url = `https://www.google.com/maps/search/?api=1&query=13.1912633,109.1273678`;
            Linking.openURL(url);
        } else {
            Alert.alert('Error', 'Location not available');
        }
    };
    const [address,setAddress]=useState('');
    async function  fetchAddress (){
        const url =`https://api.opencagedata.com/geocode/v1/json?q=${address},%20Việt%20Nam&key=9b9333f371a04490af3b534ff82f2cd0`;
        const respone = await axios.get(url);
        if (respone.data && respone.data.results.length > 0) {
            const location = respone.data.results[0].geometry;;
            console.log(location);
            if(location)
                {
                    calculateDistance(currentLocal.latitude,currentLocal.longitude,location.lat,location.lng);
           
                }
        }
        
    }
         async function calculateDistance(lat1, lon1, lat2, lon2) {
            const url = `https://router.hereapi.com/v8/routes?transportMode=car&origin=${lat1},${lon1}&destination=${lat2},${lon2}&return=summary&apikey=ZUN6c6-74HyiCfIEU_5DR2CurreNin224_WwgELjbKA`;
            const response = await axios.get(url);
            
            // Kiểm tra cấu trúc dữ liệu trả về
            if (response.data.routes && response.data.routes[0].sections && response.data.routes[0].sections[0].summary) {
              const summary = response.data.routes[0].sections[0].summary;
              const distance = summary.length;
              console.log(`Khoảng cách: ${distance / 1000} km`);
              return distance;
            } else {
              console.log("Không tìm thấy thông tin khoảng cách trong kết quả trả về.");
              return null;
            }
          }
          
    useEffect(()=>{
        const check=async()=>
        {
            try{
                console.log("chạy")
                const url ="http://172.31.240.1:8080/Request";
                const respone = await axios.get(url);
                console.log(respone.data);
            }
            catch(error)
            {
                console.er(error);
            }
        }
        check();
    },[])  
    return (
        <View style={{flex:1}}>
            <Text>Get coords</Text>
            <Text>Latitude: {currentLocal ? currentLocal.latitude : 'N/A'}</Text>
            <Text>Longitude: {currentLocal ? currentLocal.longitude : 'N/A'}</Text>
            <TextInput value={address} onChangeText={setAddress}/>
            <Button onPress={()=>fetchAddress()}>Check</Button>
            {currentLocal ? (
                <TouchableOpacity onPress={openMaps}>
                    <View>
                        <Text>Open map</Text>
                    </View>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity onPress={requestPermission}>
                    <View>
                        <Text>Get location</Text>
                    </View>
                </TouchableOpacity>
            )}
            
            {/* <QRCode
                
                value="https://www.npmjs.com/package/react-native-geolocation-service/v/5.3.0-beta.3"
                /> */}
            
        </View>
    );
};

export default Test;
