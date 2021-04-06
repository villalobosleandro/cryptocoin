/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect} from 'react';
import type {Node} from 'react';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import Toast from 'react-native-toast-message';
import firebase from '@react-native-firebase/app';
import { LogBox, StatusBar, Platform } from 'react-native';

import { default as theme } from './custom-theme.json';
import { default as mapping } from './mapping.json';
import Providers from './src/Navigation/';

global.Constant = require('./src/lib/constant');
global.moment = require('moment');
LogBox.ignoreAllLogs(true);

var firebaseConfig = {
    apiKey: "AIzaSyD6s1uwCuMavUzc6d3sm4gWVjHvK-yxJOQ",
    authDomain: "cryptoapp-89ab1.firebaseapp.com",
    projectId: "cryptoapp-89ab1",
    storageBucket: "cryptoapp-89ab1.appspot.com",
    messagingSenderId: "797899050234",
    appId: "1:797899050234:web:387a7899ef2da180e98d43"
};


const App: () => Node = () => {

    useEffect(() => {
        if(Platform.OS === 'android') {
            StatusBar.setBackgroundColor(Constant.colors.blueColor);
        }
    }, []);

    // Initialize Firebase
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }else {
        firebase.app();
    }

    return (
        <>
            <IconRegistry icons={EvaIconsPack} />

            <ApplicationProvider  {...eva}
              theme={{ ...eva.light, ...theme }}
              customMapping={mapping}
            >
                <Toast ref={(ref) => Toast.setRef(ref)} />
                <Providers />
            </ApplicationProvider>
        </>
    );
};

export default App;
