import React, { useEffect, useState, useCallback } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from "react-native";
import { set } from "react-native-reanimated";
import LoadingComponent from "../components/LoadingComponent";

const Footer = React.memo((props: { isPulling: boolean; setPulling }) => {
  const { isPulling, setPulling } = props;
  if (Platform.OS === "web") {
    return !isPulling ? (
      <TouchableOpacity
        style={{ padding: 10 }}
        onPress={() => setPulling(true)}
      >
        <Text style={{ width: "80%", textAlign: "center" }}>
          click for more
        </Text>
      </TouchableOpacity>
    ) : (
      <View>
        <ActivityIndicator animating size="large" color="#0000ff" />
      </View>
    );
  }
  return !isPulling ? (
    <Text style={{ width: "100%", textAlign: "center" }}>Pull for more</Text>
  ) : (
    <View>
      <ActivityIndicator animating size="large" color="#0000ff" />
    </View>
  );
});

function HomeScreen({ navigation }) {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  // const [moreData, setMoreData] = useState([]);
  const [sortBy, setSortBy] = useState("market_cap");
  const [descending, setDescending] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [renderCount, setRenderCount] = useState(0);
  const [isPulling, setPulling] = useState(false);

  //   useEffect(() => {
  //     console.log("run1");
  //     fetch(
  //       "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=price_desc&per_page=25&page=1&sparkline=false"
  //     )
  //       .then((response) => response.json())
  //       .then((json) => setData(json))
  //       .catch((error) => console.error(error))
  //       .finally(() => setLoading(false));
  //   }, []);

  useCallback(() => {
    console.log("run2");
    setLoading(true);
    console.log("sortBy: " + sortBy + " decending" + descending);
    fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=" +
        sortBy +
        "_" +
        textOrder() +
        "&per_page=25&page=1&sparkline=false"
    )
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => console.error(error))
      .finally(() => {
        setLoading(false);
        setRenderCount(0);
      });
  }, [sortBy, descending]);

  useEffect(() => {
    if (isPulling)
      fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=" +
          sortBy +
          "_" +
          textOrder() +
          "&per_page=25&page=" +
          (renderCount + 2) +
          "&sparkline=false"
      )
        .then((response) => response.json())
        .then((json) => setData(data.concat(json)))
        .catch((error) => console.error(error))
        .finally(() => {
          setRenderCount(renderCount + 1);
          setPulling(false);
        });
  }, [isPulling]);
  const fetchMore = useCallback(() => {
    if (Platform.OS !== "web") {
      setPulling(true);
      console.log("pulling from mobile");
    } else {
      console.log("from web!");
    }
  }, []);

  const refresh = useCallback(() => {
    setRefreshing(true);
    fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=" +
        sortBy +
        "_" +
        textOrder() +
        "&per_page=25&page=1&sparkline=false"
    )
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => console.error(error))
      .finally(() => {
        setRefreshing(false);
        setRenderCount(0);
      });
  }, [sortBy]);

  const textArrow = useCallback(() => (descending ? "↓" : "↑"), [descending]);
  const textOrder = useCallback(
    () => (descending ? "desc" : "asc"),
    [descending]
  );

  const changeOrder = useCallback(
    (target) => {
      if (sortBy == target) setDescending(!descending);
      else {
        setSortBy(target);
        setDescending(true);
      }
    },
    [sortBy]
  );

  // const renderFooter = () => {
  //     return (!isPulling ?
  //         <Text style={{ width: "100%", textAlign: "center" }}>Pull for more</Text> :
  //         <View>
  //             <ActivityIndicator animating size="large" />
  //         </View>
  //     )
  // }

  const DevideLine = useCallback(() => {
    return <View style={{ height: 1, backgroundColor: "skyblue" }} />;
  }, []);

  const HeaderComponent = useCallback(
    () => (
      <View
        style={{
          backgroundColor: "white",
          flexDirection: "row",
          alignItems: "center",
          height: 50,
        }}
      >
        <TouchableOpacity
          onPress={() => changeOrder("id")}
          style={{ width: "25%" }}
        >
          <Text
            style={{
              fontWeight: sortBy == "id" ? "bold" : "normal",
              textAlign: "center",
            }}
          >
            Name {sortBy == "id" ? textArrow() : ""}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => changeOrder("price")}
          style={{ width: "25%" }}
        >
          <Text
            style={{
              fontWeight: sortBy == "price" ? "bold" : "normal",
              textAlign: "center",
            }}
          >
            Price {sortBy == "price" ? textArrow() : ""}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => changeOrder("volume")}
          style={{ width: "25%" }}
        >
          <Text
            style={{
              fontWeight: sortBy == "volume" ? "bold" : "normal",
              textAlign: "center",
            }}
          >
            Volume {sortBy == "volume" ? textArrow() : ""}
          </Text>
        </TouchableOpacity>
      </View>
    ),
    [sortBy]
  );

  return (
    <View style={{ flex: 1 }}>
      {isLoading ? (
        <LoadingComponent />
      ) : (
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <FlatList
            data={data}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={DevideLine}
            ListHeaderComponent={HeaderComponent}
            renderItem={({ item }) => (
              <View
                style={{
                  backgroundColor: "#F0FBFC",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    width: "25%",
                    textAlign: "center",
                  }}
                >
                  {item.id}
                </Text>
                <Text style={{ width: "25%", textAlign: "center" }}>
                  {item.current_price}
                </Text>
                <Text style={{ width: "25%", textAlign: "center" }}>
                  {item.total_volume}
                </Text>
                <TouchableOpacity
                  style={{
                    alignItems: "center",
                    marginLeft: 10,
                    padding: 10,
                    backgroundColor: "gray",
                  }}
                  onPress={() => navigation.navigate("Detail", { id: item.id })}
                >
                  <Text>DETAIL</Text>
                </TouchableOpacity>
              </View>
            )}
            onEndReachedThreshold={0.1}
            onEndReached={fetchMore}
            ListFooterComponent={
              <Footer isPulling={isPulling} setPulling={setPulling} />
            }
            onRefresh={refresh}
            refreshing={refreshing}
            contentContainerStyle={{ padding: 10 }}
          />
        </View>
      )}
    </View>
  );
}

export default HomeScreen;
