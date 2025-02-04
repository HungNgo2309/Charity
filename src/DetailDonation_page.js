import React, { useEffect, useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { Divider, Searchbar, Text, TextInput } from "react-native-paper";
import TabViewDetail from "./TabView_Detail";
import axios from "axios";
import { callApi } from "./Component/fetchData";
import useDebounce from "./hook/UseDebounce";


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
const calculateTotalMoneyDispote = (data) => {
  if(data[0]?.result!=undefined)
  {
    return data[0]?.result.reduce((total, item) => total + item.money, 0);
  }
  return 0;
};

const DetailDonation = ({route}) => {
    const {select,data,usernames,post,isresult}=route.params;
    const[money,setMoney]=useState(select!==undefined&&select===0?true:false);
    const [totals, setTotals] = useState({});
    const [charityData,setCharityData]=useState(data);
    const [totalmoney, setTotalsmoney] = useState(0);
    const [dataResult,setDataResult]=useState([]);
    const [searchTerm,setSearchTerm]=useState('');
    const search = useDebounce(searchTerm, 1000);
    const [datas,setDatas]=useState([]);
    const [image,setImage]=useState('');
    const [visible, setVisible] = useState(false);
    const hideDialog = () => setVisible(false);
    const Zoom =(image)=>{
        console.log("not found"+image);
        setImage(image);
        setVisible(true);
    }
    useEffect(() => {
      if(data!=undefined)
      {
        const totalItems = calculateTotalItems(charityData);
        setTotals(totalItems);
        const totalMoney = calculateTotalMoney(charityData);
        setTotalsmoney(totalMoney);
      }
    }, [money]);
    useEffect(()=>{
      const HandleShowResult=async()=>{
        try {
          if(isresult)
          {
            try {
              const response=await callApi('GET', `/Result/${post.id}`);
              setDataResult(response);
              //console.log(dataResult);
          } catch (error) {
              console.log("empty")
          }
          }
        } catch (error) {
          console.log("erros");
        }
    }
    HandleShowResult();
    },[])
    console.log("data lớn"+data)
    useEffect(() => {
      // Kiểm tra từ khóa tìm kiếm
      if (search.trim() === "") {
        setDatas(data); // Hiển thị tất cả dữ liệu nếu không có từ khóa
      } else {
        const filteredData = data.filter((s) => {
          const username = usernames[s.userID]?.toLowerCase() || ""; // Lấy username từ userID (nếu có)
          return (
            s.content.toLowerCase().includes(search.trim().toLowerCase()) || // Tìm kiếm trong content
            s.userID.toLowerCase().includes(search.trim().toLowerCase()) || // Tìm kiếm trong userID
            username.includes(search.trim().toLowerCase())                  // Tìm kiếm trong username
          );
        });
    
        setDatas(filteredData);
      }
    }, [search, data, usernames]);
    
    
    return (
        <View style={{ flex: 1,backgroundColor:'white',position:'relative'}}>
          <View  style={{backgroundColor:'#153b82'}}>
            <Text style={{textAlign:'center',fontSize:18,color:'white'}}>Chi tiết sao kê</Text>
            <View style={{flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                    <Text style={{color:'white'}}>{post.title}</Text>
                    <Image
                            source={{uri:post.image[0]}}
                            style={{
                                height:170,
                                width:300,
                                borderRadius:15,margin:10,
                            }}
                        />
                        
                    </View>
                    </View>
            <View style={{ flex: 3,padding:10,backgroundColor:'#153b82'}}>
                <View style={{ margin: 10, borderRadius: 10, padding: 10 }}>
                    <Text style={{ marginBottom: 10,color:'white',textAlign:'center' }}>Cập nhật lần cuối vào ngày {charityData[charityData.length - 1]?.date}</Text>
                    {
                        money?<View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <Text style={{color:'white'}}>Tổng thu</Text>
                            <Text style={{ marginTop: 5 ,color:'white'}}><Text style={{color:'green'}}>+ </Text>{totalmoney.toLocaleString()} VNĐ</Text>
                        </View>
                        {/* Divider between Tổng thu and Tổng chi */}
                        <Divider style={{ height: '100%', width: 1, backgroundColor: '#FFFFFF', marginHorizontal: 10 }} />
                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <Text style={{color:'white'}}>Tổng chi</Text>
                            <Text style={{ marginTop: 5,color:'white' }}> <Text style={{color:'red'}}>-</Text>{isresult? calculateTotalMoneyDispote(dataResult).toLocaleString():0} VNĐ</Text>
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
                    
                    
                </View>
            </View>
            
            <View style={{ flex: 7 }}>
                <TextInput  value={searchTerm} onChangeText={setSearchTerm} placeholder="Nhập từ khóa tìm kiếm" 
                style={{backgroundColor:'white',marginHorizontal:10}} />
                <TabViewDetail postID={post.id} money={money} isresult={isresult} dataResult={dataResult}  charityData={searchTerm!=''?datas:charityData} usernames={usernames}
                Zoom={Zoom} />
            </View>
            {image&&visible?<TouchableOpacity onPress={()=>hideDialog()} style={{position:'absolute',alignItems:'center',justifyContent:'center',backgroundColor: 'rgba(0, 0, 0, 0.5)'
                        ,bottom:0,right:0,top:0,left:0}}>
                    <Image source={{uri:image}} style={{width:'100%',height:'100%'}} resizeMode="contain"/>
            </TouchableOpacity>:null}
        </View>
    )
}

export default DetailDonation;
