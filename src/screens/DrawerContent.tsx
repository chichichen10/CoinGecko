import React, { useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList,
} from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';

const styles = StyleSheet.create({
  test: {
    fontSize: 20,
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
  const renderItem = ({ item }) => (
    <DrawerItem
      label={item.name}
      onPress={() => navigation.navigate('Detail', { id: item.id })}
      labelStyle={styles.labelText}
    />
  );

  const data = [
    { name: '1', id: 'bitcoin' },
    { name: '2', id: 'bitcoin' },
    { name: '3', id: 'bitcoin' },
    { name: '4', id: 'bitcoin' },
  ];
  const keyExtractor = useCallback((item, index) => index.toString(), []);

  return (
    <View>
      <Text style={styles.test}>Hello Drawer!</Text>
      <FlatList data={data} keyExtractor={keyExtractor} renderItem={renderItem} />
    </View>
  );
}
