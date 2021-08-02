import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  Dimensions,
  ActivityIndicator,
  Platform,
  TouchableOpacity,
} from "react-native";
import LoadingComponent from "../../src/components/LoadingComponent";
import { API_Coins, API_Coins_MarketChart } from "../models/CoinGeckoAPIType";
import { LineChart } from "react-native-chart-kit";

const DetailScreen = ({ navigation, route }) => {
  const [isLoadingCoinData, setLoadingCoinData] = useState(true);
  const [isLoadingMarketData, setLoadingMarketData] = useState(true);
  const [coinData, setCoinData] = useState<API_Coins>(null);
  const [marketData, setMarketData] = useState<API_Coins_MarketChart>(null);
  const [dataInterval, setDataInterval] = useState(1);
  const [timeLable, setTimeLable] = useState(["24h", "18h", "12h", "6h"]);

  // console.log(data);
  const screenWidth = Dimensions.get("window").width;

  const PriceChart = () => {
    return isLoadingMarketData ? (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
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
            ],
          }}
          width={screenWidth * 0.9}
          height={220}
          chartConfig={chartConfig}
          bezier
        />
      </View>
    );
  };

  useEffect(() => {
    fetch(
      "https://api.coingecko.com/api/v3/coins/" +
        route.params.id +
        "?localization=false"
    )
      .then((response) => response.json())
      .then((json) => setCoinData(json))
      .catch((error) => console.error(error))
      .finally(() => setLoadingCoinData(false));
  }, []);

  useEffect(() => {
    switch (dataInterval) {
      case 1:
        setTimeLable(["24h", "18h", "12h", "6h"]);
        break;
      case 2:
        setTimeLable(["3d", "2d", "1d"]);
        break;
      case 3:
        setTimeLable(["7d", "6d", "5d", "4d", "3d", "2d", "1d"]);
        break;
      default:
        setTimeLable([]);
    }
  }, [dataInterval]);

  useEffect(() => {
    setLoadingMarketData(true);
    fetch(
      "https://api.coingecko.com/api/v3/coins/" +
        route.params.id +
        "/market_chart?vs_currency=usd&days=" +
        dataInterval
    )
      .then((response) => response.json())
      .then((json) => setMarketData(json))
      .catch((error) => console.error(error))
      .finally(() => setLoadingMarketData(false));
  }, [timeLable]);

  const timestampToString = (timestamp) => {
    var date = new Date(timestamp);
    var hours = date.getHours();
    var minutes = "0" + date.getMinutes();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    return month + "/" + day + "\n" + hours + ":" + minutes.substr(-2);
  };
  const chartConfig = {
    backgroundColor: "#198964",
    backgroundGradientFrom: "#eff3ff",
    backgroundGradientTo: "#efefef",
    color: (opacity = 255) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false, // optional
    propsForDots: {
      r: "0",
      strokeWidth: "2",
      stroke: "#ffa726",
    },
  };

  return (
    <View style={{ flex: 1, padding: 24 }}>
      {isLoadingCoinData ? (
        <LoadingComponent />
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text>Details of {coinData.name}</Text>
          <Text>NTD ${coinData.market_data.current_price.twd}</Text>
          <Text>USD ${coinData.market_data.current_price.usd}</Text>

          <View
            style={{ flexDirection: "row", paddingTop: 10, paddingBottom: 20 }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: dataInterval === 7 ? "#198964" : "#7eb9d9",
                padding: 10,
              }}
              onPress={() => setDataInterval(7)}
            >
              <Text>7D</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: dataInterval === 3 ? "#198964" : "#7eb9d9",
                padding: 10,
              }}
              onPress={() => setDataInterval(3)}
            >
              <Text>3D</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: dataInterval === 1 ? "#198964" : "#7eb9d9",
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
