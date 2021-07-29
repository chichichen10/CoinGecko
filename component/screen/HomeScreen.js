import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { set } from 'react-native-reanimated';
import LoadingComponent from '../LoadingComponent'

function HomeScreen({ navigation }) {
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    // const [moreData, setMoreData] = useState([]);
    const [sortBy, setSortBy] = useState("price");
    const [descending, setDescending] = useState(true);
    // const [refreshing, setRefreshing] = useState(false);
    const [renderCount, setRenderCount] = useState(0);
    const [isPulling, setPulling] = useState(false);

    useEffect(() => {
        fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=price_desc&per_page=25&page=1&sparkline=false')
            .then((response) => response.json())
            .then((json) => setData(json))
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        setLoading(true);
        console.log("sortBy: " + sortBy + " decending" + descending);
        fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=' + sortBy + '_' + textOrder() + '&per_page=25&page=1&sparkline=false')
            .then((response) => response.json())
            .then((json) => setData(json))
            .catch((error) => console.error(error))
            .finally(() => { setLoading(false); setRenderCount(0); });
    }, [sortBy, descending]);

    useEffect(() => {
        if (isPulling)
            fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=' + sortBy + '_' + textOrder() + '&per_page=25&page=' + (renderCount + 2) + '&sparkline=false')
                .then((response) => response.json())
                .then((json) => setData(data.concat(json)))
                .catch((error) => console.error(error))
                .finally(() => { setRenderCount(renderCount + 1); setPulling(false) });
    }, [isPulling]);
    const fetchMore = () => {
        setPulling(true);
        console.log("pulling");
    }

    const textArrow = () => descending ? "↓" : "↑";
    const textOrder = () => descending ? "desc" : "asc";

    const changeOrder = (target) => {
        if (sortBy == target) setDescending(!descending);
        else {
            setSortBy(target);
            setDescending(true);
        }

    }

    const renderFooter = () => {
        return (!isPulling ?
            <Text style={{ width: "100%", textAlign: "center" }}>Pull for more</Text> :
            <View>
                <ActivityIndicator animating size="large" />
            </View>
        )
    }

    const DevideLine = () => {
        return (
            <View style={{ height: 1, backgroundColor: 'skyblue' }} />
        )
    }



    return (

        <View style={{ flex: 1, padding: 24 }}>
            {isLoading ? <LoadingComponent /> :
                (<View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
                    <FlatList
                        data={data}
                        keyExtractor={(item, index) => index.toString()}
                        ItemSeparatorComponent={DevideLine}
                        ListHeaderComponent={() => (
                            <View style={{ backgroundColor: "white", flexDirection: "row", alignItems: "center", height: 50 }}>
                                <TouchableOpacity onPress={() => changeOrder("id")} style={{ width: "25%", textAlign: "center" }}><Text style={{ fontWeight: sortBy == "id" ? "bold" : "normal", textAlign: "center" }}>Name {sortBy == "name" ? textArrow() : ""}</Text></TouchableOpacity>
                                <TouchableOpacity onPress={() => changeOrder("price")} style={{ width: "25%", textAlign: "center" }}><Text style={{ fontWeight: sortBy == "price" ? "bold" : "normal", textAlign: "center" }}>Price {sortBy == "price" ? textArrow() : ""}</Text></TouchableOpacity>
                                <TouchableOpacity onPress={() => changeOrder("volume")} style={{ width: "25%", textAlign: "center" }}><Text style={{ fontWeight: sortBy == "volume" ? "bold" : "normal", textAlign: "center" }}>Volume {sortBy == "volume" ? textArrow() : ""}</Text></TouchableOpacity>
                            </View>
                        )}
                        renderItem={({ item }) => (
                            <View style={{ backgroundColor: "#F0FBFC", flexDirection: "row", alignItems: "center" }}>
                                <Text style={{ fontWeight: "bold", width: "25%", textAlign: "center" }}>{item.name}</Text>
                                <Text style={{ width: "25%", textAlign: "center" }}>{item.current_price}</Text>
                                <Text style={{ width: "25%", textAlign: "center" }}>{item.total_volume}</Text>
                                <TouchableOpacity style={{ alignItems: "center", marginLeft: 10, padding: 10, backgroundColor: "gray" }} onPress={() => navigation.navigate("Detail", { id: item.id })}><Text>DETAIL</Text></TouchableOpacity>
                            </View>
                        )}
                        onEndReachedThreshold={-0.1}
                        onEndReached={fetchMore}
                        ListFooterComponent={renderFooter}
                    />
                </View>
                )}
        </View>
    );
}


export default HomeScreen;