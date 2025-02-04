import axios from "axios";
import React, { useEffect, useState } from "react";
import { FlatList, Image, TouchableOpacity, View } from "react-native";
import { Divider, Text } from "react-native-paper";
import { useSelector } from "react-redux";
import { callApi } from "../Component/fetchData";

const HistoryExchange=()=>{
    const [gift,setGift]=useState([]);
    const [data,setData]=useState([])
    const { userInfo } = useSelector((state) => state.auth);
    const [hide,setHide]=useState(false);
    const [selected,setSelected]=useState();
    const [info,setInfo]=useState();
    useEffect(()=>{
        const FetchGift=async()=>{
            try {
                const response =  await callApi('GET', '/Gift');
                setGift(response);
            } catch (error) {
                console.error(error)
            }
        }
        const FetchData=async()=>{
            try {
                const response = await callApi('GET', `/ExchangeGift/FindByUserID/${userInfo.id}`);
                setData(response);
            } catch (error) {
                console.error(error)
            }
        }
        FetchGift();
        FetchData();
    },[])
    console.log(data);
    function parstTime(time)
    {
        const date = new Date(parseInt(time)* 1000);
        return date.toLocaleString()
    }
    
    const renderList=(item)=>{  
        let fetch = [];
        item.gift.map((items) => {
            const it = gift.find((s) => s.id == items.itemID);
            if (it) {
                // Hợp nhất 'it' và 'items' thành một đối tượng duy nhất
                fetch.push({
                    ...it,  // Spread các thuộc tính của 'it'
                    ...items // Spread các thuộc tính của 'items'
                });
            }
        });
        console.log(item.time)
        return(
            <View>
            <TouchableOpacity onPress={()=>{setHide(true);setSelected(fetch);setInfo(item)}}>
                <Text>Vào lúc {parstTime(item.time)}</Text>
                {fetch.length > 0 ? (
                    fetch.map((itm, index) => (
                        <View style={{flexDirection:'row',flex:1,alignItems:'center'}} key={index}>
                            <Text style={{flex:2}}>{itm.name}</Text>
                            <Image style={{flex:2}} source={{uri:itm.image}} height={100} width={100}/>
                            <Text style={{flex:2}}>Số lượng {itm.quantity}</Text>
                            
                            <Text style={{ flex: 2, color: item.state === 0||item.state === 1 ? 'red' : 'green' }}>
                            Trạng thái: {item.state === 0
                                ? "Chờ duyệt"
                                : item.state === 1
                                ? "Chờ giao hàng"
                                : "Đã giao hàng"}
                            </Text>

                        </View>
                ))
                ) : (
                <Text>No matching gifts found</Text>
                )}
            </TouchableOpacity>
            <Divider/>
            </View>
        )
    }
    return(
        <View style={{flex:1,position:"relative",backgroundColor:'white'}}>
            <FlatList
                data={data}
                keyExtractor={(item) => item.id}
                renderItem={(item)=>renderList(item.item)}
            />
             {
                hide ?
                    <TouchableOpacity onPress={() => setHide(false)} style={{ flex: 1, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' 
                        
                    }}>
                        <View style={{ height: 400, width: 300, backgroundColor: "white", justifyContent: 'center',borderRadius:15
                            ,padding:10
                        }}>
                            <Text style={{textAlign:'center'}}>Thông báo</Text>
                            {selected.length > 0 && selected.map((item, index) => (
                                <View style={{ flexDirection: 'row', flex: 1,alignItems:'center',justifyContent:'space-around' }} key={index}>
                                    <Text style={{ flex: 2 }}>{item.name}</Text>
                                    <Image style={{ flex: 2 }} source={{ uri: item.image }} height={100} width={100} />
                                    <Text style={{ flex: 2 }}>Số lượng {item.quantity}</Text>
                                </View>
                            ))}
                            <View style={{alignItems:'flex-start'}}>
                            <Text>Trạng thái {info.state==0?"Chưa giao hàng":"Đã giao thành công"}</Text>
                            <Text>Người nhận: {info.consignee}</Text>
                            <Text>Số điện thoại: {info.phone}</Text>
                            <Text>Địa chỉ nhận hàng :{info.address}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                : null
            }
        </View>
    );
}
export default HistoryExchange;