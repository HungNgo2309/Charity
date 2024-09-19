import axios from "axios";
import React, { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import Icon from 'react-native-vector-icons/FontAwesome6'; // Import Icon từ thư viện // Import style nếu bạn đã tạo styles


const calculateTotalMoney = (data) => {
    return data.reduce((total, item) => total + item.amountMoney, 0);
};
const calculateTotalItems = (items) => {
    return items.reduce((totals, item) => {
      item.listOther.forEach(({ name, quantity }) => {
        totals[name] = (totals[name] || 0) + quantity;
      });
      return totals;
    }, {});
  };
export default function TabViewCustom({timeRemain,navigate,id}) {
    const [selected, setSelected] = useState(0);
    const [totals, setTotals] = useState([]);
    const [charity,setCharity]=useState([]);
    const [usernames, setUsernames] = useState({});
    useEffect(() => {
        const loadCharity = async () => {
            try {
                const url = `http://192.168.23.160:8080/Charity/Find?PostID=${id}`;
                const response = await axios.get(url);
                setCharity(response.data);
                console.log(charity)
                setTotals(calculateTotalItems(charity.filter(s => s.listOther.length > 0)))
                //console.log(totals)
            } catch (error) {
                console.log(error);
            }
        };
        loadCharity();
    }, [id]);
    console.log(charity)
    // Fetch username for each userID in charity data
    useEffect(() => {
        const fetchUsernames = async () => {
            const newUsernames = {};
            for (let item of charity) {
                if (!usernames[item.userID]) {
                    try {
                        const response = await axios.get(`http://192.168.23.160:8080/User/Email/${item.userID}`);
                        newUsernames[item.userID] = response.data.userName;
                    } catch (error) {
                        newUsernames[item.userID] = "Not found";
                    }
                }
            }
            setUsernames(prev => ({ ...prev, ...newUsernames }));
        };
        if (charity.length > 0) {
            fetchUsernames();
        }
    }, [charity]);
    return (
        <View>
         <View style={{elevation:5,backgroundColor:'white',padding:5,margin:10}}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                <Pressable onPress={() => setSelected(0)}>
                    <Text style={{ color: selected === 0 ? '#FFB800' : 'black' }}>Quyên góp tiền</Text>
                    <View style={{height:2,backgroundColor:selected === 0 ? '#FFB800' : 'white'}}></View>
                </Pressable>
                <Pressable onPress={() => setSelected(1)}>
                    <Text style={{ color: selected === 1 ? '#FFB800' : 'black' }}>Quyên góp vật phẩm</Text>
                    <View style={{height:2,backgroundColor:selected === 1 ? '#FFB800' : 'white'}}></View>
                </Pressable>
            </View>
            
            <View>
                {
                    selected===0?(
                    <View>
                    <View style={{ flexDirection: 'row', margin: 10 }}>
                        <Icon color="#512D13" name="clock-rotate-left" size={20} />
                        <View style={{marginLeft:10}}>
                            <Text >Thời gian còn lại</Text>
                            <Text> {timeRemain} ngày</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', margin: 10 }}> 
                        <Icon name="heart-circle-check" size={20} color="#512D13"/>
                        <View style={{marginLeft:10}}>
                            <Text >Số lượt quyên góp</Text>
                            <Text> {charity.filter(s=>s.amountMoney>0).length}</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', margin: 10 }}> 
                        <Icon name="money-bill" size={20} color="#512D13" />
                        <View style={{marginLeft:10}}>
                            <Text >Tổng số tiền</Text>
                            <Text> {calculateTotalMoney(charity).toLocaleString('vi-VN', {style: 'currency',currency: 'VND',})}</Text>
                        </View>
                    </View>
                    <Button mode="contained" style={{ alignSelf: 'center' }} onPress={() => navigate.navigate('Payment',{id:id})} >
                        Donation
                    </Button>
                    </View>
                    ):(
                    <View>
                    <View style={{ flexDirection: 'row', margin: 10 }}>
                    <Icon color="#512D13" name="clock-rotate-left" size={20} />
                    <View style={{marginLeft:10}}>
                        <Text >Thời gian còn lại</Text>
                        <Text> {timeRemain} ngày</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', margin: 10 }}> 
                    <Icon name="heart-circle-check" size={20} color="#512D13"/>
                    <View style={{marginLeft:10}}>
                        <Text >Số lượt quyên góp</Text>
                        <Text> {charity.filter(s => s.listOther.length > 0).length}</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', margin: 10 }}> 
                    <Icon name="shirt" size={20} color="#512D13" />
                    <View style={{marginLeft:10}}>
                        <Text >Tổng số vật phẩm</Text>
                        {Object.entries(totals).map(([itemName, totalQuantity], index) => (
                          <Text style={{}} key={index}>
                            Tổng số lượng {itemName}: {totalQuantity} 
                          </Text>
                        ))}
                    </View>
                </View>
                <Button onPress={()=>navigate.navigate("DonateItem",{id:id})} mode="contained" style={{ alignSelf: 'center' }}>
                    Donation
                </Button>
                </View>)
                }
                
            </View>
           </View>
            <Pressable onPress={()=>navigate.navigate("DetailDonation",{select:selected,data:selected === 0?charity.filter(s=>s.amountMoney>0):charity.filter(s => s.listOther.length > 0),
                usernames:usernames
            })} >
                <Text>Xem chi tiết</Text>
            </Pressable>
            {selected === 0?
                charity.filter(s=>s.amountMoney>0).map((item, index) => (
                    <View key={index} style={styles.item}>
                        <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                            <Text style={styles.name}>{item.confirm===false?usernames[item.userID] || 'Loading...':"Ẩn danh"}</Text>
                            <Text style={styles.money}>Raised: ${item.amountMoney.toLocaleString()} VNĐ</Text>
                        </View>
                        <Text>{item.date}</Text>   
                        <Text>Nội dung : {item.content}</Text>
                    </View>
                ))
                :
                charity.filter(s => s.listOther.length > 0).map((item, index) => (
                    <View key={index} style={styles.item}>
                        <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                        <Text style={styles.name}>{usernames[item.userID] || 'Loading...'}</Text>
                        <Text>{item.date}</Text>
                        </View>
                        {
                            item.listOther.map((otherItem, idx) => (
                                <Text style={styles.money} key={idx}>
                                    {`${otherItem.name}: ${otherItem.quantity}`}
                                </Text>
                            ))
                        }
                    </View>
                ))
                
            }
        </View>
    );
}
const styles = StyleSheet.create({
    item: {
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
    },
    name: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    money: {
      fontSize: 16,
      color: 'green',
    },
  });