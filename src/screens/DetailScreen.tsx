import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  Dimensions,
  ActivityIndicator,
  Platform,
} from "react-native";
import {
  VictoryLine,
  VictoryChart,
  VictoryTheme,
  VictoryAxis,
} from "victory-native";
import LoadingComponent from "../../src/components/LoadingComponent";
import { API_Coins, API_Coins_MarketChart } from "../models/CoinGeckoAPIType";
import { LineChart } from "react-native-chart-kit";

const DetailScreen = ({ navigation, route }) => {
  const [isLoadingCoinData, setLoadingCoinData] = useState(true);
  const [isLoadingMarketData, setLoadingMarketData] = useState(true);
  const [coinData, setCoinData] = useState<API_Coins>(null);
  const [marketData, setMarketData] = useState<API_Coins_MarketChart>(null);
  // console.log(data);
  const screenWidth = Dimensions.get("window").width;

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
    fetch(
      "https://api.coingecko.com/api/v3/coins/" +
        route.params.id +
        "/market_chart?vs_currency=usd&days=1"
    )
      .then((response) => response.json())
      .then((json) => setMarketData(json))
      .catch((error) => console.error(error))
      .finally(() => setLoadingMarketData(false));
  }, []);

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
      {isLoadingCoinData || isLoadingMarketData ? (
        <LoadingComponent />
      ) : (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>Details of {coinData.name}</Text>
          <Text>NTD ${coinData.market_data.current_price.twd}</Text>
          <Text>USD ${coinData.market_data.current_price.usd}</Text>
          <View style={{ flex: 1 }}>
            {/* <VictoryChart width={350} theme={VictoryTheme.material}>
                            <VictoryAxis dependentAxis />

                            <VictoryLine data={marketData.prices.map(x => ({ time: x[0], price: x[1] }))} x="time" y="price" interpolation="natural" />
                            <VictoryAxis tickCount={5} tickFormat={(t) => timestampToString(t)} />
                        </VictoryChart> */}
            <LineChart
              data={{
                labels: ["24h", "18h", "12h", "6h"],
                datasets: [
                  {
                    data: marketData.prices.map((x) => x[1]),
                  },
                ],
              }}
              width={screenWidth}
              height={220}
              chartConfig={chartConfig}
              bezier
            />
          </View>
        </View>
      )}
    </View>
  );
};
export default DetailScreen;