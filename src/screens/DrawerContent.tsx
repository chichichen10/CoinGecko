import React, { useCallback, useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, Image,
} from 'react-native';
import { DrawerItem, useDrawerStatus } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';

const styles = StyleSheet.create({
  test: {
    fontSize: 18,
    fontFamily: 'RobotoCondensed_400Regular',
    marginTop: 30,
    marginLeft: 15,
  },
  labelText: {
    fontSize: 18,
    fontFamily: 'RobotoCondensed_400Regular',
  },
});

export default function DrawerContent({ navigation }) {
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const renderItem = ({ item }) => (
    <DrawerItem
      label={item.symbol.toUpperCase()}
      onPress={() => navigation.navigate('Detail', { id: item.id })}
      labelStyle={styles.labelText}
      icon={({ size }) => (
        <Image
          source={{ uri: item.image }}
          resizeMode="contain"
          style={{ height: size, width: size }}
        />
      )}
    />
  );

  const getLikeList = useCallback(async () => {
    try {
      const value = await AsyncStorage.getItem('liked');
      if (value !== null) {
        console.log(value);
        const list = JSON.parse(value);
        setCount(count + 1);
        setData(list);
      }
    } catch (e) {
      console.log(e);
    }
  }, []);

  useEffect(() => {
    getLikeList();
  }, [useDrawerStatus()]);
  const keyExtractor = useCallback((item, index) => index.toString(), []);

  return (
    <View>
      <Text style={styles.test}>Favorite</Text>
      <FlatList data={data} keyExtractor={keyExtractor} renderItem={renderItem} />
    </View>
  );
}
