import React from "react";
import { Pressable, View } from "react-native";
import Share, { Button } from 'react-native-share';
import Icon from 'react-native-vector-icons/FontAwesome6';

const SocialMedia=()=>{
    const options={
        title:'Test share app',
        
        url:'https://firebasestorage.googleapis.com/v0/b/charity-53c14.appspot.com/o/1726374036213?alt=media&token=a12e9abf-91b9-418f-ba5b-cd53b1fbeb74',
        message:'Nooij dung chien dich',
    }
    const fun = async () => {
        try {
            const shareResponse = await Share.open(options);
            console.log(shareResponse);
        } catch (error) {
            console.error(error)
        }
        
      };
    return(
        <View>

            <Pressable onPress={()=>fun()}><Icon size={25} color="black" name="share-from-square"/></Pressable>
        </View>
    )
}
export default SocialMedia;