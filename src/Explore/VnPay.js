import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";
import WebView from "react-native-webview";
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
    const {money, content, id, anonymus, username} = route.params;
    const [url, setUrl] = useState("");

    const getVietnamTime = useMemo(() => {
      const now = new Date();
      return now.toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" });
  }, []);

    useEffect(() => {
        const LoadUrl = async () => {
            try {
                const urL = `http://192.168.23.160:8080/submitOrder?amount=${money}&orderInfo=${content}`;
                const response = await axios.post(urL);
                setUrl(response.data); // Set the URL here
                console.log(urL);
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
        // Kiểm tra nếu URL là kết quả trả về của VNPAY
        if (url.includes('/vnpay-payment-return')) {
          if (url.includes("vnp_ResponseCode=00")) {
            Alert.alert('Thanh toán thành công');
            try {
              const url = 'http://192.168.23.160:8080/Charity'; 
              const body = {
                  userID: username,
                  postID: id,
                  amountMoney: money,
                  listOther: "",
                  content: content,
                  confirm: anonymus,
                  date: getVietnamTime,
                  image:'',
                  status:"4"
              };
              const response = await axios.post(url, body);
              navigation.navigate("ThankYou",{data:body,code :transactionId})
              console.log(response.data); 
            } catch (error) {
              console.log('Thanh toán thất bại' + error);
            }
          } else {
            console.log('Thanh toán thất bại');
          }
        }
    };

    return (
        url ? (
            <WebView
                key={url} // Add key to force re-render when URL changes
                source={{ uri: url }}
                style={{ flex: 1 }}
                onNavigationStateChange={handleNavigationChange}
            />
        ) : null // Render nothing until the URL is set
    );
};

export default VNPAY;
