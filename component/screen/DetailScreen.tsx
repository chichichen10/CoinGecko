import React, { useEffect, useState } from 'react';
import { Text, View, Dimensions, ActivityIndicator, Platform } from 'react-native';
import { VictoryLine, VictoryChart, VictoryTheme, VictoryAxis } from "victory-native";
import LoadingComponent from '../LoadingComponent';


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



    const timestampToString = (timestamp) => {
        var date = new Date(timestamp);
        var hours = date.getHours();
        var minutes = "0" + date.getMinutes();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        return month + '/' + day + '\n' + hours + ':' + minutes.substr(-2);

    }

    return (
        <View style={{ flex: 1, padding: 24 }}>
            {isLoadingCoinData || isLoadingMarketData ? <LoadingComponent /> :
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>Details of {coinData.name}</Text>
                    <Text>NTD ${coinData.market_data.current_price.twd}</Text>
                    <Text>USD ${coinData.market_data.current_price.usd}</Text>
                    <View lable={"price"}>
                        <VictoryChart width={350} theme={VictoryTheme.material}>
                            <VictoryAxis dependentAxis />

                            <VictoryLine data={marketData.prices.map(x => ({ time: x[0], price: x[1] }))} x="time" y="price" interpolation="natural" />
                            <VictoryAxis tickCount={5} tickFormat={(t) => timestampToString(t)} />
                        </VictoryChart>
                    </View>
                </View>
            }</View>
    );
}
export default DetailScreen;