import React, { useState, useContext, useCallback, useEffect } from 'react';
import {Dimensions, StyleSheet, Image} from 'react-native';
import {Layout, Spinner, Text, Avatar, List } from '@ui-kitten/components';
import { useFocusEffect } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-simple-toast';

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export const Profile = props => {
    const [coinsConsult, setCoinsConsult] = useState(true);
    const [listCoins, setListCoins] = useState({});
    const [fetchConsultError, setFetchConsultError] = useState(false);
    const [userConsult, setUserConsult] = useState(true);
    const [userLogged, setUserLogged] = useState();
    const colorCombination = [
        {
            initColor: Constant.colors.purpleColor,
            endColor: Constant.colors.pinkColor
        },
        {
            initColor: Constant.colors.lightYellowColor,
            endColor: Constant.colors.darkYellowColor
        },
        {
            initColor: Constant.colors.turquoiseColor,
            endColor: Constant.colors.appleGreenColor
        },
        {
            initColor: Constant.colors.lightblueColor,
            endColor: Constant.colors.darkBlueColor
        },
    ];

    useFocusEffect(
        useCallback(() => {
            getInfoCoins();
            getInfoUser();
        }, [])
    );

    const getInfoCoins = () => {
        setCoinsConsult(true);
        fetch(Constant.url)
            .then(response => response.json())
            .then(data => {

                let arr = [];
                for (let clave in data.DISPLAY) {
                    let price = data.DISPLAY[clave].USD.PRICE;
                    price = price.replace('$ ', '');//le quito el simbolo y espacio en blanco
                    price = price.replace(',', '');//le quito el punto
                    price = parseFloat(price).toFixed(2);

                    let aux = {
                        name: clave,
                        price
                    };

                    arr.push(aux)
                }
                setListCoins(arr);
                setFetchConsultError(false);
                setCoinsConsult(false);
                // console.log('data', data);
            })
            .catch(error => {
                setFetchConsultError(true);
                setCoinsConsult(false);
                Toast.show(`Error ${error}`, Toast.LONG);
                console.log('error, ', error);
            })

    };

    const getInfoUser = async () => {
        setUserConsult(true);
        try{
            const userDetails = await firestore().collection('users')
                .doc(auth().currentUser.uid)
                .get();

            setUserLogged(userDetails._data);
            setUserConsult(false);
        }catch (e) {
            Toast.show(`Error ${e}`, Toast.LONG);
            console.log('e home => ', e)
        }
    };

    const renderItem = ({ item, index }) => {
        let price = {};
        if(listCoins.length > 0) {
            for(let x = 0; x< listCoins.length; x++) {
                if(listCoins[x].name === item.symbol)
                price = listCoins[x];
            }
        }
        let img = '';
        switch (item.symbol) {
            case 'BTC':
                img = Constant.image.bitcoin;
                break;

            case 'ETH':
                img = Constant.image.etherum;
                break;

            case 'XRP':
                img = Constant.image.ripple;
                break;

            case 'BCH':
                img = Constant.image.bitcoinCash;
                break;

            case 'ADA':
                img = Constant.image.cardano;
                break;

            case 'LTC':
                img = Constant.image.litecoin;
                break;

            case 'XEM':
                img = Constant.image.nem;
                break;

            case 'XLM':
                img = Constant.image.stellar;
                break;

            case 'EOS':
                img = Constant.image.eos;
                break;

            case 'NEO':
                img = Constant.image.neo;
                break;

            case 'MIOTA':
                img = Constant.image.iota;
                break;

            case 'DASH':
                img = Constant.image.dash;
                break;

            case 'XMR':
                img = Constant.image.monero;
                break;

            case 'TRX':
                img = Constant.image.tron;
                break;

            case 'XTZ':
                img = Constant.image.tezos;
                break;

            case 'DOGE':
                img = Constant.image.dogecoin;
                break;

            case 'ETC':
                img = Constant.image.etherumClassic;
                break;

            case 'VEN':
                img = Constant.image.vechain;
                break;

            case 'USDT':
                img = Constant.image.tether;
                break;

            case 'BNB':
                img = Constant.image.binanceCoin;
                break;

            default:
                img = 'https://images.unsplash.com/photo-1519995451813-39e29e054914?ixid=MXwxMjA3fDB8MHxzZWFyY2h8NDJ8fGJpdGNvaW4lMjBpY29ufGVufDB8fDB8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=60';
                break;
        }

        return(
            <LinearGradient
                colors={[colorCombination[index%colorCombination.length].initColor, colorCombination[index%colorCombination.length].endColor]}
                style={styles.cardContainer}
                start={{ x: 0, y: 0 }}
            >
                <Image
                    style={{width: 50, height: 50, borderRadius: 30}}
                    source={img}
                />
                <Text style={{color: Constant.colors.whiteColor, fontWeight: 'bold'}}>{item.name.toUpperCase()}</Text>
                <Text style={{color: Constant.colors.whiteColor}}>{item.amount}</Text>
                <Text style={{color: Constant.colors.whiteColor, fontWeight: 'bold'}}>$ {price.price}</Text>


            </LinearGradient>
        );

    };

    const totalCoins = () => {
        let numCoins = 0;
        let amountAvailable = 0;
        for(let x = 0; x < userLogged.coins.length; x++) {
            numCoins += (parseInt(userLogged.coins[x].amount));
            for(let y = 0; y < listCoins.length; y++) {
                if(listCoins[y].name === userLogged.coins[x].symbol) {
                    amountAvailable = amountAvailable + (parseInt(userLogged.coins[x].amount) * listCoins[y].price);
                }
            }
        }

        return {numCoins, amountAvailable};
    };

    return(
        <Layout style={styles.globalContainer}>
            {
                userConsult
                    ? <Spinner/>
                    : <>
                        <Layout style={styles.container}>
                            <MaterialCommunityIcons
                                name="shield-account"
                                size={70}
                                color={Constant.colors.whiteColor}
                            />
                            <Layout style={styles.nameUserContainer}>
                                <Text style={{color: Constant.colors.whiteColor}} category='h5'>{userLogged.firstName} </Text>
                                <Text style={{color: Constant.colors.whiteColor}} category='h5'>{userLogged.lastName}</Text>
                            </Layout>

                            <Text style={{color: Constant.colors.whiteColor}}>{userLogged.email}</Text>
                            <Layout style={{backgroundColor: Constant.colors.blueColor}}>
                                <Text style={{color: Constant.colors.whiteColor}} category='h6'>Total Coins: {totalCoins().numCoins}</Text>
                                <Text style={{color: Constant.colors.whiteColor}} category='h6'>Amount Available: ≈ $ {totalCoins().amountAvailable.toFixed(2)}</Text>
                            </Layout>

                        </Layout>

                        <Layout style={styles.containerList}>
                            <List
                                data={userLogged.coins}
                                renderItem={renderItem}
                                numColumns={2}
                                contentContainerStyle={{paddingHorizontal: 8,
                                    paddingVertical: 10}}
                            />

                        </Layout>
                    </>
            }
        </Layout>
    )
};

const styles = StyleSheet.create({
    globalContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    cardContainer: {
        alignItems: 'center',
        justifyContent: 'space-around',
        borderRadius: 5,
        flex: 1,
        margin: 8,
        maxWidth: Dimensions.get('window').width / 2 - 24,
        height: 150
    },
    container: {
        height: 200,
        backgroundColor: Constant.colors.blueColor,
        alignSelf: 'stretch',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    nameUserContainer: {
        flexDirection: 'row',
        backgroundColor: Constant.colors.blueColor
    },
    containerList: {
        flex: 2,
        alignSelf: 'stretch'
    }
});
