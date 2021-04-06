import React, {useContext, useEffect, useState} from 'react';
import {Image, Dimensions, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import {
    List,
    ListItem,
    Layout,
    Text,
    Button,
    Modal,
    Input, Icon,
} from '@ui-kitten/components';
import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
} from "react-native-chart-kit";

export const ListCoins = (props) => {

    const { data, userLogged, getInfoUser, navigation } = props;

    const renderItem = ({ item, index }) => {

        let name = '';
        let img = '';

        const chartConfig = {
            backgroundGradientFrom: "#b41d35",
            backgroundGradientFromOpacity: 0,
            backgroundGradientTo: "rgba(28,0,14,0.97)",
            backgroundGradientToOpacity: 0.5,
            color: (opacity = 1) => `rgba(75, 181, 67, ${opacity})`,//este es el color del chart
            // strokeWidth: 2, // optional, default 3
            barPercentage: 0.5,
            // useShadowColorFromDataset: false // optional
        };

        let l = item.openDay;
        l = l.replace('$ ', '');
        l = l.replace(',', '.');
        l = parseFloat(l);

        let m = item.highDay;
        m = m.replace('$ ', '');
        m = m.replace(',', '.');
        m = parseFloat(m);


        let n = item.lowDay;
        n = n.replace('$ ', '');
        n = n.replace(',', '.');
        n = parseFloat(n);

        let o = item.open24hour;
        o = o.replace('$ ', '');
        o = o.replace(',', '.');
        o = parseFloat(o);

        let p = item.high24hour;
        p = p.replace('$ ', '');
        p = p.replace(',', '.');
        p = parseFloat(p);

        let q = item.low24hour;
        q = q.replace('$ ', '');
        q = q.replace(',', '.');
        q = parseFloat(q);

        const data = {
            datasets: [
                {
                    data: [l,m,n, o,  p, q],
                    // data: [
                    //     item.openDay,
                    //     item.highDay,
                    //     item.lowDay,
                    //     item.open24hour,
                    //     item.high24hour,
                    //     item.low24hour]
                    // color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
                    // strokeWidth: 2 // optional
                }
            ],
            // legend: ["Rainy Days"] // optional
        };

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
                img = Constant.image.default;
                break;

            case 'XLM':
                name = 'Stellar';
                img = Constant.image.default;
                break;

            case 'EOS':
                name = 'EOS';
                img = Constant.image.default;
                break;

            case 'NEO':
                name = 'NEO';
                img = Constant.image.default;
                break;

            default:
                name = item.name;
                img = 'https://images.unsplash.com/photo-1519995451813-39e29e054914?ixid=MXwxMjA3fDB8MHxzZWFyY2h8NDJ8fGJpdGNvaW4lMjBpY29ufGVufDB8fDB8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=60';
                break;
        }


        return (
            <TouchableOpacity
                onPress={() => {
                    // setItemSelected(item);
                    // setOpenModal(true);
                    navigation.navigate('Details', {item: item, userLogged: userLogged});

                }}
            >
                <Layout style={{
                    flexDirection: 'row',
                    alignSelf: 'stretch',
                    height: 70,
                    alignItems: 'center',
                    paddingHorizontal: 10,
                    borderBottomWidth: 1,
                    borderBottomColor: '#616161',
                }}>
                    <Layout style={{flex: 1}}>
                        <Image
                            source={img}
                            style={{width: 25, height: 25}}
                            // resizeMode={'contain'}
                        />
                    </Layout>

                    <Layout style={{flex: 1}}>
                        <Text>{name}</Text>
                        <Text>{item.name}</Text>
                    </Layout>

                    <Layout style={{flex: 2}}>
                        <LineChart
                            data={data}
                            width={150}
                            height={50}
                            chartConfig={chartConfig}
                            withHorizontalLabels={false}
                            withVerticalLabels={false}
                            withHorizontalLines={false}
                            withVerticalLines={false}
                            withDots={false}
                        />
                    </Layout>

                    <Layout style={{flex: 1}}>
                        <Text>{item.price}</Text>
                        {/*<Text>{formatter(1100124,20)}</Text>*/}
                    </Layout>


                </Layout>
            </TouchableOpacity>
        );
    };

    return(
        <Layout style={{flex: 2, backgroundColor: '#151515', alignSelf: 'stretch'}}>
            <List
                data={data}
                renderItem={renderItem}
            />
        </Layout>

    )
};



