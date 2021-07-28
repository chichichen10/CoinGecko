import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

function HomeScreen({ navigation }) {
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    // const [moreData, setMoreData] = useState([]);
    const [sortBy, setSortBy] = useState("price");
    const [descending, setDescending] = useState(true);
    // const [refreshing, setRefreshing] = useState(false);
    const [renderCount, setRenderCount] = useState(0);

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
            .finally(() => { setLoading(false) });
    }, [sortBy, descending]);

    const fetchMore = () => {
        fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=' + sortBy + '_' + textOrder() + '&per_page=25&page=' + (renderCount + 2) + '&sparkline=false')
            .then((response) => response.json())
            .then((json) => setData(data.concat(json)))
            .catch((error) => console.error(error))
            .finally(() => { setRenderCount(renderCount + 1) });
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

    const DevideLine = () => {
        return (
            <View style={{ height: 1, backgroundColor: 'skyblue' }} />
        )
    }



    return (

        <View style={{ flex: 1, padding: 24 }}>
            {isLoading ? <Text>Loading...</Text> :
                (<View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
                    <FlatList
                        data={data}
                        keyExtractor={(item) => item.id}
                        ItemSeparatorComponent={DevideLine}
                        ListHeaderComponent={() => (
                            <View style={{ backgroundColor: "white", flexDirection: "row", alignItems: "center", height: 50 }}>
                                <TouchableOpacity onPress={() => changeOrder("id")} style={{ width: "25%", textAlign: "center" }}><Text style={{ fontWeight: sortBy == "id" ? "bold" : "normal", textAlign: "center" }}>Name {sortBy == "name" ? textArrow() : ""}</Text></TouchableOpacity>
                                <TouchableOpacity onPress={() => changeOrder("price")} style={{ width: "25%", textAlign: "center" }}><Text style={{ fontWeight: sortBy == "price" ? "bold" : "normal", textAlign: "center" }}>Price {sortBy == "price" ? textArrow() : ""}</Text></TouchableOpacity>
                                <TouchableOpacity onPress={() => changeOrder("volumn")} style={{ width: "25%", textAlign: "center" }}><Text style={{ fontWeight: sortBy == "volumn" ? "bold" : "normal", textAlign: "center" }}>Volumn {sortBy == "volumn" ? textArrow() : ""}</Text></TouchableOpacity>
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
                    // onRefresh={fetchMore()}
                    // extraData={renderCount}
                    />
                </View>
                )}
        </View>
    );
}


export default HomeScreen;