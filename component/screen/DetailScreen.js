import React from 'react';
import { Text, View } from 'react-native';

const DetailScreen = ({ navigation, route }) => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Details of {route.params.name}</Text>
        </View>
    );
}
export default DetailScreen;