import React, {useContext} from 'react';
import {View} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {HomeScreen} from './../Screens/Home';
import {Profile} from './../Screens/Profile';
import {DetailsScreen} from './../Screens/Details';
import {AuthContext} from './AuthProvider';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();


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
                                size={30}
                                color={Constant.colors.whiteColor}
                                onPress={() => logout()}
                            />
                        </View>
                    )
                }}
            />

            <Stack.Screen
                name={'DETAILS'}
                component={DetailsScreen}
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
                                size={30}
                                color={Constant.colors.whiteColor}
                                onPress={() => logout()}
                            />
                        </View>
                    ),
                    headerLeft: () => (
                        <View style={{marginLeft: 10}}>
                            <MaterialCommunityIcons
                                name="arrow-left"
                                size={30}
                                color={Constant.colors.whiteColor}
                                onPress={() => navigation.navigate('HOME')}
                            />
                        </View>
                    ),

                }}
            />

        </Stack.Navigator>
    );
};

const ProfileStack = ({navigation}) => {
    const {logout} = useContext(AuthContext);
    return (
        <Stack.Navigator>
            <Stack.Screen
                name={'PROFILE'}
                component={Profile}
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
                                size={30}
                                color={Constant.colors.whiteColor}
                                onPress={() => logout()}
                            />
                        </View>
                    )
                }}
            />

        </Stack.Navigator>
    );
}

const AppStack = () => {


    return (
        <Tab.Navigator
            tabBarOptions={{
                activeTintColor: Constant.colors.blueColor,
            }}>
            <Tab.Screen
                name="Home"
                component={HomeStack}
                options={({route}) => ({
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
