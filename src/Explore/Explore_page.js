import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, Image, ImageBackground, TouchableOpacity, useWindowDimensions, View, VirtualizedList } from "react-native";
import { Appbar, Button, IconButton, Searchbar, Text, TextInput } from "react-native-paper";
import Icon from 'react-native-vector-icons/FontAwesome6';
import useDebounce from "../hook/UseDebounce";
import { callApi } from "../Component/fetchData";

const ExplorePage=({route,navigation})=>{
    const { select } = route.params || {};
    const [catedd,setCatedd]=useState([{id:"",name:"Tất cả"}]);
    const [data,setData] = useState([]);
    const [cate,setCate]=useState([]);
    const [searchTerm, setSearchTerm] = useState('');  // Giá trị từ input
    const search = useDebounce(searchTerm, 1000);
    const [money,setMoney]=useState([])
    // Đặt giá trị cho selected với giá trị select nếu có, nếu không thì là ""
    const [selected, setSelected] = useState(select!=undefined ?select: "");
    
    useEffect(() => {
        callApi('GET', '/Post')
        .then(data => setData(data))
        const LoadCate = async () => {
          try {
            callApi('GET', '/Category')
                    .then(data => setCate([...catedd, ...data]))
                    .catch(error => console.error(error));
          } catch (error) {
              console.log(error);
          }
          };
          const LoadMoney = async () => {
            try {
                callApi('GET', '/Charity/Report')
                    .then(data => setMoney(data))
            } catch (error) {
                console.log(error);
            }
        };
          LoadCate();
          LoadMoney();
        }, []);

    useEffect(() => {
        const LoadData = async () => {
          try {
          if (selected === undefined||selected ==="") 
              {
                  callApi('GET', '/Post')
                  .then(data => setData(data))
                  // const url = `http://192.168.186.160:8080/Post`;
                  // const response = await axios.get(url);
                  // setData(response.data);
                  // console.log('else')
              } // Không thực hiện khi selected rỗng
          else{
              callApi('GET', `/Postted/${selected}`)
                  .then(data => setData(data))
          //   const url = `http://192.168.186.160:8080/Postted/${selected}`;
          //   const response = await axios.get(url);
          //   setData(response.data);
          //   console.log(selected);
          }
          } catch (error) {
            console.log('Error fetching data:', error); // Sử dụng console.error để dễ nhận diện lỗi
          }
        };
        
        LoadData();
      }, [selected]);
      
      // Danh sách phụ thuộc
      useEffect(()=>{
          setSelected(select);
      },[select])
      //console.log(data.length);
    
    useEffect(() => {
        const LoadCate = async () => {
            if (search !== "") {  // Chỉ gọi API khi search không rỗng
                try {
                    callApi('GET', '/Post/Search', { text: search })
                    .then(data => setData(data))
                    // const url = `http://192.168.186.160:8080/Post/Search?text=${search}`;
                    // const response = await axios.get(url);
                    // setData(response.data);  // In ra dữ liệu phản hồi
                } catch (error) {
                    console.log(error);
                }
            }
        };
        LoadCate();  
    }, [search]);  
    
    
    const getItem = (data, index) => data[index];
    const getItemCount = (data) => data?.length;
    const RenderCate =({item})=>{
        return (
            <Button onPress={()=>setSelected(item.id)} style={{height:'100%',marginHorizontal:10,marginVertical:5}}>
                <Text style={{color:item.id==selected?'#FFB800':'black',}}>
                {item.name}
                </Text>
            </Button>
        )
    }
    const calculateDaysFromNow = (endDate, startDate = null) => {
      const start = startDate ? new Date(startDate) : new Date();
      const end = new Date(endDate);  
      const differenceInTime = end.getTime() - start.getTime();
      const differenceInDays = differenceInTime / (1000 * 3600 * 24);
      return Math.ceil(differenceInDays);
  };
  const RenderItem = ({ item,money }) => {
    const daysRemaining = calculateDaysFromNow(item.endDay);  // Tính số ngày còn lại
    const totalDays = calculateDaysFromNow(item.endDay, item.createDay);  // Tổng số ngày, với createDay là ngày bắt đầu
    const progressPercentage = (totalDays - daysRemaining) / totalDays * 100;
    return (
        <TouchableOpacity 
            onPress={() => navigation.navigate('Details', { item: item, timeRemain: daysRemaining })} 
            style={{
                borderRadius: 15, 
                backgroundColor: '#FFFFFF',
                elevation: 2,
                alignItems: 'center',
                margin: 10,
                height: 250,
                flex: 1
            }}>
            <View style={{ flex:7,flexDirection:'column' }}>
                <Image
                    source={{uri:item?.image[0]}}
                    style={{
                        height: 150,
                        width: 370,
                        margin:0,  // Đảm bảo ảnh chiếm toàn bộ chiều rộng của container
                        borderRadius: 15,
                        resizeMode: 'cover'
                    }}
                />
                <Text style={{ textAlign: 'center', marginVertical: 5 }}>{item.title}</Text>
            </View>
            <View style={{ flex: 3, position: 'relative', alignItems: 'center', justifyContent: 'center' ,margin:10}}>
                <View style={{ position: 'absolute', bottom: 0, margin: 5, width: '100%' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                        <Text>
                            <Icon color="#0a46ad" name="clock-rotate-left" size={16} /> {daysRemaining>0?daysRemaining+' ngày':'Hết thời hạn quyên góp'}
                        </Text>
                        <Text><Icon color="#0a46ad" name="hourglass-end" /> {item.endDay}</Text>
                    </View>
                    <View style={{ height: 4, width: '100%', backgroundColor: '#d5dae3', position: 'relative' }}>
                        {/* Thanh tiến trình */}
                        <View style={{
                            height: 4,
                            backgroundColor:daysRemaining<5&&daysRemaining>0?'red' :"#0a46ad",
                            width:progressPercentage<100 ?`${progressPercentage}%`:'100%',  // Tính phần trăm tiến trình
                            position: 'absolute'
                        }} />
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text><Icon color="green" name="money-check-dollar" />: {money?.totalMoney.toLocaleString('vi-VN', {style: 'currency',currency: 'VND',})||0}</Text>
                        <Text><Icon color="#0a46ad" name="user-group" /> :  {money?.quantity || 0}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

    return(
        <View style={{flex:1}}>
            <FlatList
                style={{backgroundColor:"#f9faf0",maxHeight: 50}}
                horizontal
                data={cate}
                renderItem={RenderCate}
            />
             <TextInput
                style={{ margin: 10}}
                value={searchTerm}  // Giá trị từ searchTerm (không phải search)
                onChangeText={setSearchTerm}
                mode="outlined"
                placeholder="Nhập từ khóa tìm kiếm"
                left={
                    <TextInput.Icon icon="file-find-outline" />
                }
                theme={{roundness:15}}
            />
            <VirtualizedList
                data={data}
                initialNumToRender={4}
                renderItem={({ item }) =><RenderItem item={item} money={money?.find(s=>s.postID==item.id)} />}
                keyExtractor={(item, index) => index.toString()}
                getItem={getItem}
                getItemCount={getItemCount}
                maxToRenderPerBatch={10}
            />
        </View>
    )
}
export default ExplorePage;