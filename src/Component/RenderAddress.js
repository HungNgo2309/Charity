import React, { useEffect, useState } from "react";
import { TouchableOpacity, View, PermissionsAndroid, Alert, Linking, FlatList } from "react-native";
import { Text } from "react-native-paper";
import axios from "axios";
import Geolocation from '@react-native-community/geolocation';
import Icon from 'react-native-vector-icons/FontAwesome6';

const RenderAddress = ({ data }) => {
    const [currentLocal, setCurrentLocal] = useState(null);
    const [distances, setDistances] = useState({});
    const [locations, setLocations] = useState({});

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
            },
            error => Alert.alert('Error', error.message),
            {
                timeout: 30000,
                forceRequestLocationUpdate: true
            }
        );
    };

    async function fetchAddress(address, id) {
        const url = `https://api.opencagedata.com/geocode/v1/json?q=${address},%20Việt%20Nam&key=9b9333f371a04490af3b534ff82f2cd0`;
        const response = await axios.get(url);
        if (response.data && response.data.results.length > 0) {
            const location = response.data.results[0].geometry;
            setLocations(prevLocations => ({ ...prevLocations, [id]: location }));
        }
    }

    async function calculateDistance(lat1, lon1, lat2, lon2) {
        const url = `https://router.hereapi.com/v8/routes?transportMode=car&origin=${lat1},${lon1}&destination=${lat2},${lon2}&return=summary&apikey=ZUN6c6-74HyiCfIEU_5DR2CurreNin224_WwgELjbKA`;
        const response = await axios.get(url);

        if (response.data.routes && response.data.routes[0].sections && response.data.routes[0].sections[0].summary) {
            const summary = response.data.routes[0].sections[0].summary;
            return summary.length / 1000; // Return distance in km
        } else {
            console.log("No distance information found in the response.");
            return null;
        }
    }

    useEffect(() => {
        requestPermission();
    }, []);

    useEffect(() => {
        const fetchAllAddresses = async () => {
            for (const item of data) {
                await fetchAddress(item.address, item.id);
            }
        };

        if (currentLocal) {
            fetchAllAddresses();
        }
    }, [currentLocal, data]);

    useEffect(() => {
        const fetchDistances = async () => {
            const updatedDistances = {};

            for (const item of data) {
                const location = locations[item.id];
                if (currentLocal && location) {
                    const calculatedDistance = await calculateDistance(
                        currentLocal.latitude,
                        currentLocal.longitude,
                        location.lat,
                        location.lng
                    );
                    updatedDistances[item.id] = calculatedDistance;
                }
            }
            setDistances(updatedDistances);
        };

        if (currentLocal && Object.keys(locations).length === data.length) {
            fetchDistances();
        }
    }, [currentLocal, locations, data]);

    const openMaps = (latitude, longitude) => {
        if (latitude && longitude) {
            const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
            Linking.openURL(url);
        } else {
            Alert.alert('Error', 'Location not available');
        }
    };

    const renderItem = ({ item }) => {
        const distance = distances[item.id];
        const location = locations[item.id];

        return (
            <TouchableOpacity
                onPress={() => location && openMaps(location.lat, location.lng)}
                style={{
                    flex: 1, flexDirection: 'row', elevation: 5, backgroundColor: 'white',
                    borderRadius: 10, margin: 10, padding: 10
                }}
            >
                <View style={{ flex: 6,marginRight:5 }}>
                    <Text>{item.province}</Text>
                    <Text>Chi tiết: {item.address}</Text>
                    <Text>Khoảng cách: {distance ? `${distance} km` : 'Calculating...'}</Text>
                </View>
                <View style={{ flex: 4,alignItems:'center' }}>
                    <Text>{item?.timeStart}</Text>
                    {
                        item.timeStart?<Icon name="arrow-down" size={16}/>:
                        <Text style={{textAlign:'center'}}>Đến khi chiến dịch kết thúc</Text>
                    }
                    
                    <Text>{item?.timeEnd}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
        />
    );
};

export default RenderAddress;
