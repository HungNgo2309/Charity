import * as React from 'react';
import { StyleSheet, View, VirtualizedList, useWindowDimensions } from 'react-native';
import { Icon, Text } from 'react-native-paper';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
const charityData = [
    { id: 1, name: "Save the Children", money: 50000 },
    { id: 2, name: "World Wildlife Fund", money: 75000 },
    { id: 3, name: "Red Cross", money: 120000 },
    { id: 4, name: "Doctors Without Borders", money: 85000 },
    { id: 5, name: "Habitat for Humanity", money: 40000 }
  ];
  
  // Function to get an item from the data
  const getItem = (data, index) => ({
    id: data[index].id,
    name: data[index].name,
    money: data[index].money
  });
  
  // Function to get the total number of items
  const getItemCount = (data) => data.length;
  const FirstRoute = () => (
  <View style={{ flex: 1 }}>
    <View style={{flexDirection:'row',margin:10}}>
                <Icon source="calendar" />
                <Text style={{marginLeft:10}}>tu ngay x/x/2024 den x/x/2024</Text>
            </View>
            <View style={{flexDirection:'row',margin:10}}> 
                <Icon source="map-marker" />
                <Text style={{marginLeft:10}}>xxxx-xxxxx-xxxxx, Binh duown</Text>
            </View>
            <View style={{height:150}}>

            </View>
            <VirtualizedList
                data={charityData} // The data array
                initialNumToRender={4} // How many items to render initially
                renderItem={({ item }) => (
                    <View style={styles.item}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.money}>Raised: ${item.money.toLocaleString()}</Text>
                    </View>
                )}
                keyExtractor={(item) => item.id.toString()}
                getItem={getItem} // Function to get an item
                getItemCount={getItemCount} // Function to get the item count
                />
  </View>
);

const SecondRoute = () => (
  <View style={{ flex: 1}}>
    <View style={{flexDirection:'row',margin:10}}>
                <Icon source="calendar" />
                <Text style={{marginLeft:10}}>tu ngay x/x/2024 den x/x/2024</Text>
            </View>
            <View style={{flexDirection:'row',margin:10}}> 
                <Icon source="map-marker" />
                <Text style={{marginLeft:10}}>xxxx-xxxxx-xxxxx, Binh duown</Text>
            </View>
  </View>
);

const renderScene = SceneMap({
  first: FirstRoute,
  second: SecondRoute,
});

 const TabViewExample=()=> {
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'First' },
    { key: 'second', title: 'Second' },
  ]);

  return (
    <View style={{flex:1}}>
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderTabBar={props => (
        <TabBar
          {...props}
          style={{ backgroundColor: 'white'}} // TabBar background color
          indicatorStyle={{ backgroundColor: '#FFB800' }}
          renderLabel={({ route, focused }) => (
            <Text style={{ color: index === 0 && route.key === 'first' || index === 1 && route.key === 'second' ? '#FFB800' : 'black' }}>
              {route.title}
            </Text>
          )} // Tab indicator color
        />
      )}
    />
    
    </View>
  );
}
export default TabViewExample;
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