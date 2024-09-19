import React, { useEffect, useState } from "react";
import { Image, View } from "react-native";
import { Divider, Text } from "react-native-paper";
import TabViewDetail from "./TabView_Detail";


const calculateTotalItems = (items) => {
  return items.reduce((totals, item) => {
    item.listOther.forEach(({ name, quantity }) => {
      totals[name] = (totals[name] || 0) + quantity;
    });
    return totals;
  }, {});
};

  const calculateTotalMoney = (data) => {
    return data.reduce((total, item) => total + item.amountMoney, 0);
};
const DetailDonation = ({route}) => {
    const {select,data,usernames}=route.params;
    const[money,setMoney]=useState(select!==undefined&&select===0?true:false);
    const [totals, setTotals] = useState({});
    const [charityData,setCharityData]=useState(data);
    const [totalmoney, setTotalsmoney] = useState(0);
    useEffect(() => {
      const totalItems = calculateTotalItems(charityData);
      setTotals(totalItems);
      const totalMoney = calculateTotalMoney(charityData);
      setTotalsmoney(totalMoney);
    }, [money]);
    return (
        <View style={{ flex: 1}}>
            <Text>Chi tiết sao kê</Text>
            <View style={{ flex: 3,backgroundColor:'#FFB800',padding:10 }}>
                <View style={{ margin: 10, backgroundColor: '#512D13', borderRadius: 10, padding: 20 }}>
                    <Text style={{ marginBottom: 10,color:'white',textAlign:'center' }}>Cập nhật lần cuối vào ngày {charityData[charityData.length - 1].date}</Text>
                    {
                        money?<View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <Text style={{color:'white'}}>Tổng thu</Text>
                            <Text style={{ marginTop: 5 ,color:'white'}}><Text style={{color:'green'}}>+ </Text>{totalmoney}</Text>
                        </View>
                        {/* Divider between Tổng thu and Tổng chi */}
                        <Divider style={{ height: '100%', width: 1, backgroundColor: '#FFFFFF', marginHorizontal: 10 }} />
                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <Text style={{color:'white'}}>Tổng chi</Text>
                            <Text style={{ marginTop: 5,color:'white' }}>- 120.000.000</Text>
                        </View>
                    </View>:
                        <View>
                        {Object.entries(totals).map(([itemName, totalQuantity], index) => (
                          <Text style={{color:'white',textAlign:'center'}} key={index}>
                            Tổng số lượng {itemName}: {totalQuantity}
                          </Text>
                        ))}
                      </View>
                    }
                    
                    <View style={{flexDirection:'row',alignItems:'center',justifyContent:'flex-start'}}>
                    <Image
                            source={require('../assets/img/quanao.jpg')}
                            style={{
                                height:70,
                                width:100,
                                borderRadius:15,margin:10,
                            }}
                        />
                        <Text style={{color:'white'}}>Chiến dịch ABC</Text>
                    </View>
                </View>
            </View>
            <View style={{ flex: 7 }}>
                <Text>Danh sách giao dịch</Text>
                <TabViewDetail money={money}  charityData={charityData} usernames={usernames}/>
            </View>
        </View>
    )
}

export default DetailDonation;
