import React from "react";
import WebView from "react-native-webview";

const Request =()=>{
    const url ="http://admincharityofhung.somee.com/Request/Create"
    return(
        <WebView
            key={url} // Add key to force re-render when URL changes
            source={{ uri: url }}
            style={{ flex: 1}}
        />
    )
}
export default Request;