import React, { useEffect, useState, useCallback } from 'react';
import {
  FlatList,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  StyleSheet,
  Image,
} from 'react-native';
import LoadingComponent from '../components/LoadingComponent';
import { ApiCoinsMarket } from '../models/CoinGeckoAPIType';

const styles = StyleSheet.create({
  logoContainer: {
    width: '10%',
    paddingLeft: 10,
  },
  logo: {
    width: 30,
    height: 30,
  },
  listContainer: {
    backgroundColor: '#F0FBFC',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
  },
  headerName: { width: '15%', marginLeft: '10%' },
  headerPrice: { width: '25%' },
  headerVolume: { width: '25%' },
  name: { width: '15%', textAlign: 'center' },
  price: { width: '25%', textAlign: 'center' },
  volume: { width: '25%', textAlign: 'center' },
});

const Footer = React.memo((props: { isPulling: boolean; setPulling }) => {
  const { isPulling, setPulling } = props;
  if (Platform.OS === 'web') {
    return !isPulling ? (
      <TouchableOpacity style={{ padding: 10 }} onPress={() => setPulling(true)}>
        <Text style={{ width: '80%', textAlign: 'center' }}>click for more</Text>
      </TouchableOpacity>
    ) : (
      <View>
        <ActivityIndicator animating size="large" color="#0000ff" />
      </View>
    );
  }
  return !isPulling ? (
    <Text style={{ width: '100%', textAlign: 'center' }}>Pull for more</Text>
  ) : (
    <View>
      <ActivityIndicator animating size="large" color="#0000ff" />
    </View>
  );
});

function HomeScreen({ navigation }) {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<ApiCoinsMarket[]>([]);
  // const [moreData, setMoreData] = useState([]);
  const [sortBy, setSortBy] = useState('market_cap');
  const [descending, setDescending] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [renderCount, setRenderCount] = useState(0);
  const [isPulling, setPulling] = useState(false);
  // const [initRneder, setInitRneder] = useState(true);

  //   useEffect(() => {
  //     console.log("run1");
  //     fetch(
  //       "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=price_desc&per_page=25&page=1&sparkline=false"
  //     )
  //       .then((response) => response.json())
  //       .then((json) => setData(json))
  //       .catch((error) => console.error(error))
  //       .finally(() => setLoading(false));
  //   }, []);

  const textArrow = descending ? '↓' : '↑';
  const textOrder = descending ? 'desc' : 'asc';

  useEffect(() => {
    console.log('run2');
    setLoading(true);
    console.log(`sortBy: ${sortBy} decending${descending}`);
    fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=${sortBy}_${textOrder}&per_page=25&page=1&sparkline=false`,
    )
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => console.error(error))
      .finally(() => {
        setLoading(false);
        setRenderCount(0);
      });
  }, [sortBy, descending]);

  useEffect(() => {
    if (isPulling) {
      fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=${sortBy}_${textOrder}&per_page=25&page=${
          renderCount + 2
        }&sparkline=false`,
      )
        .then((response) => response.json())
        .then((json) => setData(data.concat(json)))
        .catch((error) => console.error(error))
        .finally(() => {
          setRenderCount(renderCount + 1);
          setPulling(false);
        });
    }
  }, [isPulling]);
  const fetchMore = useCallback(() => {
    if (Platform.OS !== 'web') {
      setPulling(true);
      console.log('pulling from mobile');
    } else {
      console.log('from web!');
    }
  }, []);

  const refresh = useCallback(() => {
    setRefreshing(true);
    fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=${sortBy}_${textOrder}&per_page=25&page=1&sparkline=false`,
    )
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => console.error(error))
      .finally(() => {
        setRefreshing(false);
        setRenderCount(0);
      });
  }, [sortBy]);

  const changeOrder = useCallback(
    (target) => {
      console.log('called!!!!!');
      if (sortBy === target) setDescending(!descending);
      else {
        setSortBy(target);
        setDescending(true);
      }
    },
    [sortBy, descending],
  );

  // const renderFooter = () => {
  //     return (!isPulling ?
  //         <Text style={{ width: "100%", textAlign: "center" }}>Pull for more</Text> :
  //         <View>
  //             <ActivityIndicator animating size="large" />
  //         </View>
  //     )
  // }

  const DevideLine = useCallback(
    () => <View style={{ height: 1, backgroundColor: 'skyblue' }} />,
    [],
  );

  const HeaderComponent = useCallback(
    () => (
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => changeOrder('id')} style={styles.headerName}>
          <Text
            style={{
              fontWeight: sortBy === 'id' ? 'bold' : 'normal',
              textAlign: 'center',
            }}
          >
            Name
            {' '}
            {sortBy === 'id' ? textArrow : ''}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => changeOrder('price')} style={styles.headerPrice}>
          <Text
            style={{
              fontWeight: sortBy === 'price' ? 'bold' : 'normal',
              textAlign: 'center',
            }}
          >
            Price
            {' '}
            {sortBy === 'price' ? textArrow : ''}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => changeOrder('volume')} style={styles.headerVolume}>
          <Text
            style={{
              fontWeight: sortBy === 'volume' ? 'bold' : 'normal',
              textAlign: 'center',
            }}
          >
            Volume
            {' '}
            {sortBy === 'volume' ? textArrow : ''}
          </Text>
        </TouchableOpacity>
      </View>
    ),
    [sortBy, descending],
  );

  const handlePress = useCallback(
    (item) => () => navigation.navigate('Detail', { id: item.id }),
    [data],
  );

  return (
    <View style={{ flex: 1 }}>
      {isLoading ? (
        <LoadingComponent />
      ) : (
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <FlatList
            data={data}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={DevideLine}
            ListHeaderComponent={HeaderComponent}
            renderItem={({ item }) => (
              <View style={styles.listContainer}>
                <View style={styles.logoContainer}>
                  <Image style={styles.logo} source={{ uri: item.image }} />
                </View>
                <Text style={styles.name}>{item.symbol}</Text>
                <Text style={styles.price}>{item.current_price}</Text>
                <Text style={styles.volume}>{item.total_volume}</Text>
                <TouchableOpacity
                  style={{
                    alignItems: 'center',
                    marginLeft: 10,
                    padding: 10,
                    backgroundColor: 'gray',
                  }}
                  onPress={handlePress(item)}
                >
                  <Text>DETAIL</Text>
                </TouchableOpacity>
              </View>
            )}
            onEndReachedThreshold={0.1}
            onEndReached={fetchMore}
            ListFooterComponent={<Footer isPulling={isPulling} setPulling={setPulling} />}
            onRefresh={refresh}
            refreshing={refreshing}
            contentContainerStyle={{ padding: 10 }}
          />
        </View>
      )}
    </View>
  );
}

export default HomeScreen;
