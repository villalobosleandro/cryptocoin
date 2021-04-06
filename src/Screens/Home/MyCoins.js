import React from 'react';
import { FlatList } from 'react-native';
import {Layout, ListItem, Text} from '@ui-kitten/components';
import {Badge} from "native-base";

const data = [
    {
        symbol: 'BTC',
        price: 1.1542
    },
    {
        symbol: 'BTC',
        price: 1.1542
    },
    {
        symbol: 'BTC',
        price: 1.1542
    },
    {
        symbol: 'BTC',
        price: 1.1542
    },
    {
        symbol: 'BTC',
        price: 1.1542
    },
    {
        symbol: 'BTC',
        price: 1.1542
    },
    {
        symbol: 'BTC',
        price: 1.1542
    }
];
const data2 = [];

export const MyCoins = props => {

    const {userLogged } = props;


    const generateRandomColor = () => {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    const renderItem = ({ item, index }) => {
        // console.log('\x1b[1;34m', 'LOG: item', item);

        return (
            <ListItem
                title={`${item.name}`}
                description={`${item.amount}`}
                style={{
                    width: 100,
                    borderWidth: 1,
                    margin: 5,
                    borderColor: generateRandomColor()
                }}
            />
        );
    };

    const renderEmptyList = () => (
        <Layout style={{height: 30, justifyContent: 'center', alignSelf: 'stretch', paddingHorizontal: 10}}>
            <Text>No tienes monedas</Text>
        </Layout>

    );

    return(
        <Layout style={{height: 100, alignItems: 'center'}}>
            <FlatList
                horizontal
                data={userLogged.coins}
                renderItem={renderItem}
                ListEmptyComponent={renderEmptyList}
                keyExtractor={(item, index) => index.toString()}
            />



        </Layout>
    )
}
