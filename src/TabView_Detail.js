import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet, VirtualizedList } from "react-native";
import { Divider } from "react-native-paper";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


export default function TabViewDetail({money,charityData,usernames}) {
    const [selected, setSelected] = useState(0);

    const getItem = (data, index) => data[index];
    const getItemCount = (data) => data.length;

    return (
        <View style={styles.container}>
            <View style={styles.tabContainer}>
                <Pressable onPress={() => setSelected(0)} style={[styles.tab, selected === 0 && styles.activeTab]}>
                    <Text style={[styles.tabText, selected === 0 && styles.activeTabText]}>Thu</Text>
                </Pressable>
                <Pressable onPress={() => setSelected(1)} style={[styles.tab, selected === 1 && styles.activeTab]}>
                    <Text style={[styles.tabText, selected === 1 && styles.activeTabText]}>Chi</Text>
                </Pressable>
            </View>
            {money?
            <VirtualizedList
                data={ charityData}
                initialNumToRender={4}
                renderItem={({ item }) => <DonationMoney item={item} selectedTab={selected} usernames={usernames} />}
                keyExtractor={(item, index) => index.toString()}
                getItem={getItem}
                getItemCount={getItemCount}
                ItemSeparatorComponent={() => <Divider style={styles.divider} />}
                />:
            <VirtualizedList
            data={charityData}
            initialNumToRender={4}
            renderItem={({ item }) => <DonationItem item={item} selectedTab={selected} usernames={usernames}/>}
            keyExtractor={(item, index) => index.toString()}
            getItem={getItem}
            getItemCount={getItemCount}
            ItemSeparatorComponent={() => <Divider style={styles.divider} />}
            />
            }
            
        </View>
    );
}

function DonationMoney({ item, selectedTab ,usernames}) {
    return (
        <View style={styles.item}>
            <View style={styles.iconContainer}>
                <Icon name={selectedTab === 0 ? 'currency-usd' : 'gift-outline'} size={24} color="#FFB800" />
            </View>
            <View style={styles.detailsContainer}>
                <View style={{flex:6,justifyContent:'space-between'}}>
                    <Text style={styles.name}>Từ : {usernames[item.userID] || 'Loading...'}</Text>
                    <Text>Ung ho chien dich abc gay quy giup do jahdasdfkg msadjasgj</Text>
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
    );
}
function DonationItem({ item, selectedTab,usernames }) {
    return (
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
                    {selectedTab === 0 ? 
                            (item.listOther).map(({ name, quantity }, index) => (
                               <Text style={styles.money} key={index}>{`${name}: ${quantity}`}</Text>
                           ))
                     : (
                        <Text style={styles.items}>{item.amountMoney} VND</Text>
                    )}
                    <Text>{item.date}</Text>
                </View>
            </View>
            
        </View>
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
        elevation: 4,
    },
    tab: {
        paddingVertical: 8,
        flex: 1,
        alignItems: 'center',
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#FFB800',
    },
    tabText: {
        color: 'black',
        fontSize: 16,
    },
    activeTabText: {
        color: '#FFB800',
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
