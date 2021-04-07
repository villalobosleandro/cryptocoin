import React from 'react';
import {Image, TouchableOpacity, StyleSheet } from 'react-native';
import {
    List,
    Layout,
    Text,
} from '@ui-kitten/components';


export const ListCoins = (props) => {

    const { data, userLogged, navigation } = props;

    const renderItem = ({ item, index }) => {

        let name = '';
        let img = '';
        let typeTransaction = '';

        let high = item.high24hour;
        high = high.replace('$ ', '');
        high = high.replace(',', '.');
        high = (parseFloat(high)).toFixed(2);

        let low = item.low24hour;
        low = low.replace('$ ', '');
        low = low.replace(',', '.');
        low = (parseFloat(low)).toFixed(2);

        let diff = (((high - low) / low) * 100).toFixed(2);

        if(diff > high) {
            //aumento
            typeTransaction = 'aumento';
        }else {
            //reduccion
            typeTransaction = 'reduccion';
        }

        switch (item.name) {
            case 'BTC':
                name = 'Bitcoin';
                img = Constant.image.bitcoin;
                break;

            case 'ETH':
                name = 'Etherum';
                img = Constant.image.etherum;
                break;

            case 'XRP':
                name = 'Ripple';
                img = Constant.image.ripple;
                break;

            case 'BCH':
                name = 'Bitcoin Cash';
                img = Constant.image.bitcoinCash;
                break;

            case 'ADA':
                name = 'Cardano';
                img = Constant.image.cardano;
                break;

            case 'LTC':
                name = 'Litecoin';
                img = Constant.image.litecoin;
                break;

            case 'XEM':
                name = 'NEM';
                img = Constant.image.nem;
                break;

            case 'XLM':
                name = 'Stellar';
                img = Constant.image.stellar;
                break;

            case 'EOS':
                name = 'EOS';
                img = Constant.image.eos;
                break;

            case 'NEO':
                name = 'NEO';
                img = Constant.image.neo;
                break;

            default:
                name = item.name;
                img = 'https://images.unsplash.com/photo-1519995451813-39e29e054914?ixid=MXwxMjA3fDB8MHxzZWFyY2h8NDJ8fGJpdGNvaW4lMjBpY29ufGVufDB8fDB8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=60';
                break;
        }

        return (
            <TouchableOpacity
                onPress={() => {
                    navigation.navigate('DETAILS', {
                        item: item,
                        userLogged: userLogged,
                        image: img
                    });

                }}
            >
                <Layout style={styles.renderItemContainer}>
                    <Layout style={styles.column1}>
                        <Image
                            source={img}
                            style={{width: 40, height: 40, borderRadius: 20}}
                        />
                    </Layout>

                    <Layout style={styles.column1}>
                        <Text>{name}</Text>
                        <Text>{item.name}</Text>
                    </Layout>

                    <Layout style={styles.column1}>
                        <Text status={typeTransaction === 'aumento' ? 'success' : 'danger'}>{`%${diff}`}</Text>
                    </Layout>

                    <Layout style={styles.column1}>
                        <Text>{item.price}</Text>
                    </Layout>


                </Layout>
            </TouchableOpacity>
        );
    };

    return(
        <Layout style={styles.container}>
            <List
                data={data}
                renderItem={renderItem}
            />
        </Layout>

    )
};

const styles = StyleSheet.create({
   container: {
       flex: 2,
       backgroundColor: '#151515',
       alignSelf: 'stretch'
   },
    renderItemContainer: {
        flexDirection: 'row',
        alignSelf: 'stretch',
        height: 70,
        alignItems: 'center',
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#616161',
    },
    column1: {
       flex: 1
    }
});



