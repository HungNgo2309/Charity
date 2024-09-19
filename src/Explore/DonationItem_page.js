import React, { useContext, useEffect, useMemo, useState } from "react";
import { Alert, Image, Pressable, View } from "react-native";
import { Icon, IconButton, Text } from "react-native-paper";
import StepIndicator from 'react-native-step-indicator';
import DropDownList from "../Droplist";
import axios from "axios";
import { launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import { AuthenticatedUserContext } from "../Context/UserContext";

const steps = ['Nhập thông tin', 'Minh chứng gửi hàng', 'Xác nhận'];
const DonationItem = ({route}) => {
    const {id}=route.params|| {};
    const { item } = route.params || {};
    //console.log(id);
    const { user, setUser } = useContext(AuthenticatedUserContext);
    const [charityItems, setCharityItems] = useState(item!=undefined?item.listOther:[]);
    const [state, setState] = useState(item!=undefined? parseInt(item.status) :0);
    const [Item, setItem] = useState([]);
    const [imgUrl, setImgUrl] = useState(item!=undefined?item.image:null);
    const getVietnamTime = useMemo(() => {
        const now = new Date();
        return now.toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" });
    }, []);
    useEffect(() => {
        const fetchItem = async () => {
            try {
                const url = `http://192.168.23.160:8080/CategoryItem`;
                const response = await axios.get(url);
                setItem(response.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchItem();
    }, []);

    const handleAddItem = (item, quantity) => {
        if (quantity > 0) {
            setCharityItems(prevItems => [...prevItems, { name: item.name, quantity }]);
        }
    };

    const handleRemoveItem = (id) => {
        setCharityItems(prevItems => prevItems.filter(item => item.id !== id));
    };

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

    const uploadImageAndAddService = async () => {
        const response = await fetch(imgUrl);
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
    const FirtStep=()=>{
        console.log(Item)
        return(
            <View>
                                <DropDownList items={Item} handleAddItem={handleAddItem} />
                                {charityItems.map((charity, index) => {
                                    const foundItem = Item.find(i => i.name === charity.name);
                                    return (
                                        <View key={index} style={{ marginBottom: 10, flexDirection: 'row' }}>
                                            {foundItem && (
                                                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', margin: 10 }}>
                                                    <Text>{charity.name}: {charity.quantity} {foundItem.unit}</Text>
                                                    {
                                                        id!=undefined?( <IconButton
                                                        icon="delete-circle-outline"
                                                        size={30}
                                                        onPress={() => handleRemoveItem(charity.id)}
                                                    />
                                                        ):null}
                                                </View>
                                            )}
                                        </View>
                                    );
                                })}
                            </View>
        )
    }
    const SecondStep=()=>{
        return(
            <View>
                                <Text style={{textAlign:'center'}}>Tải ảnh minh chứng gói hàng</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text>Tải lên hình ảnh minh chứng <Text style={{ color: 'red' }}>(*)</Text></Text>
                                    {
                                        id!=undefined?(
                                            <Pressable onPress={pickImage}>
                                                <Icon size={30} source="camera" />
                                            </Pressable>
                                        ):null
                                    }
                                    
                                </View>
                                {
                                    imgUrl?
                                    <Image
                                            key={imgUrl}
                                            source={{ uri: imgUrl }}
                                            style={{ width: 300, height: 300 }}
                                        />:null
                                }
                                
                            </View>
        )
    }
    const ThirdStep=()=>{
        console.log(charityItems)
        return(
            <View>
                <Text>Chờ đợi là hạnh phúc</Text>
            </View>
        )
    }
    const renderStepContent = () => {
        switch (state) {
            case 0:
                return <FirtStep/>;
            case 1:
                return <SecondStep/>;
            case 2:
                return ThirdStep();
            default:
                return FirtStep();
        }
    };

    const SendItem =async(image)=>{
        try {
            const listOther = charityItems.map(item => `${item.name},${item.quantity}`).join(";");
            const url = 'http://192.168.23.160:8080/Charity'; 
            const body = {
                userID: user.email,
                postID: id,
                amountMoney: 0,
                listOther: listOther,
                content: "",
                confirm: true,
                date: getVietnamTime,
                image:image,
                status:"3"
            };
    
            const response = await axios.post(url, body);
            console.log(response.data); 
          } catch (error) {
            Alert.alert('Thanh toán thất bại' + error);
          }
    }
    return (
        <View style={{flex:1}}>
            <StepIndicator
                customStyles={indicatorStyles}
                currentPosition={state}
                stepCount={steps.length}
                labels={steps}
                onPress={setState}
            />
            {renderStepContent()}
            {
                id!=undefined?(
                    <View>
                        <Pressable style={{position:'absolute',bottom:0,backgroundColor:"#FFB800",padding:10,width:'100%',
                            borderRadius:15,alignItems:'center',marginRight:10
                        }} onPress={() => state===2?uploadImageAndAddService() :setState(state + 1)}>
                            <Text>{state===2?"Xác nhận":"Next"}</Text>
                        </Pressable>
                    </View>
                ):null
            }
            
        </View>
    );
};

const indicatorStyles = {
    stepIndicatorSize: 30,
    currentStepIndicatorSize: 40,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: '#ffffff',
    stepStrokeWidth: 3,
    stepStrokeFinishedColor: '#00bfff',
    stepStrokeUnFinishedColor: '#aaaaaa',
    separatorFinishedColor: '#00bfff',
    separatorUnFinishedColor: '#aaaaaa',
    stepIndicatorFinishedColor: '#00bfff',
    stepIndicatorUnFinishedColor: '#ffffff',
    stepIndicatorCurrentColor: '#00bfff',
    stepIndicatorLabelFontSize: 15,
    currentStepIndicatorLabelFontSize: 20,
    stepIndicatorLabelCurrentColor: '#ffffff',
    stepIndicatorLabelFinishedColor: '#ffffff',
    stepIndicatorLabelUnFinishedColor: '#aaaaaa',
};

export default DonationItem;
