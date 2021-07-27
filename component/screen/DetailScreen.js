import React, { useEffect, useState } from 'react';
import { Text, View, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const DetailScreen = ({ navigation, route }) => {
    const [isLoadingCoinData, setLoadingCoinData] = useState(true);
    const [isLoadingMarketData, setLoadingMarketData] = useState(true);
    const [coinData, setCoinData] = useState([]);
    const [marketData, setMarketData] = useState([]);
    // console.log(data);
    const screenWidth = Dimensions.get("window").width;

    useEffect(() => {
        fetch('https://api.coingecko.com/api/v3/coins/' + route.params.id + '?localization=false')
            .then((response) => response.json())
            .then((json) => setCoinData(json))
            .catch((error) => console.error(error))
            .finally(() => setLoadingCoinData(false));
        fetch('https://api.coingecko.com/api/v3/coins/' + route.params.id + '/market_chart?vs_currency=usd&days=1')
            .then((response) => response.json())
            .then((json) => setMarketData(json))
            .catch((error) => console.error(error))
            .finally(() => setLoadingMarketData(false));
    }, []);

    // const chartData = {
    //     datasets: [
    //         {
    //             data: marketData.prices.map(x => x[1]),

    //             strokeWidth: 2 // optional
    //         }
    //     ],
    //     legend: [coinData.name] // optional
    // };

    const chartConfig = {
        backgroundColor: '#ADADAD',
        backgroundGradientFrom: '#ADADAD',
        backgroundGradientTo: '#ADADAD',
        color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,

        barPercentage: 0.5,
        useShadowColorFromDataset: false, // optional
        propsForDots: {
            r: "0",
            strokeWidth: "2",
        }

    };

    return (
        <View style={{ flex: 1, padding: 24 }}>
            {isLoadingCoinData || isLoadingMarketData ? <Text>Loading...</Text> :
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>Details of {coinData.name}</Text>
                    <Text>NTD ${coinData.market_data.current_price.twd}</Text>
                    <Text>USD ${coinData.market_data.current_price.usd}</Text>
                    <LineChart
                        data={{
                            datasets: [
                                {
                                    data: marketData.prices.map(x => x[1]),

                                    strokeWidth: 3 // optional
                                }
                            ],
                            legend: [coinData.name] // optional

                        }}
                        width={screenWidth - 10}
                        height={220}
                        chartConfig={chartConfig}
                        bezier

                    />
                </View>
            }</View>
    );
}
export default DetailScreen;