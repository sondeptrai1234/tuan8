import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { store, useAppDispatch, useAppSelector } from './src/store';
import { restoreSession } from './src/store/authSlice';
import { RootStackParamList } from './src/navigation/types';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import BookDetailScreen from './src/screens/BookDetailScreen';
import CartScreen from './src/screens/CartScreen';
import CheckoutScreen from './src/screens/CheckoutScreen';
import { colors, fonts } from './src/theme';
const Stack = createNativeStackNavigator<RootStackParamList>();

function Root() {
  const dispatch = useAppDispatch();
  const restoring = useAppSelector((s) => s.auth.restoring);

  useEffect(() => {
    dispatch(restoreSession()); // auto-login khi mở app
  }, [dispatch]);

  if (restoring) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
  screenOptions={{
    headerStyle: { backgroundColor: colors.paper },
    headerShadowVisible: false,
    headerTintColor: colors.ink,
    headerTitleStyle: { fontFamily: fonts.serif, fontWeight: '700' },
    contentStyle: { backgroundColor: colors.paper },
  }}
>
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'BookStore' }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Đăng nhập' }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Đăng ký' }} />
        <Stack.Screen name="BookDetail" component={BookDetailScreen} options={{ title: 'Chi tiết sách' }}/>
        <Stack.Screen name="Cart" component={CartScreen} options={{ title: 'Giỏ hàng' }} />
<Stack.Screen name="Checkout" component={CheckoutScreen} options={{ title: 'Thanh toán' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <Root />
    </Provider>
  );
}