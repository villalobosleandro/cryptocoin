import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Layout, Text} from '@ui-kitten/components';

export const PieChart = props => {
    const {userLogged } = props;
    console.log('\x1b[1;34m', 'LOG: userLogged.totalAmount', userLogged.totalAmount);

    return(
        <Layout style={[styles.container, styles.center]}>
            <View style={styles.center}>
                <Text style={{fontSize: 18}}>Available to buy</Text>
                <Text style={{fontSize: 24}}>$ {parseFloat(userLogged.totalAmount).toFixed()}</Text>
            </View>
        </Layout>

    )
};

const styles = StyleSheet.create({
    center: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        height: 150,
        backgroundColor: Constant.colors.blueColor,
    }
});
