import React, { useEffect, useState } from 'react';
import { Text, View, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const DetailScreen = ({ navigation, route }) => {
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    // console.log(data);
    const screenWidth = Dimensions.get("window").width;

    useEffect(() => {
        fetch('https://api.coingecko.com/api/v3/coins/' + route.params.id + '?localization=false')
            .then((response) => response.json())
            .then((json) => setData(json))
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    }, []);

    const chartData = {
        labels: ["January", "February", "March", "April", "May", "June"],
        datasets: [
            {
                data: [20, 45, 28, 80, 99, 43],
                color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
                strokeWidth: 2 // optional
            }
        ],
        legend: ["Rainy Days"] // optional
    };

    const chartConfig = {
        backgroundColor: 'black',
        color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
        strokeWidth: 2, // optional, default 3
        barPercentage: 0.5,
        useShadowColorFromDataset: false // optional
    };

    return (
        <View style={{ flex: 1, padding: 24 }}>
            {isLoading ? <Text>Loading...</Text> :
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>Details of {data.name}</Text>
                    <Text>NTD ${data.market_data.current_price.twd}</Text>
                    <Text>USD ${data.market_data.current_price.usd}</Text>
                    {/* <LineChart
                        data={chartData}
                        width={screenWidth}
                        height={220}
                        chartConfig={chartConfig}
                    /> */}
                </View>
            }</View>
    );
}
export default DetailScreen;