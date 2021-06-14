import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import {
  Provider as PaperProvider,
  DefaultTheme,
  withTheme,
} from 'react-native-paper';
import { DarkTheme } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import SplashScreen from 'react-native-splash-screen';

import Home from '../screens/Home';
import CreateEditForm from '../screens/CreateEditForm';
import file from '../screens/file';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'tomato',
    background: 'rgb(242, 242, 242)',
    accent: 'yellow',
    success: 'green',
  },
};

const Stack = createStackNavigator();

function MainStackNavigator() {
  useEffect(() => {
    SplashScreen.hide();
  });
  return (
      <PaperProvider theme={theme}>
        <StatusBar backgroundColor="#000000" barStyle="light-content" />

        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
              // gestureDirection: 'horizontal',
              gestureEnabled: true,
              headerMode: 'float',
              cardStyle: { backgroundColor: '#2b2b39' },
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              headerStyle: {
        backgroundColor: '#BDB76B', //TODO //DarkKhaki
      },
      headerTitleStyle: {
        fontWeight: 'bold',
        color: '#B22222', //FireBrick
      },
              headerTintColor: '#fff',
              headerBackTitleVisible: false,
            }}
            headerMode="float">
            <Stack.Screen
              name="Home"
              component={Home}
              options={{
                // headerShown: false,
                title: 'Password Manager',
              }}
            // screenOptions={{
            //   headerStyle: {
            //     backgroundColor: theme.colors.primary,
            //   },
            //   headerTitleStyle: {
            //     fontWeight: 'bold',
            //   },
            //   headerTintColor: '#fff',
            // }}

            />
         

          <Stack.Screen
            name="HelloForm"
            component={CreateEditForm}
            options={{ title: 'Create/EditForm' }}
            screenOptions={{
              gestureResponseDistance: 'horizontal',
              gestureEnabled: true,
              headerBackTitleVisible: false,
              backgroundColor: 'red',
            }}
          />

          <Stack.Screen
            name="file"
            component={file}
            options={{
              // headerShown: false,
              title: 'File Manager',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

export default withTheme(MainStackNavigator);
