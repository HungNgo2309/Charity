import axios from "axios";
import React, { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import Icon from 'react-native-vector-icons/FontAwesome6'; // Import Icon từ thư viện // Import style nếu bạn đã tạo styles
import { callApi } from "./Component/fetchData";


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
export default function TabViewCustom({timeRemain,navigate,id,post}) {
    const [selected, setSelected] = useState(0);
    const [totals, setTotals] = useState([]);
    const [charity,setCharity]=useState([]);
    const [usernames, setUsernames] = useState({});
    const [isresult,setIsresult]= useState(false);
    const [dataRS,setDataRS]=useState({});
    useEffect(() => {
        const loadCharity = async () => {
            try {
                await callApi('GET', '/Charity/Find',{PostID:id})
                .then(data => setCharity(data))
                .catch(error => console.error(error));
                setTotals(calculateTotalItems(charity.filter(s => s.listOther.length > 0)))
                //console.log(totals)
                console.log(charity)
            } catch (error) {
                console.log(error);
            }
        };
        const HandleShowResult=async()=>{
            try {
                callApi('GET', `/Result/${id}`)
                .then(data =>{
                    if(Array.isArray(data) && data.length > 0){
                        setIsresult(true)
                        setDataRS(data)
                        console.log("là mảng");
                    }else setIsresult(false)
                }
                )
                .catch(error => console.error(error));
                // const url = `http://192.168.186.160:8080/Result/${id}`;
                // const response = await axios.get(url);
                // if(response.data){
                //     setIsresult(true)
                //     setDataRS(response.data)
                // }else setIsresult(false)
            } catch (error) {
                setIsresult(false)
            }
        }
        loadCharity();
        HandleShowResult();
    }, [id]);
    //console.log(dataRS);
    // Fetch username for each userID in charity data
    useEffect(() => {
        const fetchUsernames = async () => {
            const newUsernames = {};
    
            const fetchPromises = charity.map(async (item) => {
                if (!usernames[item.userID]) {
                    try {
                        const data = await callApi('GET', `/User/Email/${item.userID}`);
                        newUsernames[item.userID] = data.userName;
                        console.log("gigi " + newUsernames[item.userID]);
                    } catch (error) {
                        console.log(`Error fetching userID ${item.userID}:`, error);
                        newUsernames[item.userID] = "Not found";
                    }
                }
            });
    
            await Promise.all(fetchPromises);  // Wait for all fetch calls to complete
            setUsernames(prev => ({ ...prev, ...newUsernames }));
            console.log("uc", JSON.stringify({ ...usernames, ...newUsernames }));
        };
    
        if (charity.length > 0) {
            fetchUsernames();
        }
    }, [charity]);  // Add usernames as a dependency to avoid stale state
    
    
    return (
        <View>
         <View style={{backgroundColor:'white',padding:5,borderRadius:20}}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                <Pressable onPress={() => setSelected(0)}>
                    <Text style={{  fontWeight:'500',fontSize:16,color:'black' }}>Quyên góp tiền</Text>
                    <View style={{height:2,width:'50%',alignSelf:'center',marginTop:10,backgroundColor:selected === 0 ? '#0a46ad' : 'white'}}></View>
                </Pressable>
                <Pressable onPress={() => setSelected(1)}>
                    <Text style={{ fontWeight:'500',fontSize:16,color:'black' }}>Quyên góp vật phẩm</Text>
                    <View style={{height:2,width:'50%',alignSelf:'center',marginTop:10,backgroundColor:selected === 1 ? '#0a46ad' : 'white'}}></View>
                </Pressable>
            </View>
            
            <View>
                {
                    selected===0?(
                    <View>
                    <View style={{ flexDirection: 'row', margin: 10 }}>
                        <Icon color="#0a46ad" name="clock-rotate-left" size={20} />
                        <View style={{marginLeft:10}}>
                            <Text >Thời gian còn lại</Text>
                            <Text> {timeRemain>0?timeRemain+' ngày':'Hết thời hạn quyên góp'}</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', margin: 10 }}> 
                        <Icon name="heart-circle-check" size={20} color="red"/>
                        <View style={{marginLeft:10}}>
                            <Text >Số lượt quyên góp</Text>
                            <Text> {charity?.filter(s=>s.amountMoney>0)?.length}</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', margin: 10 }}> 
                        <Icon name="money-bill" size={20} color="green" />
                        <View style={{marginLeft:10}}>
                            <Text >Tổng số tiền</Text>
                            <Text> {calculateTotalMoney(charity).toLocaleString('vi-VN', {style: 'currency',currency: 'VND',})}</Text>
                        </View>
                    </View>
                    {
                        isresult?(
                            <Button mode="contained" style={{ alignSelf: 'center' }} onPress={() => navigate.navigate('Result',{item:dataRS})} >
                                Xem kết quả
                            </Button>
                        ):(
                            <Button mode="outlined" style={{ alignSelf: 'center' }} onPress={() => navigate.navigate('Payment',{id:id})} >
                                Quyên góp
                            </Button>
                        )
                    }
                    
                    </View>
                    ):(
                    <View>
                    <View style={{ flexDirection: 'row', margin: 10 }}>
                    <Icon color="#0a46ad" name="clock-rotate-left" size={20} />
                    <View style={{marginLeft:10}}>
                        <Text >Thời gian còn lại</Text>
                        <Text> {timeRemain>0?timeRemain+' ngày':'Hết thời hạn quyên góp'}</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', margin: 10 }}> 
                    <Icon name="heart-circle-check" size={20} color="red"/>
                    <View style={{marginLeft:10}}>
                        <Text >Số lượt quyên góp</Text>
                        <Text> {charity.filter(s => s.listOther.length > 0 && s.status=="4").length}</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', margin: 10 }}> 
                    <Icon name="shirt" size={20} color="green" />
                    <View style={{marginLeft:10}}>
                        {Object.entries(calculateTotalItems(charity.filter(s => s.listOther.length > 0&& s.status=="4"))).map(([itemName, totalQuantity], index) => (
                          <Text style={{}} key={index}>
                            Tổng số lượng {itemName}: {totalQuantity} 
                          </Text>
                        ))}
                    </View>
                </View>
                {
                        isresult?(
                            <Button mode="contained" style={{ alignSelf: 'center' }} onPress={() => navigate.navigate('Result',{item:dataRS})} >
                                Xem kết quả
                            </Button>
                        ):
                <Button   onPress={()=>navigate.navigate("DonateItem",{id:id})} mode="outlined" style={{ alignSelf: 'center' }}>
                    Quyên góp
                </Button>
                    }
                </View>)
                }
            </View>
           </View>
            <Pressable style={{backgroundColor:'#f9faf0',padding:10}} onPress={()=>navigate.navigate("DetailDonation",{select:selected,data:selected === 0?charity.filter(s=>s.amountMoney>0):charity.filter(s => s.listOther.length > 0 && s.status=="4"),
                usernames:usernames,post:post,isresult:isresult
            })} >
                <Text style={{textAlign:'center',color:'#0a46ad'}}>Xem chi tiết</Text>
            </Pressable>
            <View style={{backgroundColor:'white'}}>
            {selected === 0?
                charity?.filter(s=>s.amountMoney>0).map((item, index) => (
                    <View key={index} style={styles.item}>
                        <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                            <Text style={styles.name}>{item.confirm?"Ẩn danh":usernames[item.userID] || 'Loading...'}</Text>
                            <Text style={styles.money}>{item.amountMoney.toLocaleString()} VNĐ</Text>
                        </View>
                    </View>
                ))
                :
                charity?.filter(s => s.listOther.length > 0 && s.status=="4").map((item, index) => (
                    <View key={index} style={styles.item}>
                        <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                        <Text style={styles.name}>{usernames[item.userID] || 'Loading...'}</Text>
                        
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
      flex:2
    },
    money: {
      fontSize: 16,
      color: 'green',
      flex:1
    },
  });