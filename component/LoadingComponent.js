import React from 'react';
import { View, ActivityIndicator } from 'react-native'

const LoadingComponent = () => {
    return (
        <View style={{ flex: 1, padding: 20, alignItems: "center", justifyContent: "center" }}>
            <ActivityIndicator animating size="large" />
        </View>
    );

}
export default LoadingComponent;