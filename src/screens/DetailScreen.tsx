import React, { useEffect, useState } from 'react';
import {
  Text, View, Dimensions, ActivityIndicator, TouchableOpacity,
} from 'react-native';

import { LineChart } from 'react-native-chart-kit';
import LoadingComponent from '../components/LoadingComponent';
import { ApiCoins, ApiCoinsMarketChart } from '../models/CoinGeckoAPIType';

const DetailScreen = ({ route }) => {
  const [isLoadingCoinData, setLoadingCoinData] = useState(true);
  const [isLoadingMarketData, setLoadingMarketData] = useState(true);
  const [coinData, setCoinData] = useState<ApiCoins>(null);
  const [marketData, setMarketData] = useState<ApiCoinsMarketChart>(null);
  const [dataInterval, setDataInterval] = useState(1);
  const [timeLable, setTimeLable] = useState(['24h', '18h', '12h', '6h']);
  const [average, setAverage] = useState([]);

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

  const PriceChart = () => (isLoadingMarketData ? (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator animating size="large" color="#0000ff" />
    </View>
  ) : (
    <View style={{ flex: 1 }}>
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
        height={220}
        chartConfig={chartConfig}
        bezier
        withDots={false}
        withVerticalLines={false}
        segments={8}
        formatYLabel={(x) => {
          if (Number(x) < 10) return Number(x).toFixed(6).toString();
          if (Number(x) < 1000) return Number(x).toFixed(4).toString();
          return Number(x).toFixed(0).toString();
        }}
      />
    </View>
  ));

  useEffect(() => {
    fetch(`https://api.coingecko.com/api/v3/coins/${route.params.id}?localization=false`)
      .then((response) => response.json())
      .then((json) => {
        setCoinData(json);
        console.log('loaded');
      })
      .catch((error) => console.error(error));
  }, []);

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

  useEffect(() => {
    if (coinData !== null) {
      if (coinData.error === undefined) setLoadingCoinData(false);
      else console.log('Error!');
    }
  }, [coinData]);

  // const timestampToString = (timestamp) => {
  //   const date = new Date(timestamp);
  //   const hours = date.getHours();
  //   const minutes = `0${date.getMinutes()}`;
  //   const month = date.getMonth() + 1;
  //   const day = date.getDate();
  //   return `${month}/${day}\n${hours}:${minutes.substr(-2)}`;
  // };

  return (
    <View style={{ flex: 1, padding: 24 }}>
      {isLoadingCoinData ? (
        <LoadingComponent />
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text>
            Details of
            {coinData.name}
          </Text>
          <Text>
            NTD $
            {coinData.market_data.current_price.twd}
          </Text>
          <Text>
            USD $
            {coinData.market_data.current_price.usd}
          </Text>

          <View style={{ flexDirection: 'row', paddingTop: 10, paddingBottom: 20 }}>
            <TouchableOpacity
              style={{
                backgroundColor: dataInterval === 7 ? '#198964' : '#7eb9d9',
                padding: 10,
              }}
              onPress={() => setDataInterval(7)}
            >
              <Text>7D</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: dataInterval === 3 ? '#198964' : '#7eb9d9',
                padding: 10,
              }}
              onPress={() => setDataInterval(3)}
            >
              <Text>3D</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: dataInterval === 1 ? '#198964' : '#7eb9d9',
                padding: 10,
              }}
              onPress={() => setDataInterval(1)}
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
