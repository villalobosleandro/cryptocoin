import React, {useState, useEffect, useContext, useCallback} from 'react';
import {FlatList} from 'react-native';
import {Layout, ListItem, Text, Spinner} from '@ui-kitten/components';
import firestore from '@react-native-firebase/firestore';
import {AuthContext} from '../../Navigation/AuthProvider';
import auth from '@react-native-firebase/auth';
import { useFocusEffect } from '@react-navigation/native';

export const History = props => {
    const [loading, setLoading] = useState(true);
    const [listMovements, setListMovements] = useState([]);

    useFocusEffect(
        useCallback(() => {
            getInfoMovements();
            return () => {
                setLoading();
                setListMovements();
            }
        }, [])
    );

    // useEffect(() => {
    //     getInfoMovements();
    //     return () => {
    //         setLoading();
    //         setListMovements();
    //     }
    // }, []);

    const getInfoMovements = async () => {
        try {
            const movements = await firestore().collection('movements')
                .where('userId', '==', auth().currentUser.uid)
                .get();
            setListMovements(movements._docs);
            setLoading(false);
        } catch (e) {
            console.log('e history => ', e);
        }

    };

    const renderItem = ({ item, index }) => {
        return (
            <Layout style={{borderWidth: 1, borderColor: 'red', padding: 10}}>
                <Text>Moneda comprada: {item._data.name}</Text>
                <Text>Cantidad comprada: {item._data.amount}</Text>
                <Text>Saldo antes de comprar: {item._data.oldBalance}</Text>
                <Text>Saldo despues de comprar: {item._data.newBalance}</Text>
                <Text>Fecha: {moment(item.date).format('DD-MM-YYYY h:mm')}</Text>
            </Layout>
        );
    }

    const renderEmptyList = () => (
        <Layout style={{height: 30, justifyContent: 'center', alignSelf: 'stretch', paddingHorizontal: 10}}>
            <Text>No hay movimientos</Text>
        </Layout>

    )

    return(
        <Layout style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            {
                loading
                    ? <Spinner/>
                    : <>
                        <Text style={{color: 'black'}}>historu Screen</Text>
                        <Layout style={{flex: 1, alignSelf: 'stretch'}}>
                            <FlatList
                                data={listMovements}
                                renderItem={renderItem}
                                ListEmptyComponent={renderEmptyList}
                                keyExtractor={(item, index) => index.toString()}
                            />

                        </Layout>
                    </>

            }

        </Layout>
    )
};
