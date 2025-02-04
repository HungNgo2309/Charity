import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import RenderHtml from 'react-native-render-html';

const HTMLContentComponent = ({ htmlContent }) => {
  const { width } = Dimensions.get('window');
  console.log(width)
  // Check if content has HTML tags
  const containsHTML = /<\/?[a-z][\s\S]*>/i.test(htmlContent);
  console.log("test"+containsHTML);
  return (
    <View style={{ flex: 1, padding: 10 }}>
      {containsHTML ? (
        <RenderHtml
          contentWidth={width}
          source={{ html: htmlContent }}
          baseStyle={{ color: 'black',fontSize:16 }} 
        />
      ) : (
        <Text style={{ color:'black',fontSize: 16 }}>{htmlContent}</Text>
      )}
    </View>
  );
};

export default HTMLContentComponent;
