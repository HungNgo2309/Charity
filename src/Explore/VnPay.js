import axios from "axios";
import LottieView from "lottie-react-native";
import React, { useEffect, useMemo, useState } from "react";
import { Alert, View } from "react-native";
import WebView from "react-native-webview";
import { useSelector } from "react-redux";
import { callApi } from "../Component/fetchData";
import { LoadingIndicator } from "../Component/LoadingIndicator";
const getQueryParams = (url) => {
  return url
      .slice(url.indexOf('?') + 1) // Get the part after "?"
      .split('&') // Split into key-value pairs
      .reduce((params, param) => {
          const [key, value] = param.split('='); // Split each pair
          params[key] = decodeURIComponent(value); // Decode and store in object
          return params;
      }, {});
};
const VNPAY =({route,navigation})=> {
    const { userInfo } = useSelector((state) => state.auth);
    const {money, content, id, anonymus} = route.params;
    const [url, setUrl] = useState("");
    const [loading,setLoading]=useState(false);
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
  

    useEffect(() => {
        const LoadUrl = async () => {
            try {
              await callApi('GET', '/submitOrder',{amount:money,orderInfo:content })
              .then(data => setUrl(data))
              .catch(error => console.error(error));
            } catch (error) {
                console.log(error);
            }
        };
        LoadUrl();
    }, [money, content]); // Add dependencies for money and content to prevent unnecessary rerenders

    const handleNavigationChange = async (navState) => {
        
        const { url } = navState;
        const params = getQueryParams(url);
        const responseCode = params.vnp_ResponseCode;
        const transactionId = params.vnp_TransactionNo;
        const amountMoney = params.vnp_Amount;
        // Kiểm tra nếu URL là kết quả trả về của VNPAY
        if (url.includes('/vnpay-payment-return')) {
          setLoading(true);
          if (url.includes("vnp_ResponseCode=00")) {
            try {
              
              //const url = 'http://192.168.186.160:8080/Charity'; 
              const body = {
                  userID: userInfo.email,
                  postID: id,
                  amountMoney: money,
                  listOther: "",
                  content: content,
                  confirm: anonymus,
                  date: getVietnamTime,
                  image:'',
                  status:"4"
              };
              callApi('POST', '/Charity',body)
              .then(data =>  setLoading(false))
              .catch(error => console.error(error));

              //const response = await axios.post(url, body);
              navigation.navigate("ThankYou",{data:body,code :transactionId})
              //console.log(response.data); 
            } catch (error) {
              setLoading(false);
              console.log('Thanh toán thất bại' + error);
            }
          } else {
            console.log('Thanh toán thất bại');
            setLoading(false);
          }
        }
    };
    if (loading) {
      return <View style={{flex:1}}>
          <LottieView style={{width:'100%',height:'100%'}} source={require('../../assets/lottie/donate.json')} autoPlay loop />
      </View>;
    }
    return (
        url ? (
            <WebView
                key={url} // Add key to force re-render when URL changes
                source={{ uri: url }}
                style={{ flex: 1 }}
                onNavigationStateChange={handleNavigationChange}
            />
        ) : <View style={{position:'absolute',alignItems:'center',justifyContent:'center',backgroundColor: 'rgba(0, 0, 0, 0.5)'
          ,bottom:0,right:0,top:0,left:0}}>
              <LoadingIndicator/>
          </View> 
    );
};

export default VNPAY;
