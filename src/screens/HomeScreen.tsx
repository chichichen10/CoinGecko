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
  page: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  listContainer: {
    backgroundColor: '#F0FBFC',
    flexDirection: 'row',
    alignItems: 'center',
    height: 65,
  },
  headerContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
  },
  headerRank: {
    width: 20,
    paddingLeft: 10,
  },
  headerName: {
    flex: 1.5,
    marginLeft: 35,
    textAlign: 'center',
  },
  headerPrice: {
    flex: 3,
    textAlign: 'center',
    marginRight: 15,
  },
  headerVolume: {
    flex: 3,
    textAlign: 'center',
    marginRight: 15,
  },
  headerText: {
    textAlign: 'right',
  },
  rank: {
    width: 25,
    paddingLeft: 5,
    textAlign: 'center',
    // fontFamily: 'Courier New',
    fontSize: 10,
  },
  logoContainer: {
    width: 25,
    paddingLeft: 10,
  },
  logo: {
    width: 20,
    height: 20,
  },
  name: {
    flex: 1.5,
    textAlign: 'left',
    marginLeft: 10,
    fontSize: 16,
    // fontFamily: 'Courier New',
    fontWeight: 'bold',
  },
  price: {
    flex: 3,
    justifyContent: 'flex-end',
    paddingRight: 25,
    flexDirection: 'column',
  },
  volume: {
    flex: 3,
    marginRight: 10,
    textAlign: 'right',
  },
  pullText: {
    width: '80%',
    textAlign: 'center',
  },
  currentPrice: {
    marginTop: 30,
    fontSize: 20,
    textAlign: 'right',
    justifyContent: 'center',
  },
  priceChange: {
    fontSize: 14,
    textAlign: 'right',
  },
});

const Footer = React.memo((props: { isPulling: boolean; setPulling }) => {
  const { isPulling, setPulling } = props;
  if (Platform.OS === 'web') {
    return !isPulling ? (
      <TouchableOpacity style={{ padding: 10 }} onPress={() => setPulling(true)}>
        <Text style={styles.pullText}>click for more</Text>
      </TouchableOpacity>
    ) : (
      <View>
        <ActivityIndicator animating size="large" color="#0000ff" />
      </View>
    );
  }
  return !isPulling ? (
    <Text style={styles.pullText}>Pull for more</Text>
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

  const handlePressOrder = useCallback(
    (orderBy) => () => changeOrder(orderBy),
    [sortBy, descending],
  );

  const HeaderComponent = useCallback(
    () => (
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handlePressOrder('market_cap')} style={styles.headerRank}>
          <Text
            style={{
              fontWeight: sortBy === 'market_cap' ? 'bold' : 'normal',
              textAlign: 'center',
            }}
          >
            #
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handlePressOrder('id')} style={styles.headerName}>
          <Text
            style={{
              fontWeight: sortBy === 'id' ? 'bold' : 'normal',
            }}
          >
            Coin
            {' '}
            {sortBy === 'id' ? textArrow : ''}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handlePressOrder('price')} style={styles.headerPrice}>
          <Text
            style={[
              {
                fontWeight: sortBy === 'price' ? 'bold' : 'normal',
              },
              styles.headerText,
            ]}
          >
            Price
            {' '}
            {sortBy === 'price' ? textArrow : ''}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handlePressOrder('volume')} style={styles.headerVolume}>
          <Text
            style={[
              {
                fontWeight: sortBy === 'volume' ? 'bold' : 'normal',
              },
              styles.headerText,
            ]}
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

  const convertNull = useCallback((num) => (num === null ? 0 : num), []);

  const renderItem = useCallback(
    ({ item }) => (
      <TouchableOpacity style={styles.listContainer} onPress={handlePress(item)}>
        <Text style={styles.rank} numberOfLines={1}>
          {item.market_cap_rank}
        </Text>
        <View style={styles.logoContainer}>
          <Image style={styles.logo} source={{ uri: item.image }} />
        </View>
        <Text style={styles.name}>{item.symbol.toUpperCase()}</Text>
        <View style={styles.price}>
          <Text style={styles.currentPrice}>
            {convertNull(item.current_price).toLocaleString('en', {
              style: 'currency',
              currency: 'USD',
            })}
          </Text>
          <Text
            style={[
              styles.priceChange,
              { color: item.price_change_percentage_24h >= 0 ? 'red' : 'green' },
            ]}
          >
            {item.price_change_percentage_24h > 0 ? '+' : ''}
            {convertNull(item.price_change_percentage_24h).toFixed(2)}
            %
          </Text>
        </View>
        <Text style={styles.volume}>{item.total_volume.toLocaleString('en')}</Text>
      </TouchableOpacity>
    ),
    [data],
  );

  const keyExtractor = useCallback((item, index) => index.toString(), []);

  return (
    <View style={styles.page}>
      {isLoading ? (
        <LoadingComponent />
      ) : (
        <View style={styles.page}>
          <FlatList
            data={data}
            keyExtractor={keyExtractor}
            ItemSeparatorComponent={DevideLine}
            ListHeaderComponent={HeaderComponent}
            renderItem={renderItem}
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
