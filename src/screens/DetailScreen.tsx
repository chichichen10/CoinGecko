/* eslint-disable global-require */
import React, { useEffect, useState, useCallback } from 'react';
import {
  Text,
  View,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingComponent from '../components/LoadingComponent';
import { ApiCoins, ApiCoinsMarketChart } from '../models/CoinGeckoAPIType';

const styles = StyleSheet.create({
  title: { flex: 2, marginTop: '5%', flexDirection: 'row' },
  titleText: { fontSize: 28, textAlign: 'center' },
  like: { marginTop: 8, marginLeft: 5 },
  likeImage: { width: 20, height: 20 },
  chartContainer: { flex: 18 },
  chart: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  priceContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  labelText: { fontSize: 12 },
  priceText: { fontSize: 28 },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  priceDetail: {
    flex: 3,
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
  },
  timeSwitch: {
    flexDirection: 'row',
    paddingTop: 10,
    paddingBottom: 20,
  },
  priceIndicator: {
    fontSize: 28,
    padding: 3,
    color: 'white',
  },
  timeOption: {
    padding: 10,
  },
});

const DetailScreen = ({ route }) => {
  const [isLoadingCoinData, setLoadingCoinData] = useState(true);
  const [isLoadingMarketData, setLoadingMarketData] = useState(true);
  const [coinData, setCoinData] = useState<ApiCoins>(null);
  const [marketData, setMarketData] = useState<ApiCoinsMarketChart>(null);
  const [dataInterval, setDataInterval] = useState(1);
  const [timeLable, setTimeLable] = useState(['24h', '18h', '12h', '6h']);
  const [average, setAverage] = useState([]);
  const [liked, setLike] = useState(false);
  const [likedList, setLikeList] = useState([]);

  // console.log(data);
  const screenWidth = Dimensions.get('window').width;

  const chartConfig = {
    backgroundColor: '#198964',
    backgroundGradientFrom: '#eff3ff',
    backgroundGradientTo: '#efefef',
    color: (opacity = 255) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false, // optional
    propsForDots: {
      r: '1',
      strokeWidth: '2',
      stroke: '#ffa726',
    },
    propsForBackgroundLines: {
      strokeDasharray: '', // solid background lines with no dashes
    },
    decimalPlaces: 10,
  };

  const formatYLabel = useCallback((x) => {
    if (Number(x) < 10) return Number(x).toFixed(6).toString();
    if (Number(x) < 1000) return Number(x).toFixed(4).toString();
    return Number(x).toFixed(0).toString();
  }, []);

  const PriceChart = () => (isLoadingMarketData ? (
    <View style={styles.chartContainer}>
      <ActivityIndicator
        animating
        size="large"
        color="#0000ff"
        style={styles.activityIndicator}
      />
    </View>
  ) : (
    <View style={styles.chartContainer}>
      <LineChart
        data={{
          labels: timeLable,
          datasets: [
            {
              data: marketData.prices.map((x) => x[1]),
            },
            {
              data: average,
              color: (opacity = 255) => `rgba(255, 0, 0, ${opacity})`,
            },
          ],
        }}
        width={screenWidth * 0.9}
        height={440}
        chartConfig={chartConfig}
        bezier
        withDots={false}
        withVerticalLines={false}
        segments={8}
        formatYLabel={formatYLabel}
      />
    </View>
  ));

  const getLikeList = useCallback(async (id: string) => {
    try {
      const value = await AsyncStorage.getItem('liked');
      if (value !== null) {
        const list = JSON.parse(value);
        setLikeList(list);
        if (list.find((x) => x.id === id)) setLike(true);
      }
    } catch (e) {
      console.log(e);
    }
  }, []);

  useEffect(() => {
    fetch(`https://api.coingecko.com/api/v3/coins/${route.params.id}?localization=false`)
      .then((response) => response.json())
      .then((json) => {
        setCoinData(json);
        getLikeList(json.id);
      })
      .catch((error) => console.error(error))
      .finally(() => setLoadingCoinData(false));
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      if (!isLoadingCoinData && !isLoadingMarketData) {
        console.log('refresh');
        fetch(`https://api.coingecko.com/api/v3/coins/${route.params.id}?localization=false`)
          .then((response) => response.json())
          .then((json) => setCoinData(json));
        fetch(
          `https://api.coingecko.com/api/v3/coins/${route.params.id}/market_chart?vs_currency=usd&days=${dataInterval}`,
        )
          .then((response) => response.json())
          .then((json) => setMarketData(json));
        console.log(dataInterval);
      }
    }, 5000);
    return () => clearInterval(id);
  }, [isLoadingCoinData, isLoadingMarketData, dataInterval]);

  useEffect(() => {
    if (marketData != null) {
      const a = [];
      let sum = 0;
      for (let i = 0; i < marketData.prices.length; i += 1) {
        sum += marketData.prices[i][1];
      }
      sum /= marketData.prices.length;
      for (let i = 0; i < marketData.prices.length; i += 1) {
        a.push(sum);
      }
      setAverage(a);
      setLoadingMarketData(false);
    }
  }, [marketData]);

  useEffect(() => {
    switch (dataInterval) {
      case 1:
        setTimeLable(['24h', '18h', '12h', '6h']);
        break;
      case 3:
        setTimeLable(['3d', '2d', '1d']);
        break;
      case 7:
        setTimeLable(['7d', '6d', '5d', '4d', '3d', '2d', '1d']);
        break;
      default:
        setTimeLable([]);
    }
  }, [dataInterval]);

  useEffect(() => {
    setLoadingMarketData(true);
    fetch(
      `https://api.coingecko.com/api/v3/coins/${route.params.id}/market_chart?vs_currency=usd&days=${dataInterval}`,
    )
      .then((response) => response.json())
      .then((json) => {
        setMarketData(json);
      })
      .catch((error) => console.error(error));
  }, [timeLable]);

  const handleDataInterval = useCallback((days) => () => setDataInterval(days), []);

  const PriceDetail = () => (isLoadingCoinData ? (
    <View>
      <Text>Loading...</Text>
    </View>
  ) : (
    <View style={styles.priceDetail}>
      <View style={styles.priceContainer}>
        <Text style={styles.labelText}>USD $</Text>
        <Text style={styles.priceText}>{coinData.market_data.current_price.usd}</Text>
      </View>
      <View style={styles.priceContainer}>
        <Text style={styles.labelText}>Last 24H</Text>
        <Text
          style={[
            {
              backgroundColor:
                  coinData.market_data.price_change_percentage_24h_in_currency.usd >= 0
                    ? 'red'
                    : 'green',
            },
            styles.priceIndicator,
          ]}
        >
          {coinData.market_data.price_change_percentage_24h_in_currency.usd >= 0 ? '+' : ''}
          {coinData.market_data.price_change_percentage_24h_in_currency.usd.toFixed(2)}
          %
        </Text>
      </View>
    </View>
  ));

  const handlePressLike = useCallback(async () => {
    const updatedList = likedList;
    if (!liked) {
      updatedList.push({ id: coinData.id, image: coinData.image.small, symbol: coinData.symbol });
      setLikeList(updatedList);
    } else {
      const index = updatedList.findIndex((x) => x.id === coinData.id);
      updatedList.splice(index, 1);
      setLikeList(updatedList);
      // todo
    }
    try {
      const jsonValue = JSON.stringify(updatedList);
      await AsyncStorage.setItem('liked', jsonValue);
    } catch (e) {
      console.log(e);
    }
    setLike(!liked);
  }, [liked, likedList]);

  const likeImageSrc = liked ? require('../assets/like.png') : require('../assets/heart.png');

  return (
    <View style={styles.container}>
      {isLoadingCoinData ? (
        <LoadingComponent />
      ) : (
        <View style={styles.container}>
          <View style={styles.title}>
            <Text style={styles.titleText}>{coinData.name}</Text>
            <TouchableOpacity style={styles.like} onPress={handlePressLike}>
              <Image source={likeImageSrc} style={styles.likeImage} />
            </TouchableOpacity>
          </View>
          <PriceDetail />
          <View style={styles.timeSwitch}>
            <TouchableOpacity
              style={[
                {
                  backgroundColor: dataInterval === 7 ? '#198964' : '#7eb9d9',
                },
                styles.timeOption,
              ]}
              onPress={handleDataInterval(7)}
            >
              <Text>7D</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                {
                  backgroundColor: dataInterval === 3 ? '#198964' : '#7eb9d9',
                },
                styles.timeOption,
              ]}
              onPress={handleDataInterval(3)}
            >
              <Text>3D</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                {
                  backgroundColor: dataInterval === 1 ? '#198964' : '#7eb9d9',
                },
                styles.timeOption,
              ]}
              onPress={handleDataInterval(1)}
            >
              <Text>24H</Text>
            </TouchableOpacity>
          </View>
          <PriceChart />
        </View>
      )}
    </View>
  );
};
export default DetailScreen;
