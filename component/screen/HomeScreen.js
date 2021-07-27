import React, { useEffect, useState } from 'react';
import { Button, FlatList, StyleSheet, Text, View, TouchableOpacity } from 'react-native';


function HomeScreen({ navigation }) {
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    // console.log(data);

    useEffect(() => {
        fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false')
            .then((response) => response.json())
            .then((json) => setData(json))
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    }, []);

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
                        keyExtractor={({ id }, index) => id}
                        ItemSeparatorComponent={DevideLine}
                        ListHeaderComponent={() => (
                            <View style={{ backgroundColor: "white", flexDirection: "row", alignItems: "center" }}>
                                <Text style={{ fontWeight: "bold", width: "25%", textAlign: "center" }}>Name</Text>
                                <Text style={{ width: "25%", textAlign: "center" }}>Price</Text>
                                <Text style={{ width: "25%", textAlign: "center" }}>Volumn</Text>
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
                    />
                </View>
                )}
        </View>
    );
}


export default HomeScreen;