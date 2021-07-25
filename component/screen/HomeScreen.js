import * as React from 'react';
import { Text, View } from 'react-native';

function HomeScreen() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Home from component!</Text>
        </View>
    )
}

export default HomeScreen;