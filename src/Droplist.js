import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { IconButton, TextInput } from 'react-native-paper';

const DropDownList = ({ items, handleAddItem }) => {
    const [selectedItem, setSelectedItem] = useState(null);
    const [quantity, setQuantity] = useState(0);

    return (
        <View style={styles.container}>
            <Dropdown
                data={items}
                maxHeight={300}
                labelField="name"  // Trường để hiển thị tên mục
                valueField="id"  // Trường chứa giá trị duy nhất (ID)
                placeholder="Chọn danh mục"
                searchPlaceholder="Search..."
                disableSearch={true}
                value={selectedItem?.id} // Giá trị đã chọn, dùng id
                onChange={item => {
                    setSelectedItem(item);
                    setQuantity(0)
                }}
                style={styles.dropdown}
            />
            {selectedItem && (
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                    <Text>{selectedItem.name}</Text>
                    <TextInput
                        value={quantity.toString()}
                        keyboardType='numeric'
                        onChangeText={setQuantity}
                        style={{ width: 60, marginHorizontal: 10 }}
                        mode='outlined'
                    />
                    <Text>{selectedItem.unit}</Text>
                    <IconButton
                        icon="check-circle"
                        onPress={() => handleAddItem(selectedItem, quantity)}
                    />
                    <IconButton
                        icon="delete-circle-outline"
                        size={30}
                        onPress={()=>setSelectedItem(null)}
                    />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingHorizontal: 10,
        marginTop: 20,
    },
    dropdown: {
        padding: 10,
        backgroundColor: '#FFB800',
        borderRadius: 5,
        borderColor: '#000',
        borderWidth: 1,
    },
});

export default DropDownList;
