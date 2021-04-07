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
        fetch(Constant.url)
            .then(response => response.json())
            .then(data => {

                let arr = [];
                for (let clave in data.DISPLAY){

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

                        <ListCoins
                            userLogged={userLogged}
                            data={listCoins}
                            getInfoUser={getInfoUser}
                            navigation={navigation}
                        />

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

