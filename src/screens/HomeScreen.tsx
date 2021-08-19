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
    width: 25,
    paddingLeft: 10,
  },
  headerName: {
    flex: 1.2,
    marginLeft: 10,
    textAlign: 'left',
  },
  headerPrice: {
    flex: 3,
    textAlign: 'center',
    paddingRight: 15,
  },
  headerVolume: {
    flex: 3.2,
    textAlign: 'center',
    marginRight: 10,
  },
  headerText: {
    textAlign: 'right',
  },
  logoContainer: {
    width: 25,
    paddingLeft: 10,
    alignItems: 'center',
  },
  rank: {
    width: 25,
    paddingLeft: 10,
    textAlign: 'center',
    fontSize: 10,
  },
  logo: {
    width: 15,
    height: 15,
  },
  name: {
    flex: 1.2,
    textAlign: 'left',
    marginLeft: 10,
    fontSize: 16,
    // fontFamily: 'Courier New',
    fontWeight: 'bold',
    flexWrap: 'nowrap',
  },
  fullName: {
    flex: 2.2,
    textAlign: 'left',
    marginLeft: 10,
    fontSize: 12,
    // fontFamily: 'Courier New',
  },
  // price: {
  //   flex: 3,
  //   justifyContent: 'flex-end',
  //   paddingRight: 25,
  //   flexDirection: 'column',
  // },

  currentPrice: {
    flex: 3,
    justifyContent: 'flex-end',
    paddingRight: 15,
    fontSize: 20,
    textAlign: 'right',
  },
  priceChange: {
    flex: 2,
    justifyContent: 'flex-end',
    paddingRight: 15,
    fontSize: 14,
    textAlign: 'right',
  },
  volume: {
    flex: 3.2,
    marginRight: 10,
    textAlign: 'right',
    fontSize: 16,
    flexWrap: 'nowrap',
  },
  volume_down: {
    flex: 3.2,
    marginRight: 10,
    textAlign: 'right',
    fontSize: 12,
  },
  contentContainerStyle: {
    padding: 10,
  },
  pullText: {
    width: '80%',
    textAlign: 'center',
  },
  clickForMore: {
    padding: 15,
  },
  listContentUpper: {
    flexDirection: 'row',
    flex: 3,
    alignItems: 'baseline',
    marginTop: 10,
  },
  listContentLower: {
    flexDirection: 'row',
    flex: 2,
    alignItems: 'baseline',
    marginBottom: 10,
  },
});

const Footer = React.memo((props: { isPulling: boolean; setPulling }) => {
  const { isPulling, setPulling } = props;
  if (Platform.OS === 'web') {
    return !isPulling ? (
      <TouchableOpacity style={styles.clickForMore} onPress={() => setPulling(true)}>
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

  // refresh when getting back to this screen
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => refresh());
    return unsubscribe;
  }, [navigation]);

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
        <View style={styles.listContentUpper}>
          <View style={styles.logoContainer}>
            <Image style={styles.logo} source={{ uri: item.image }} />
          </View>
          <Text style={styles.name} numberOfLines={1}>
            {item.symbol.toUpperCase()}
          </Text>
          <Text style={styles.currentPrice} numberOfLines={1}>
            {convertNull(item.current_price).toLocaleString('en', {
              style: 'currency',
              currency: 'USD',
            })}
          </Text>
          <Text style={styles.volume} numberOfLines={1}>
            {item.total_volume.toLocaleString('en', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </Text>
        </View>
        <View style={styles.listContentLower}>
          <Text style={styles.rank} numberOfLines={1}>
            {item.market_cap_rank}
          </Text>
          <Text style={styles.fullName} numberOfLines={1}>
            {item.name}
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
          <Text style={styles.volume_down}>
            {(item.total_volume / item.current_price).toLocaleString('en', {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
            {' '}
            {item.symbol.toUpperCase()}
          </Text>
        </View>
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
            contentContainerStyle={styles.contentContainerStyle}
          />
        </View>
      )}
    </View>
  );
}

export default HomeScreen;
