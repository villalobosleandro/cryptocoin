import React, { useState, useContext, useCallback, useEffect } from 'react';
import {Dimensions, StyleSheet, Image} from 'react-native';
import {Layout, Spinner, Text, Avatar, List, Card} from '@ui-kitten/components';
import { useFocusEffect } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

import {AuthContext} from '../../Navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export const Profile = props => {
    const {user, logout} = useContext(AuthContext);
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
    const [colorIndex, setColorIndex] = useState(0);

    // console.log('\x1b[1;34m', 'LOG: userLogged', userLogged);


    useFocusEffect(
        useCallback(() => {
            getInfoUser();
        }, [])
    );

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

    const renderItem = ({ item, index }) => {

        return(
            <LinearGradient
                colors={[colorCombination[index%colorCombination.length].initColor, colorCombination[index%colorCombination.length].endColor]}
                // colors={['red', 'yellow']}
                style={styles.cardContainer}
                start={{ x: 0, y: 0 }}
            >
                <Image
                    style={{width: 50, height: 50, borderRadius: 30}}
                    source={Constant.image.cardano}
                />
                <Text>{item.name.toUpperCase()}</Text>
                <Text>{item.amount}</Text>
            </LinearGradient>
        );

    };

    return(
        <Layout style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            {
                userConsult
                    ? <Spinner/>
                    : <>
                        <Layout style={{height: 200, backgroundColor: Constant.colors.blueColor, alignSelf: 'stretch', flex: 1, alignItems: 'center',justifyContent: 'space-around'}}>
                            <Avatar source={Constant.image.cardano} size='giant'/>
                            <Text>{userLogged.firstName}</Text>
                            <Text>{userLogged.lastName}</Text>
                            <Text>{userLogged.email}</Text>
                        </Layout>

                        <Layout style={{flex: 2, alignSelf: 'stretch'}}>
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
    cardContainer: {
        alignItems: 'center',
        justifyContent: 'space-around',
        borderRadius: 5,
        flex: 1,
        margin: 8,
        maxWidth: Dimensions.get('window').width / 2 - 24,
        height: 150
    }
});
