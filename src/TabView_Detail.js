import React, { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet, VirtualizedList, FlatList, Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Divider } from "react-native-paper";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { callApi } from "./Component/fetchData";


export default function TabViewDetail({postID,money,charityData,usernames,isresult,dataResult,Zoom}) {
    const [selected, setSelected] = useState(0);
    const getItem = (data, index) => data[index];
    const getItemCount = (data) => data.length;
    const [list, setList] = useState({});


    // Update list and result when dataResult changes
    useEffect(()=>{
          const HandleShowResult=async()=>{
            try {
              if(isresult)
              {
                try {
                  const response=await callApi('GET', `/Result/${postID}`);
                  //console.log(response)
                  setList(response);
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
    return (
        <View style={styles.container}>
            <View style={styles.tabContainer}>
                <Pressable onPress={() => setSelected(0)} style={[styles.tab, selected === 0 && styles.activeTab]}>
                    <Text style={[styles.tabText, selected === 0 && styles.activeTabText]}>Thu</Text>
                </Pressable>
                {isresult?
                <Pressable onPress={() => setSelected(1)} style={[styles.tab, selected === 1 && styles.activeTab]}>
                    <Text style={[styles.tabText, selected === 1 && styles.activeTabText]}>Chi</Text>
                </Pressable>
                :null}
            </View>
            {
                selected === 0 ? (
                    money ? (
                        <VirtualizedList
                            data={charityData}
                            initialNumToRender={4}
                            renderItem={({ item }) => <DonationMoney isresult={isresult} item={item} selectedTab={selected} usernames={usernames} />}
                            keyExtractor={(item, index) => index.toString()}
                            getItem={getItem}
                            getItemCount={getItemCount}
                            ItemSeparatorComponent={() => <Divider style={styles.divider} />}
                        />
                    ) : (
                        <VirtualizedList
                            data={charityData}
                            initialNumToRender={4}
                            renderItem={({ item }) => <DonationItem item={item} isresult={isresult} selectedTab={selected} usernames={usernames} />}
                            keyExtractor={(item, index) => index.toString()}
                            getItem={getItem}
                            getItemCount={getItemCount}
                            ItemSeparatorComponent={() => <Divider style={styles.divider} />}
                        />
                    )
                ) : (
                    <ResultRender dataResult={list} money={money} Zoom={Zoom} />
                )
            }
        </View>
    );
}

function DonationMoney({ item, selectedTab ,usernames,isresult}) {
    return (
        <>
        {isresult?
        <View style={styles.item}>
            <View style={styles.iconContainer}>
                <Icon name={selectedTab === 0 ? 'currency-usd' : 'currency-usd'} size={24} color="#FFB800" />
            </View>
            <View style={styles.detailsContainer}>
                <View style={{flex:6,justifyContent:'space-between'}}>
                    <Text style={styles.name}>Từ : {item.confirm?"Ẩn danh":usernames[item.userID] || 'Loading...'}</Text>
                    <Text>{item.content}</Text>
                </View>
                    <View style={{flex:4,justifyContent:'space-between'}}> 
                    {selectedTab === 0 ? (
                        <Text style={styles.money}>+ {item.amountMoney.toLocaleString()} VND</Text>
                    ) : (                        
                        <Text style={styles.items}>- {item.amountMoney.toLocaleString()} VND</Text>
                    )}
                    <Text>{item.date}</Text>
                </View>
                
            </View>
            
        </View>
        :
        <View style={styles.item}>
        <View style={styles.iconContainer}>
            <Icon name={selectedTab === 0 ? 'currency-usd' : 'gift-outline'} size={24} color="#FFB800" />
        </View>
        <View style={styles.detailsContainer}>
            <View style={{flex:6,justifyContent:'space-between'}}>
                <Text style={styles.name}>Từ : {usernames[item.userID] || 'Loading...'}</Text>
                <Text>{item.content}</Text>
            </View>
                <View style={{flex:4,justifyContent:'space-between'}}> 
                {selectedTab === 0 ? (
                    <Text style={styles.money}>+ {item.amountMoney.toLocaleString()} VND</Text>
                ) : (                        
                    null
                )}
                <Text>{item.date}</Text>
            </View>
            
        </View>
        
    </View>}
        </>
    );
}
function DonationItem({ item, selectedTab,usernames,isresult }) {
    return (
        <>
        {isresult?
        <View style={styles.item}>
            <View style={styles.iconContainer}>
                <Icon name={selectedTab === 0 ? 'gift-outline' : 'gift-outline'} size={24} color="#FFB800" />
            </View>
            <View style={styles.detailsContainer}>
                <View style={{flex:6,justifyContent:'space-between'}}>
                    <Text style={styles.name}>Từ : {usernames[item.userID] || 'Loading...'}</Text>
                    {selectedTab === 0 ? 
                            (item.listOther).map(({ name, quantity }, index) => (
                               <Text style={styles.money} key={index}>{`${name}: ${quantity}`}</Text>
                           ))
                     : (
                        (item.listOther).map(({ name, quantity }, index) => (
                            <Text style={styles.items} key={index}>{`${name}: ${quantity}`}</Text>
                        ))
                    )}
                </View>
                    <View style={{flex:4,justifyContent:'space-between'}}> 
                    
                    <Text>{item.date}</Text>
                </View>
            </View>
            
        </View>:<View style={styles.item}>
            <View style={styles.iconContainer}>
                <Icon name={selectedTab === 0 ? 'currency-usd' : 'gift-outline'} size={24} color="#FFB800" />
            </View>
            <View style={styles.detailsContainer}>
                <View style={{flex:6,justifyContent:'space-between'}}>
                    <Text style={styles.name}>Từ : {usernames[item.userID] || 'Loading...'}</Text>
                    {selectedTab === 0 ? 
                            (item.listOther).map(({ name, quantity }, index) => (
                               <Text style={styles.money} key={index}>{`${name}: ${quantity}`}</Text>
                           ))
                     : (
                        null
                    )}
                </View>
                    <View style={{flex:4,justifyContent:'space-between'}}> 
                    
                    <Text>{item.date}</Text>
                </View>
                
            </View>
            
        </View>}
        </>
    );
}
function ResultRender({ money, dataResult, Zoom }) {
    // if (!dataResult || !dataResult.result) {
    //     console.log("Invalid dataResult:", dataResult.result);
    //     return null;
    // }
    const filteredData = money
        ? dataResult[0]?.result.filter((s) => s.money > 0)
        : dataResult[0]?.result.filter((s) => s.money === 0);
    console.log("deo hieu"+filteredData);
    return (
        <FlatList
            data={filteredData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
                <View>
                    <View style={styles.item}>
                        <View style={styles.iconContainer}>
                            <Icon name={money ? 'currency-usd' : 'gift-outline'} size={24} color="#FFB800" />
                        </View>
                        <View style={styles.detailsContainer}>
                            <View style={{ flex: 5, justifyContent: 'space-between' }}>
                                <Text style={styles.name}>{item.content}</Text>
                            </View>
                            <View style={{ flex: 5, justifyContent: 'space-between' }}>
                                {money ? (
                                    <Text style={styles.money}>- {item.money > 0 ? item.money.toLocaleString() : 0} VND</Text>
                                ) : null}
                                <Text>{item.date}</Text>
                            </View>
                        </View>
                        <Pressable
                            style={{ height: 50, width: 50 }}
                            onPress={() => Zoom(`data:image/jpeg;base64,${item.image}`)}>
                            <Image
                                source={{ uri:`data:image/jpeg;base64,${item.image}` }}
                                style={{ height: 50, width: 50 }}
                            />
                        </Pressable>
                    </View>
                </View>
            )}
            ItemSeparatorComponent={() => <Divider style={styles.divider} />}
        />
    );
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8',
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
        backgroundColor: '#FFFFFF',
    },
    tab: {
        paddingVertical: 8,
        flex: 1,
        alignItems: 'center',
    },
    // activeTab: {
    //     borderBottomWidth: 2,
    //     borderBottomColor: '#FFB800',
    // },
    tabText: {
        color: 'black',
        fontSize: 16,
    },
    activeTabText: {
        color: 'black',
        fontWeight: 'bold',
    },
    item: {
        flexDirection:'row',
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        marginHorizontal: 16,
        marginVertical: 8,
        elevation: 2,
    },
    iconContainer: {
        justifyContent: 'center',
        marginRight: 12,
    },
    detailsContainer: {
        flex: 1,
        flexDirection:'row',
        justifyContent:'space-between'
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333333',
    },
    money: {
        fontSize: 16,
        color: 'green',
    },
    items: {
        fontSize: 16,
        color: 'red',
        marginTop: 4,
    },
    divider: {
        backgroundColor: '#ddd',
        marginHorizontal: 16,
    },
});
