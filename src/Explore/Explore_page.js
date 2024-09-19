import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, Image, ImageBackground, TouchableOpacity, useWindowDimensions, View, VirtualizedList } from "react-native";
import { Appbar, Button, IconButton, Searchbar, Text, TextInput } from "react-native-paper";
import Icon from 'react-native-vector-icons/FontAwesome6';
import useDebounce from "../hook/UseDebounce";

const ExplorePage=({route,navigation})=>{
    const { select } = route.params || {};
    const [catedd,setCatedd]=useState([{id:"",name:"Tất cả"}]);
    const [data,setData] = useState([]);
    const [cate,setCate]=useState([]);
    const [searchTerm, setSearchTerm] = useState('');  // Giá trị từ input
    const search = useDebounce(searchTerm, 1000);
    // Đặt giá trị cho selected với giá trị select nếu có, nếu không thì là ""
    const [selected, setSelected] = useState(select!=undefined ?select: "");
    console.log(select); 
    useEffect(() => {
    const LoadCate = async () => {
      try {
          const url = 'http://192.168.23.160:8080/Category';
          const response = await axios.get(url);
          setCate([...catedd, ...response.data]);
           // in ra dữ liệu phản hồi
      } catch (error) {
          console.log(error);
      }
      };
      LoadCate();// Gọi hàm LoadData nhưng không cần return
    }, [select]);
    useEffect(() => {
        const LoadCate = async () => {
            if (search !== "") {  // Chỉ gọi API khi search không rỗng
                try {
                    const url = `http://192.168.23.160:8080/Post/Search?text=${search}`;
                    const response = await axios.get(url);
                    setData(response.data);  // In ra dữ liệu phản hồi
                } catch (error) {
                    console.log(error);
                }
            }
        };
        LoadCate();  
    }, [search]);  
    useEffect(() => {
      //setSelected(select ?? "")
      const LoadData = async () => {
        try {
        if (selected === "") 
            {
                const url = `http://192.168.23.160:8080/Post`;
                const response = await axios.get(url);
                setData(response.data);
                console.log('else')
            } // Không thực hiện khi selected rỗng
        else{
          const url = `http://192.168.23.160:8080/Postted/${selected}`;
          const response = await axios.get(url);
          setData(response.data);
          console.log(selected);
        }
        } catch (error) {
          console.log('Error fetching data:', error); // Sử dụng console.error để dễ nhận diện lỗi
        }
      };
      LoadData(); 
    }, [selected]); // Danh sách phụ thuộc
    useEffect(()=>{
        setSelected(select);
    },[select])
    const getItem = (data, index) => data[index];
    const getItemCount = (data) => data.length;
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
  const RenderItem = ({ item }) => {
    const daysRemaining = calculateDaysFromNow(item.endDay);  // Tính số ngày còn lại
    const totalDays = calculateDaysFromNow(item.endDay, item.createDay);  // Tổng số ngày, với createDay là ngày bắt đầu
    const progressPercentage = (totalDays - daysRemaining) / totalDays * 100; // Tính phần trăm tiến trình
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
            <View style={{ flex:7 }}>
                <Image
                    source={require('../../assets/img/quanao.jpg')}
                    style={{
                        height: 150,
                        width: 370,  // Đảm bảo ảnh chiếm toàn bộ chiều rộng của container
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
                            <Icon color="#FFB800" name="clock-rotate-left" size={16} /> {daysRemaining} ngày
                        </Text>
                        <Text><Icon color="#FFB800" name="hourglass-end" /> {item.endDay}</Text>
                    </View>
                    <View style={{ height: 4, width: '100%', backgroundColor: 'gray', position: 'relative' }}>
                        {/* Thanh tiến trình */}
                        <View style={{
                            height: 4,
                            backgroundColor: "#FFB800",
                            width: `${progressPercentage}%`,  // Tính phần trăm tiến trình
                            position: 'absolute'
                        }} />
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text><Icon color="#FFB800" name="money-check-dollar" />: 234,5453,453 VNĐ</Text>
                        <Text><Icon color="#FFB800" name="user-group" /> : 234</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

    return(
        <View style={{flex:1}}>
            <FlatList
                style={{backgroundColor:"#8A8A8A",maxHeight: 50}}
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
                renderItem={RenderItem}
                keyExtractor={(item, index) => index.toString()}
                getItem={getItem}
                getItemCount={getItemCount}
            />
        </View>
    )
}
export default ExplorePage;