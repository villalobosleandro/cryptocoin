import React, {useState, useCallback, useContext} from 'react';
import {
    Alert,
    Image,
    FlatList,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import {
    Button,
    Icon,
    Layout,
    ListItem,
    Modal,
    Text,
    Input
} from '@ui-kitten/components';
import { useFocusEffect } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {AuthContext} from '../../Navigation/AuthProvider';

export const DetailsScreen = props => {
    const item = props.route.params;
    const [userHasCoinToSell, setUserHasCoinToSell] = useState([]);
    const [loading, setLoading] = useState(true);
    const [numberOfCoinsToSell, setNumberOfCoinsToSell] = useState(0);
    const [numberOfCoins, setNumberOfCoins] = useState(1);
    const {user} = useContext(AuthContext);
    const [listMovements, setListMovements] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [operationType, setOperationType] = useState('');
    const [allDataUser, setAllDataUser] = useState([]);
    // console.log('item', item.item);


    useFocusEffect(
        useCallback(() => {
            getDetailCoins();
            getInfoMovements()
        }, [])
    );

    const getDetailCoins = async () => {
        try {
            const details = await firestore().collection('users')
                .where("userId", "==", auth().currentUser.uid)
                .get();

            setAllDataUser(details._docs[0]);
            // console.log('\x1b[1;34m', 'LOG: details._docs[0]', details._docs[0]);

            let aux = details._docs[0]._data.coins
                ? details._docs[0]._data.coins.find(element => element.symbol === item.item.name)
                :[];
            setNumberOfCoinsToSell(aux ? aux.amount : 0);
            setUserHasCoinToSell(details._docs);
            setLoading(false);

        } catch (e) {
            console.log('e history => ', e);
            setLoading(false);
        }
    };

    const getInfoMovements = async () => {
        try {
            const movements = await firestore().collection('movements')
                .where('userId', '==', auth().currentUser.uid)
                .where('symbol', '==', item.item.name)
                .get();
            setListMovements(movements._docs);
            setLoading(false);
        } catch (e) {
            console.log('e history => ', e);
        }

    };

    const buyCoins = async () => {
        let price = item.item.price;
        price = price.replace('$ ', '');
        price = price.replace(',', '');
        price = parseFloat(price);

        if(item.userLogged.totalAmount < numberOfCoins * price) {
            Alert.alert('No Teienes dinero')
        }else {

            let aux = {
                coins: item.userLogged.coins ? item.userLogged.coins : [],
                totalAmount: item.userLogged.totalAmount - (numberOfCoins * price)
            };

            //aqui busco entre un array que tiene las abreviaciones de las monedas
            //sino la consigue la agrega, esto lo hice para poder consultar mas adelante
            //si el usuario tiene monedas para vender ya que con firebase no puedo
            //buscar por una propiedad de un objeto dentro de un array
            let nameOfCoins = item.userLogged.nameOfCoins ? item.userLogged.nameOfCoins : [];
            const foundCoin = nameOfCoins.find(element => element === item.item.name);
            // console.log('\x1b[1;34m', 'LOG: item.item.name',foundCoin);
            if(foundCoin === undefined)
                nameOfCoins.push(item.item.name);

            //aqui valido si en el array de objetos ya esta agregada la moneda a comprar
            //si la moneda se encuentra solo se aumenta la cantidada a comprar
            //sino la encuentra la agrega y se actualiza el balance al final
            const found = aux.coins.find(element => element.symbol === item.item.name ? element.amount += numberOfCoins : null);
            if(found === undefined) {
                let nameCoin = Constant.coins.find(element => element.symbol === item.item.name);
                aux.coins.push({name: nameCoin.name, symbol: item.item.name, amount: numberOfCoins});
                aux.nameOfCoins = nameOfCoins;
            }


            try{
                const userUpdate = await firestore().collection('users')
                    .doc(user.uid);

                userUpdate
                    .update(aux)
                    .then((response) => {
                        // Toast.show({
                        //     text1: 'Hello',
                        //     text2: 'This is some something 👋'
                        // });
                        const ref = firestore().collection('movements').doc(user.id);
                        let nameCoin = Constant.coins.find(element => element.symbol === item.item.name);

                        ref.set({
                            name: nameCoin.name,
                            symbol: item.item.name,
                            amount: numberOfCoins,
                            date: new Date(),
                            userId: user.uid,
                            operationType,
                            oldBalance: item.userLogged.totalAmount,
                            newBalance: item.userLogged.totalAmount - (numberOfCoins * price)
                        });
                        getDetailCoins();
                        getInfoMovements();
                    })
                    .catch(error => {
                        // console.log('error', error);

                    });

            }catch (e) {
                console.log('\x1b[1;34m', 'LOG: e', e);
            }

        }

    };

    const sellCoins = async () => {
        const coin = userHasCoinToSell[0]._data.coins.find(element => element.symbol === item.item.name);
        // console.log('\x1b[1;34m', 'LOG: coin', coin);

        if(coin.amount < numberOfCoins) {
            Alert.alert('Error', 'No no tienes la cantidad que quieres vender');
        }else {
            let arrayTemp =[];

            //primero busco la moneda que se va a vender para restarle la cantidad
            //que el usaurio quiere vender
            allDataUser._data.coins.map(element => {
                if(element.symbol === item.item.name)
                    element.amount = element.amount - numberOfCoins;

                arrayTemp.push(element);
            });

            // ahora debo validar que el monto de la moneda no sea 0, en caso de ser 0
            //debo quitarla del campo de las monidas disponibles del usuario
            //aqui guardare el array con objetos de las monedas que se subira a la base de datos
            let arrayAux = [];
            arrayTemp.map(element => {
                if(element.amount > 0)
                    arrayAux.push(element)
            });
            //aqui guardare el array con las iniciales de las monedas que tiene el usuario
            const nameOfCoins = [];
            arrayTemp.filter(element => {
                if(element.amount !== 0)
                    nameOfCoins.push(element.symbol)
            });

            //formateo el precio de la moneda para poder hacer la operacion
            let price = item.item.price;
            price = price.replace('$ ', '');
            price = price.replace(',', '');
            price = parseFloat(price);

            //creo el objeto que voy a subir a la bd
            let data = {
                coins: arrayAux,
                nameOfCoins,
                totalAmount: allDataUser._data.totalAmount + (numberOfCoins * price)
            };
            // console.log('\x1b[1;34m', 'LOG: data', allDataUser._data.totalAmount);

            try{
                const userUpdate = await firestore().collection('users')
                    .doc(user.uid);

                userUpdate
                    .update(data)
                    .then((response) => {
                        // console.log('\x1b[1;34m', 'LOG: response', response);
                        // console.log('userUpdate => ', userUpdate);


                        const ref = firestore().collection('movements').doc(user.id);
                        let nameCoin = Constant.coins.find(element => element.symbol === item.item.name);

                        ref.set({
                            name: nameCoin.name,
                            symbol: item.item.name,
                            amount: numberOfCoins,
                            date: new Date(),
                            userId: user.uid,
                            operationType,
                            oldBalance: item.userLogged.totalAmount,
                            newBalance: allDataUser._data.totalAmount + (numberOfCoins * price)
                        });
                        getDetailCoins();
                        getInfoMovements();
                    })
                    .catch(error => {
                        // console.log('error', error);

                    });

            }catch (e) {
                console.log('\x1b[1;34m', 'LOG: e', e);
            }





        }


    };

    const renderItem = ({ item, index }) => {
        // console.log('\x1b[1;34m', 'LOG: item', item);

        return (
            <ListItem
                title={moment(item._data.date).format('DD-MM-YYYY h:mm')}
                description={item._data.amount}
            />

        );
    }

    const renderEmptyList = () => (
        <Layout style={{height: 30, justifyContent: 'center', alignSelf: 'stretch', paddingHorizontal: 10}}>
            <Text>No hay movimientos</Text>
        </Layout>

    );

    // console.log('listMovements ', numberOfCoinsToSell);


    return(
        <Layout style={{flex: 1, alignSelf: 'stretch'}}>
            <Layout style={{height: 200, backgroundColor: 'white', alignItems: 'center', paddingTop: 10}}>
                <Layout style={{backgroundColor: 'white'}}>
                    <Image
                        style={{width: 50,
                            height: 50,}}
                        source={{
                            uri: 'https://reactnative.dev/img/tiny_logo.png',
                        }}
                    />
                    <Text style={{color: 'black'}}>{item.item.name}</Text>
                </Layout>


                {/*cantidad de monedas que tengo para vender*/}
                {
                    numberOfCoinsToSell > 0 && (
                        <Text style={{color: 'black'}}>cantidad de moneda que tengo {numberOfCoinsToSell}</Text>
                    )
                }

                <Layout style={{flexDirection: 'row', alignItems: 'center', justifyContent:'space-around', alignSelf: 'stretch', backgroundColor: 'white'}}>
                    <TouchableOpacity
                        style={{backgroundColor: 'white'}}
                        onPress={() => {
                            setOperationType('buy');
                            setOpenModal(true);
                            // buyCoins()
                        }}
                    >
                        <Text style={{color: 'black'}}>Comprar</Text>
                        <MaterialCommunityIcons
                            name="credit-card-refund-outline"
                            size={40}
                            backgroundColor="#fff"
                            color="#2e64e5"
                            // onPress={() => logout()}
                        />

                        {/*<Icon*/}
                        {/*    raised*/}
                        {/*    name='heartbeat'*/}
                        {/*    type='font-awesome'*/}
                        {/*    color='#f50'*/}
                        {/*    // onPress={() => console.log('hello')}*/}
                        {/*/>*/}
                    </TouchableOpacity>


                    {
                        numberOfCoinsToSell > 0 && (
                            <TouchableOpacity
                                style={{backgroundColor: 'white'}}
                                onPress={() => {
                                    setOperationType('sell');
                                    setOpenModal(true);
                                }}
                            >
                                <Text style={{color: 'black'}}>Vender</Text>
                                <MaterialCommunityIcons
                                    name="cash-multiple"
                                    size={40}
                                    backgroundColor="#fff"
                                    color="#2e64e5"
                                    // onPress={() => logout()}
                                />
                            </TouchableOpacity>
                        )
                    }

                </Layout>

            </Layout>
            <Layout>
                <FlatList
                    data={listMovements}
                    renderItem={renderItem}
                    ListEmptyComponent={renderEmptyList}
                    keyExtractor={(item, index) => index.toString()}
                />

                <Modal
                    visible={openModal}
                    backdropStyle={styles.backdrop}
                    onBackdropPress={() => setOpenModal(false)}
                >
                    <Layout style={{height: 400, width: 300, justifyContent: 'space-between'}}>
                        <Layout style={{flex: 1}}>

                            <Text>{operationType === 'buy' ? 'Comprar' : 'Vender'}</Text>
                        </Layout>

                        <Layout>
                            {/*<Icon*/}
                            {/*    style={{width: 32,*/}
                            {/*        height: 32,}}*/}
                            {/*    fill='#8F9BB3'*/}
                            {/*    name='minus-circle-outline'*/}
                            {/*    onPress={() => setNumberOfCoins(numberOfCoins-1)}*/}
                            {/*/>*/}
                            <Input
                                placeholder='Place your Text'
                                value={numberOfCoins.toString()}
                                onChangeText={nextValue => setNumberOfCoins(nextValue)}
                                keyboardType={'numeric'}
                            />
                            {/*<Text>{numberOfCoins}</Text>*/}
                            {/*<Icon*/}
                            {/*    style={{width: 32,*/}
                            {/*        height: 32,}}*/}
                            {/*    fill='#8F9BB3'*/}
                            {/*    name='plus-circle-outline'*/}
                            {/*    onPress={() => setNumberOfCoins(numberOfCoins+1)}*/}
                            {/*/>*/}
                        </Layout>




                        <Layout style={{flex: 1, justifyContent: 'flex-end'}}>
                            <Button
                                onPress={() => setOpenModal(false)}
                                status='danger'
                            >
                                CANCEL
                            </Button>

                            <Button
                                onPress={() => operationType === 'buy' ? buyCoins() : sellCoins()}
                            >
                                {operationType === 'buy' ? 'PAY' : 'SELL'}
                            </Button>
                        </Layout>
                    </Layout>
                </Modal>
            </Layout>
        </Layout>
    )
};

const styles = StyleSheet.create({
    backdrop: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
});
