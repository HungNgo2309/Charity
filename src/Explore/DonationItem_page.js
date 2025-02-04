import React, { useContext, useEffect, useMemo, useState } from "react";
import { Alert, Button, FlatList, Image, Pressable, View } from "react-native";
import { Dialog, Icon, IconButton, Portal, Text } from "react-native-paper";
import StepIndicator from 'react-native-step-indicator';
import DropDownList from "../Droplist";
import axios from "axios";
import { launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import { AuthenticatedUserContext } from "../Context/UserContext";
import { LoadingContext } from "../Context/LoadingContext";
import { useSelector } from "react-redux";
import LottieView from "lottie-react-native";
import { callApi } from "../Component/fetchData";
import RenderAddress from "../Component/RenderAddress";

const steps = ['Nhập thông tin', 'Minh chứng gửi hàng', 'Xác nhận'];
const DonationItem = ({route}) => {
    const {id}=route.params|| {};
    const { item } = route.params || {};
    //console.log("qua"+JSON.stringify(item.listOther));
    const { userInfo } = useSelector((state) => state.auth);
    //const { loading,setLoading } = useContext(LoadingContext);
    const [charityItems, setCharityItems] = useState(item ? item.listOther : []);
    const [state, setState] = useState(item!=undefined? parseInt(item.status) :0);
    const [Item, setItem] = useState([]);
    const [imgUrl, setImgUrl] = useState(item!=undefined?item.image:null);
    const [visible, setVisible] = useState(false);
     const hideDialog = () => setVisible(false);
    const [warring,setWarring] = useState(false)
    const hideDialogWR = () => setWarring(false);
     const [loading,setLoading]=useState(false);
     const [confirm,setConfirm]=useState(false);
     const df={id:"5dsfhsj",province:"Tỉnh Bình Dương",address:"06 Trần Văn Ơn, Phú Hoà, Thủ Dầu Một"};
     const [eventDelivery,setEventDeliverty]= useState([df]);
     const getVietnamTime = useMemo(() => {
        const now = new Date();
        const vietnamTime = now.toLocaleString("en-US", {
            timeZone: "Asia/Ho_Chi_Minh",
            hour12: true,
        });
    
        const [date, time] = vietnamTime.split(", ");
        let [month, day, year] = date.split("/");
    
        // Ensure month and day are zero-padded
        month = month.padStart(2, "0");
        day = day.padStart(2, "0");
    
        // Remove any whitespace before AM/PM
        const formattedTime = time.replace(/\s+(AM|PM)$/, "$1");
    
        return `${year}-${month}-${day}T${formattedTime}`;
    }, []);
    
    const [showdeli,setShowdeli]= useState(false);
    useEffect(() => {
        const fetchItem = async () => {
            try {
                callApi('GET', `CategoryItem`)
                    .then(data => setItem(data))
                    .catch(error => console.error(error));
                // const url = `http://192.168.186.160:8080/CategoryItem`;
                // const response = await axios.get(url);
                // setItem(response.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchItem();
        const FetchDelivery =async(i)=>
            {
                try {
                    var response = await callApi('GET', `/EventDelivery/${i}`)
                    if (Array.isArray(response)) {
                        setEventDeliverty([...eventDelivery, ...response]);
                    } else {
                        console.error('API không trả về mảng');
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        if(item!=undefined)
        {
           FetchDelivery(item.postID)
           console.log("có item")
           setShowdeli(true);
        }
    }, []);

    const handleAddItem = (item, quantity) => {
        const exist = charityItems.find(it=>it.name==item.name);
        if (exist) {
            setCharityItems(prev =>
                    prev.map(s =>
                        s.name==item.name
                            ? {name:s.name, quantity: parseInt(s.quantity) + parseInt(quantity) }
                            : s
                    )
                );
        }
        else if (quantity > 0) {
            setCharityItems(prevItems => [...prevItems, { name: item.name, quantity }]);
        }
    };

    const handleRemoveItem = (name) => {
        setCharityItems(prevItems => prevItems.filter(item => item.name !== name));
    };

    const pickImage = () => {
        launchImageLibrary(
          {
            mediaType: 'photo',
            includeBase64: true, // Bao gồm Base64 trong kết quả
          },
          (response) => {
            if (response.didCancel) {
              console.log('User cancelled image picker');
            } else if (response.errorCode) {
              console.error('ImagePicker Error: ', response.errorMessage);
            } else if (response.assets && response.assets[0]) {
              const base64String = response.assets[0].base64; // Lấy Base64 từ response
              setImgUrl(base64String); // Lưu Base64 vào state
              console.log('Base64 String:', base64String); // In Base64
            }
          },
        );
      };
      
    const FetchDelivery =async()=>
    {
        try {
            var response = await callApi('GET', `/EventDelivery/${id}`)
            console.log("địa điểm"+response);
            if (Array.isArray(response)) {
                setEventDeliverty([...eventDelivery, ...response]);
            } else {
                console.error('API không trả về mảng');
            }
        } catch (error) {
            console.log(error);
        }
    }
    const uploadImageAndAddService = async () => {
        if(imgUrl==null)
        {
            setWarring(true)
            return
        }
        setLoading(true);
        // const response = await fetch(imgUrl);
        // const blob = await response.blob();
        // const storageRef = storage().ref(new Date().getTime().toString());
        // const uploadTask = storageRef.put(blob);
        // uploadTask.on(
        //     'state_changed',
        //     (snapshot) => {
        //         // Theo dõi tiến trình upload nếu cần
        //     },
        //     (error) => {
        //         console.error('Error uploading image:', error);
        //     },
        //     () => {
        //         uploadTask.snapshot.ref.getDownloadURL().then(async (downloadURL) => {
        //             console.log('File available at', downloadURL);
                    await SendItem(imgUrl);
                    setLoading(false)
                    
                    setShowdeli(true);
                    setConfirm(true);
        //         });
        //     }
        // );
    };
    const FirtStep=()=>{
        return(
            <View>
            <DropDownList items={Item} handleAddItem={handleAddItem} />
            {
                Array.isArray(charityItems) && charityItems.length > 0 ? (
                    charityItems.map((charity, index) => {
                        const foundItem = Item.find(i => i.name.toLowerCase() === charity.name.toLowerCase());
                        return (
                            <View key={index} style={{ marginBottom: 10, flexDirection: 'row' }}>
                                {foundItem && (
                                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', margin: 10 }}>
                                        <Text>{charity.name}: {charity.quantity} {foundItem.unit}</Text>
                                        {id !== undefined && (
                                            <IconButton
                                                icon="delete-circle-outline"
                                                size={30}
                                                onPress={() => handleRemoveItem(charity.name)} // Ensure charity has an id
                                            />
                                        )}
                                    </View>
                                )}
                            </View>
                        );
                    })
                ) : (
                    <Text>No items found</Text>
                )
           }
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
                                            source={{ uri: `data:image/jpeg;base64,${imgUrl}` }}
                                            style={{ width: 300, height: 300,alignItems:'center' }}
                                        />:null
                                }
                                
                            </View>
        )
    }
    const ThirdStep = () => {
        const data = eventDelivery;
        console.log(data);
    
        return (
            <View>
                {showdeli&& Array.isArray(data) && data.length > 0 ? (
                    <RenderAddress data={data}/>
                ) : (
                    <Text>Nhấn xác nhận để hoàn tất</Text>  // Optional message if no data
                )}
                
                <Portal>
                    <Dialog visible={visible} onDismiss={hideDialog}>
                        <Dialog.Title>Thông báo xác nhận hoàn tất</Dialog.Title>
                        <Dialog.Content>
                            <Text variant="bodyMedium">
                                Đã ghi nhận thông tin của bạn. Hệ thống sẽ gửi thông báo cho bạn thời gian và địa điểm nhận/giao hàng
                            </Text>
                        </Dialog.Content>
                    </Dialog>
                </Portal>
                <Portal>
                    <Dialog visible={warring} onDismiss={hideDialogWR}>
                        <Dialog.Title>Lỗi thông tin</Dialog.Title>
                        <Dialog.Content>
                            <Text variant="bodyMedium">Vui lòng cung cấp hình ảnh</Text>
                        </Dialog.Content>
                    </Dialog>
                </Portal>
            </View>
        );
    };
    
    const renderStepContent = () => {
        switch (state) {
            case 0:
                return <FirtStep/>;
            case 1:
                return <SecondStep/>;
            case 2:
                return ThirdStep();
            default:
                return  <FirtStep/>;
        }
    };

    const SendItem =async(image)=>{
        try {
            const listOther = charityItems.map(item => `${item.name},${item.quantity}`).join(";");
           // const url = 'http://192.168.186.160:8080/Charity'; 
            const body = {
                userID: userInfo.email,
                postID: id,
                amountMoney: 0,
                listOther: listOther,
                content: "",
                confirm: true,
                date: getVietnamTime,
                image:image,
                status:"3"
            };
            await callApi('POST', '/Charity',body)
            .then(data =>  {setVisible(true);FetchDelivery();})
            .catch(error => console.error(error));
            //const response = await axios.post(url, body);
            //console.log(response.data);
            
            //setLoading(true); 
          } catch (error) {
            console.log('Thanh toán thất bại' + error);
          }
    }
    if (loading) { // Dừng Lottie khi `check` thành true
        return (
          <View style={{ flex: 1 }}>
            <LottieView
              style={{ width: '100%', height: '100%' }}
              source={require('../../assets/lottie/waiting.json')}
              autoPlay
              loop
            />
          </View>
        );
      }
      console.log(confirm);
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
                (!confirm&&id!=undefined)?(
                    <View style={{flex:1}}>
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
