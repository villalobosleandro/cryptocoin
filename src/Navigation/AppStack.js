import React, {useContext} from 'react';
import {View} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';

import {HomeScreen} from './../Screens/Home';
import {History} from './../Screens/History';
import {Profile} from './../Screens/Profile';
import {DetailsScreen} from './../Screens/Details';
import {AuthContext} from './AuthProvider';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();


const HomeStack = ({navigation}) => {
    const {logout} = useContext(AuthContext);
    return (
        <Stack.Navigator>
            <Stack.Screen
                name={'HOME'}
                component={HomeScreen}
                options={{
                    headerTitleAlign: 'center',
                    headerTitleStyle: {
                        color: Constant.colors.whiteColor,
                        fontSize: 18,
                    },
                    headerStyle: {
                        backgroundColor: Constant.colors.blueColor,
                        elevation: 0
                    },
                    headerRight: () => (
                        <View style={{marginRight: 10}}>
                            <MaterialCommunityIcons
                                name="logout"
                                size={24}
                                // backgroundColor="#fff"
                                color={Constant.colors.whiteColor}
                                onPress={() => logout()}
                            />
                        </View>
                    ),
                }}
            />

            <Stack.Screen
                name={'Details'}
                component={DetailsScreen}
                options={{
                    // headerTitleAlign: 'center',
                    // headerTitleStyle: {
                    //     color: '#2e64e5',
                    //     fontFamily: 'Kufam-SemiBoldItalic',
                    //     fontSize: 18,
                    // },
                    headerStyle: {
                        backgroundColor: Constant.colors.blueColor,
                    },
                    headerRight: () => (
                        <View style={{marginRight: 10}}>
                            <MaterialCommunityIcons
                                name="logout"
                                size={22}
                                backgroundColor="#fff"
                                color="#2e64e5"
                                onPress={() => logout()}
                            />
                        </View>
                    ),
                }}
            />

        </Stack.Navigator>
    );
}

const HistoryStack = ({navigation}) => (
    <Stack.Navigator>
        <Stack.Screen name="History" component={History} />
        <Stack.Screen
            name={'historial'}
            component={History}
            options={{header: () => null}}
        />
    </Stack.Navigator>
);

const ProfileStack = ({navigation}) => (
    <Stack.Navigator>
        <Stack.Screen
            name={'profile'}
            component={Profile}
            options={{header: () => null}}
        />

    </Stack.Navigator>
);

const AppStack = () => {

    // return (
    //
    //     <Drawer.Navigator initialRouteName="HomeScreen">
    //         <Drawer.Screen name="Home" component={HomeScreen} />
    //         <Drawer.Screen name="History" component={History} />
    //         <Drawer.Screen name="Profile" component={Profile} />
    //     </Drawer.Navigator>
    //
    // );

    return (
        <Tab.Navigator
            tabBarOptions={{
                activeTintColor: Constant.colors.blueColor,
            }}>
            <Tab.Screen
                name="Home"
                component={HomeStack}
                options={({route}) => ({
                    // tabBarLabel: 'Home',
                    // headerStyle: {
                    //     backgroundColor: '#f4511e',
                    // },
                    // headerStyle: {
                    //
                    //     backgroundColor: '#f75af7',
                    //     elevation: 0,
                    // },
                    tabBarIcon: ({color, size}) => (
                        <MaterialCommunityIcons
                            name="home-outline"
                            color={color}
                            size={size}
                        />
                    ),
                })}
            />
            <Tab.Screen
                name="History"
                component={HistoryStack}
                options={({route}) => ({
                    tabBarIcon: ({color, size}) => (
                        <MaterialCommunityIcons
                            name="history"
                            color={color}
                            size={size}
                        />
                    ),
                })}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileStack}
                options={{
                    tabBarIcon: ({color, size}) => (
                        <MaterialCommunityIcons
                            name="account-outline"
                            color={color}
                            size={size}
                        />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

export default AppStack;
