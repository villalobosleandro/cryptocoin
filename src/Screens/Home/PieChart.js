import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Layout, Text} from '@ui-kitten/components';

export const PieChart = props => {
    const {userLogged } = props;

    return(
        <Layout style={[styles.container, styles.center]}>
            <View style={styles.center}>
                <Text style={{fontSize: 18, color: Constant.colors.whiteColor, paddingVertical: 10, fontWeight: 'bold'}}>Available</Text>
                <Text style={{fontSize: 24, color: Constant.colors.whiteColor}}>$ {parseFloat(userLogged.totalAmount).toFixed()}</Text>
            </View>
        </Layout>

    )
};

const styles = StyleSheet.create({
    center: {
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    container: {
        height: 120,
        backgroundColor: Constant.colors.blueColor,
    }
});
