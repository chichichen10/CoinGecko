/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable camelcase */
import 'react-native-gesture-handler';
import * as React from 'react';
import { Button } from 'react-native';
// import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {
  useFonts,
  RobotoCondensed_400Regular,
  RobotoCondensed_700Bold,
} from '@expo-google-fonts/roboto-condensed';
import AppLoading from 'expo-app-loading';
import HomeScreen from './src/screens/HomeScreen';
import DetailScreen from './src/screens/DetailScreen';
// import DrawerContent from './src/screens/DrawerContent';
import MoreScreen from './src/screens/MoreScreen';

const Stack = createStackNavigator();

// const styles = StyleSheet.create({
//   drawer: {
//     width: 180,
//   },
// });

export default function App() {
  const [fontsLoaded] = useFonts({
    RobotoCondensed_400Regular,
    RobotoCondensed_700Bold,
  });

  // const Home = useCallback(
  //   () => (
  //     <Drawer.Navigator
  //       screenOptions={{ drawerStyle: styles.drawer }}
  //       drawerContent={(props) => <DrawerContent {...props} />}
  //     >
  // <Drawer.Screen name="HomeScreen" component={HomeScreen} options={{ title: 'Overview' }} />
  //     </Drawer.Navigator>
  //   ),
  //   [],
  // );

  if (!fontsLoaded) {
    return <AppLoading />;
  }
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Group>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={({ navigation }) => ({
              headerRight: () => (
                <Button onPress={() => navigation.navigate('More')} title="More" />
              ),
            })}
          />
          <Stack.Screen name="Detail" component={DetailScreen} />
        </Stack.Group>
        <Stack.Group screenOptions={{ presentation: 'modal' }}>
          <Stack.Screen name="More" component={MoreScreen} />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
