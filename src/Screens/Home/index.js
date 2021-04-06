import React, {useEffect, useState, useContext, useCallback} from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Button, Spinner, Layout } from '@ui-kitten/components';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useFocusEffect } from '@react-navigation/native';

import {AuthContext} from '../../Navigation/AuthProvider';
import {PieChart} from './PieChart';
import {MyCoins} from './MyCoins';
import {ListCoins} from './ListCoins';



export const HomeScreen = (props) => {

    // console.log('\x1b[1;34m', 'LOG: navigation', props);

    const {navigation} = props;
    const {user, logout} = useContext(AuthContext);
    const [coinsConsult, setCoinsConsult] = useState(true);
    const [userConsult, setUserConsult] = useState(true);
    const [listCoins, setListCoins] = useState({});
    const [fetchConsultError, setFetchConsultError] = useState(false);
    const [userLogged, setUserLogged] = useState();
    const [openModal, setOpenModal] = useState(false);

    useFocusEffect(
        useCallback(() => {
            getInfoCoins();
            getInfoUser();
        }, [])
    );

    const getInfoCoins = () => {
        setCoinsConsult(true);
        // const url = 'https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH,XRP,BCH,ADA,LTC,XEM,XLM,EOS,NEO&tsyms=USD,EUR';
        const url = 'https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC,ETH,XRP,BCH,ADA,LTC,XEM,XLM,EOS,NEO&tsyms=USD';
        fetch(url)
            .then(response => response.json())
            .then(data => {
                // console.log('\x1b[1;34m', 'LOG: data', JSON.stringify(data));

                let arr = [];
                for (let clave in data.DISPLAY){
                    // console.log('======= ', clave);
                    // console.log('\x1b[1;34m', 'LOG: clave', data.DISPLAY[clave]);

                    // let price = data.DISPLAY[clave].USD.PRICE;
                    // price = price.replace('$ ', '');
                    // price = price.replace(',', '.');
                    // price = parseFloat(price);
                    //
                    // let openDay = data.DISPLAY[clave].USD.OPENDAY;
                    // openDay = openDay.replace('$ ', '');
                    // openDay = openDay.replace(',', '.');
                    // openDay = parseFloat(openDay);
                    //
                    // let highDay = data.DISPLAY[clave].USD.HIGHDAY;
                    // highDay = highDay.replace('$ ', '');
                    // highDay = highDay.replace(',', '.');
                    // highDay = parseFloat(highDay);
                    //
                    // let lowDay = data.DISPLAY[clave].USD.LOWDAY;
                    // lowDay = lowDay.replace('$ ', '');
                    // lowDay = lowDay.replace(',', '.');
                    // lowDay = parseFloat(lowDay);
                    //
                    // let open24hour = data.DISPLAY[clave].USD.OPEN24HOUR;
                    // open24hour = open24hour.replace('$ ', '');
                    // open24hour = open24hour.replace(',', '.');
                    // open24hour = parseFloat(open24hour);
                    //
                    // let high24hour = data.DISPLAY[clave].USD.HIGH24HOUR;
                    // high24hour = high24hour.replace('$ ', '');
                    // high24hour = high24hour.replace(',', '.');
                    // high24hour = parseFloat(high24hour);
                    //
                    // let low24hour = data.DISPLAY[clave].USD.LOW24HOUR;
                    // low24hour = low24hour.replace('$ ', '');
                    // low24hour = low24hour.replace(',', '.');
                    // low24hour = parseFloat(low24hour);

                    let aux = {
                        name: clave,
                        price: data.DISPLAY[clave].USD.PRICE,
                        openDay: data.DISPLAY[clave].USD.OPENDAY,
                        highDay: data.DISPLAY[clave].USD.HIGHDAY,
                        lowDay: data.DISPLAY[clave].USD.LOWDAY,
                        open24hour: data.DISPLAY[clave].USD.OPEN24HOUR,
                        high24hour: data.DISPLAY[clave].USD.HIGH24HOUR,
                        low24hour: data.DISPLAY[clave].USD.LOW24HOUR
                    };

                    // let aux = {
                    //     name: clave,
                    //     price: price,
                    //     openDay,
                    //     highDay,
                    //     lowDay,
                    //     open24hour,
                    //     high24hour,
                    //     low24hour
                    // };
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
            console.log('e home => ', e)
        }

    };

    if(fetchConsultError) {
        return(
            <Layout style={styles.center}>

                <Button onPress={() => {
                    getInfoCoins();
                    getInfoUser();
                }}>
                    Reconexion
                </Button>


            </Layout>
        )
    } else {
        return (
            <SafeAreaView style={styles.container}>

                {
                    (coinsConsult || userConsult) ?
                        <Layout style={styles.center}>
                            <Spinner/>
                        </Layout>
                    : <>
                        <PieChart
                            userLogged={userLogged}
                        />
                        {/*<MyCoins*/}
                        {/*    userLogged={userLogged}*/}
                        {/*/>*/}
                        <ListCoins
                            userLogged={userLogged}
                            data={listCoins}
                            getInfoUser={getInfoUser}
                            navigation={navigation}
                            // setOpenModal={setOpenModal}
                        />


                        {/*<Button onPress={() => logout()}>*/}
                        {/*    LOGOUT {user.uid}*/}
                        {/*</Button>*/}
                     </>
                }



            </SafeAreaView>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    center: {
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'stretch',
        height: '100%'
    },
    backdrop: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        // maxHeight: 400,
        // alignItems: 'center',
        // justifyContent: 'center'
    },
});

