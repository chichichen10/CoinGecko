import React, { useCallback, useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, Image,
} from 'react-native';
import { DrawerItem, useDrawerStatus } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SearchBar from 'react-native-dynamic-search-bar';
import { ApiCoins } from '../models/CoinGeckoAPIType';

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
  searchBar: {
    marginTop: 50,
  },
  errorText: {
    marginTop: 10,
    fontSize: 18,
    fontFamily: 'RobotoCondensed_400Regular',
    marginLeft: 15,
  },
  blank: {
    height: 10,
  },
});

export default function DrawerContent({ navigation }) {
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState('');
  const [searchCoin, setSearchCoin] = useState<ApiCoins>(null);
  const [isLoading, setLoading] = useState(false);

  const renderItem = useCallback(
    ({ item }) => (
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
    ),
    [],
  );

  const SearchResult = useCallback(
    () => ('error' in searchCoin ? (
      <Text style={styles.errorText}> Coin not found!</Text>
    ) : (
      <DrawerItem
        label={searchCoin.symbol.toUpperCase()}
        onPress={() => navigation.navigate('Detail', { id: searchCoin.id })}
        labelStyle={styles.labelText}
        icon={({ size }) => (
          <Image
            source={{ uri: searchCoin.image.small }}
            resizeMode="contain"
            style={{ height: size, width: size }}
          />
        )}
      />
    )),
    [searchCoin],
  );

  const SearchItem = useCallback(
    () => (searchCoin ? <SearchResult /> : <View style={styles.blank} />),
    [searchCoin],
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

  const updateSearch = useCallback((text) => {
    setSearch(text);
  }, []);

  // not able to use due to API limit
  // useEffect(() => {
  //   if (search !== '') {
  //     setLoading(true);
  //     fetch(`https://api.coingecko.com/api/v3/coins/${search.toLowerCase()}?localization=false`)
  //       .then((response) => response.json())
  //       .then((json) => {
  //         setSearchCoin(json);
  //       })
  //       .catch((error) => console.error(error))
  //       .finally(() => setLoading(false));
  //   } else setLoading(false);
  // }, [search]);

  useEffect(() => {
    if (searchCoin) {
      if ('error' in searchCoin) {
        console.log('error');
      } else {
        console.log(searchCoin.name);
      }
    }
  }, [searchCoin]);

  const handleClear = useCallback(() => {
    setSearchCoin(null);
  }, []);

  const handlePressSearch = useCallback(() => {
    if (search !== '') {
      setLoading(true);
      fetch(`https://api.coingecko.com/api/v3/coins/${search.toLowerCase()}?localization=false`)
        .then((response) => response.json())
        .then((json) => {
          setSearchCoin(json);
        })
        .catch((error) => console.error(error))
        .finally(() => setLoading(false));
    } else setLoading(false);
  }, [search]);

  return (
    <View>
      <SearchBar
        style={styles.searchBar}
        placeholder="Search here"
        onSearchPress={handlePressSearch}
        onChangeText={updateSearch}
        spinnerVisibility={isLoading}
        onClearPress={handleClear}
      />
      <SearchItem />
      <Text style={styles.test}>Favorite</Text>
      <FlatList data={data} keyExtractor={keyExtractor} renderItem={renderItem} />
    </View>
  );
}
