import React, {useState, useCallback, useContext} from 'react';
import {
    Alert,
    Image,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ScrollView
} from 'react-native';
import {
    Button,
    Layout,
    Modal,
    Text,
    Input,
    Spinner,
    Card
} from '@ui-kitten/components';
import { useFocusEffect } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-simple-toast';

import {AuthContext} from '../../Navigation/AuthProvider';

export const DetailsScreen = props => {
    const item = props.route.params;
    const [userHasCoinToSell, setUserHasCoinToSell] = useState([]);
    const [loading, setLoading] = useState(true);
    const [movementsConsult, setMovementsConsult] = useState(true);
    const [numberOfCoinsToSell, setNumberOfCoinsToSell] = useState(0);
    const [numberOfCoins, setNumberOfCoins] = useState(1);
    const {user} = useContext(AuthContext);
    const [listMovements, setListMovements] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [operationType, setOperationType] = useState('');
    const [allDataUser, setAllDataUser] = useState([]);


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
            let aux = details._docs[0]._data.coins
                ? details._docs[0]._data.coins.find(element => element.symbol === item.item.name)
                : [];

            setNumberOfCoinsToSell(aux !== undefined ? aux.amount : 0);
            setUserHasCoinToSell(details._docs);
            setLoading(false);

        } catch (e) {
            Toast.show(`Error ${e}`, Toast.LONG);
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
            setMovementsConsult(false);
        } catch (e) {
            Toast.show(`Error ${e}`, Toast.LONG);
            console.log('e history => ', e);
        }

    };

    const buyCoins = async () => {
        setLoading(true);
        setMovementsConsult(true);
        setOpenModal(false);
        let price = item.item.price;
        price = price.replace('$ ', '');
        price = price.replace(',', '');
        price = parseFloat(price);

        if(item.userLogged.totalAmount < numberOfCoins * price) {
            Alert.alert('Error!!!', 'You don\'t have enough money to make this purchase')
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
                        const ref = firestore().collection('movements').doc(user.id);
                        let nameCoin = Constant.coins.find(element => element.symbol === item.item.name);

                        ref.set({
                            name: nameCoin.name,
                            symbol: item.item.name,
                            amount: numberOfCoins,
                            date: new Date('DD MMM YYYY hh:mm'),
                            userId: user.uid,
                            operationType,
                            price,
                            oldBalance: item.userLogged.totalAmount,
                            newBalance: item.userLogged.totalAmount - (numberOfCoins * price)
                        });
                        getDetailCoins();
                        getInfoMovements();
                    })
                    .catch(error => {
                        Toast.show(`Error ${error}`, Toast.LONG);
                        console.log('error', error);
                    });

            }catch (e) {
                Toast.show(`Error ${e}`, Toast.LONG);
                console.log('\x1b[1;34m', 'LOG: e', e);
            }

        }

    };

    const sellCoins = async () => {
        setLoading(true);
        setMovementsConsult(true);
        setOpenModal(false);
        const coin = userHasCoinToSell[0]._data.coins.find(element => element.symbol === item.item.name);

        if(coin.amount < numberOfCoins) {
            Alert.alert('Error!!!', 'You don\'t have the amount you want to sell');
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

            try{
                const userUpdate = await firestore().collection('users')
                    .doc(user.uid);

                userUpdate
                    .update(data)
                    .then((response) => {

                        const ref = firestore().collection('movements').doc(user.id);
                        let nameCoin = Constant.coins.find(element => element.symbol === item.item.name);

                        ref.set({
                            name: nameCoin.name,
                            symbol: item.item.name,
                            amount: numberOfCoins,
                            date: new Date('DD MMM YYYY hh:mm'),
                            userId: user.uid,
                            operationType,
                            price,
                            oldBalance: item.userLogged.totalAmount,
                            newBalance: allDataUser._data.totalAmount + (numberOfCoins * price)
                        });
                        getDetailCoins();
                        getInfoMovements();
                    })
                    .catch(error => {
                        Toast.show(`Error ${error}`, Toast.LONG);
                        // console.log('error', error);

                    });

            }catch (e) {
                Toast.show(`Error ${e}`, Toast.LONG);
                console.log('\x1b[1;34m', 'LOG: e', e);
            }
        }
    };

    const renderItem = ({ item }) => {
        return(
            <Card
                status={item._data.operationType === 'buy' ? 'danger' : 'success'}
                style={styles.card}
            >
                <Layout style={styles.propertyOfCard}>
                    <Text>Operation Type:</Text>
                    <Text>{item._data.operationType.toUpperCase()}</Text>
                </Layout>

                <Layout style={styles.propertyOfCard}>
                    <Text>Amount:</Text>
                    <Text>{item._data.amount}</Text>
                </Layout>

                <Layout style={styles.propertyOfCard}>
                    <Text>Price:</Text>
                    <Text>{item._data.price}</Text>
                </Layout>

                <Layout style={styles.propertyOfCard}>
                    <Text>Date:</Text>
                    <Text>{moment(item._data.date).format('DD-MM-YYYY h:mm')}</Text>
                </Layout>
            </Card>
        );

    };

    const renderEmptyList = () => (
        <Layout style={styles.listEmpty}>
            <Text>No movements to show</Text>
            <Image
                style={{width: 250, height: 250}}
                source={Constant.image.listEmpty}
            />
        </Layout>
    );

    const validateSell = () => {
        if(numberOfCoinsToSell === 0) {
            Alert.alert('Error!', 'No tienes monedas para vender');
        } else {
            setOperationType('sell');
            setOpenModal(true);
        }
    };

    const modalConfirm = () => {
        Alert.alert(
            'Alert!!!',
            `Are you sure you ${operationType === 'buy' ? 'buy' : 'sell'} this amount? ${numberOfCoins}`,
            [
                {
                    text: "Cancel",
                    // onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "OK", onPress: () => operationType === 'buy' ? buyCoins() : sellCoins()}
            ]
        )
    }

    return(
        <Layout style={styles.container}>
            {
                (loading || movementsConsult)
                    ? <Layout style={[styles.center, styles.container]}>
                        <Spinner/>
                    </Layout>
                    : <>
                        <Layout style={styles.infoContainer}>
                            <Image
                                style={{width: 60, height: 60}}
                                source={item.image}
                            />

                            <Text style={{color: Constant.colors.whiteColor, fontSize: 22}}>{numberOfCoinsToSell}   {item.item.name}</Text>

                            <Layout style={styles.containerButtonsAction}>
                                <TouchableOpacity
                                    style={{alignItems: 'center'}}
                                    onPress={() => {
                                        setOperationType('buy');
                                        setOpenModal(true);
                                    }}
                                >

                                    <Layout style={styles.roundedIcon}>
                                        <MaterialCommunityIcons
                                            name="credit-card-refund-outline"
                                            size={30}
                                            color={Constant.colors.blueColor}
                                        />
                                    </Layout>
                                    <Text style={{color: Constant.colors.whiteColor}}>BUY</Text>

                                </TouchableOpacity>



                                <TouchableOpacity
                                    style={{alignItems: 'center'}}
                                    onPress={() => validateSell()}
                                >
                                    <Layout style={styles.roundedIcon}>
                                        <MaterialCommunityIcons
                                            name="cash-multiple"
                                            size={30}
                                            color={Constant.colors.blueColor}
                                            // onPress={() => logout()}
                                        />
                                    </Layout>
                                    <Text style={{color: Constant.colors.whiteColor}}>SELL</Text>

                                </TouchableOpacity>


                            </Layout>

                        </Layout>
                        <ScrollView>
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
                                <Layout style={styles.containerModal}>
                                    <Layout style={styles.title}>
                                        <Text style={{fontWeight: 'bold', fontSize: 24}}>{operationType === 'buy' ? 'BUY' : 'SELL'}</Text>
                                    </Layout>

                                    <Layout style={{height: 130}}>
                                        <Input
                                            placeholder='Place your Text'
                                            textAlign={'right'}
                                            value={numberOfCoins.toString()}
                                            onChangeText={nextValue => setNumberOfCoins(nextValue)}
                                            keyboardType={'numeric'}
                                        />
                                    </Layout>


                                    <Layout style={styles.buttonsContainer}>
                                        <Button
                                            onPress={() => setOpenModal(false)}
                                            status='danger'
                                        >
                                            CANCEL
                                        </Button>

                                        <Button
                                            // onPress={() => operationType === 'buy' ? buyCoins() : sellCoins()}
                                            onPress={() => modalConfirm()}
                                        >
                                            {operationType === 'buy' ? 'PAY' : 'SELL'}
                                        </Button>
                                    </Layout>
                                </Layout>
                            </Modal>
                        </ScrollView>
                    </>
            }

        </Layout>
    )
};

const styles = StyleSheet.create({
    backdrop: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    infoContainer: {
        height: 200,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 10,
        backgroundColor: Constant.colors.blueColor,
        paddingVertical: 10
    },
    container: {
        flex: 1,
        alignSelf: 'stretch',
    },
    containerButtonsAction: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'space-around',
        alignSelf: 'stretch',
        backgroundColor: Constant.colors.blueColor
    },
    roundedIcon: {
        height: 60,
        width: 60,
        borderRadius: 50,
        backgroundColor: Constant.colors.whiteColor,
        alignItems: 'center',
        justifyContent: 'center'
    },
    center: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    listEmpty: {
        paddingTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'stretch',
        paddingHorizontal: 10
    },
    card: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        margin: 10
    },
    propertyOfCard: {
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    containerModal: {
        height: 400,
        width: 300,
        justifyContent: 'space-between'
    },
    title: {
        height: 130,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonsContainer: {
        height: 130,
        justifyContent: 'flex-end'
    }

});
