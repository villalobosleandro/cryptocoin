import React, { useContext, useState } from 'react';
import { StyleSheet, View, TouchableWithoutFeedback } from 'react-native';
import { Button, Input, Text, Icon } from '@ui-kitten/components';
import Toast from 'react-native-toast-message';

import { ImageOverlay } from './../../Shared/image-overlay.component';
import {
    FacebookIcon,
    GoogleIcon,
    PersonIcon,
} from './../../Shared/icons';
import { KeyboardAvoidingView } from './../../Shared/3rd-party';
import {AuthContext} from '../../Navigation/AuthProvider';

export const LoginScreen = ({ navigation }) => {

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const image = { uri: "https://images.unsplash.com/photo-1612197527762-8cfb55b618d1?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MTJ8fGJpdGNvaW5zfGVufDB8fDB8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=60" };
    const {login} = useContext(AuthContext);

    const onSignInButtonPress = async () => {
        const response = await login(email, password);


        if(response !== undefined) {
            console.log('\x1b[1;34m', 'LOG: response', response);
            Toast.show({
                topOffset: 60,
                type: "error",
                text1: "Error!",
                text2: `${response}`
            });
        }
    };

    const onSignUpButtonPress = () => {
        navigation && navigation.navigate('Signup');
    };

    const onForgotPasswordButtonPress = () => {
        navigation && navigation.navigate('ForgotPassword');
    };

    const onPasswordIconPress = () => {
        setPasswordVisible(!passwordVisible);
    };

    const renderPasswordIcon = (props) => (
        <TouchableWithoutFeedback onPress={onPasswordIconPress}>
            <Icon {...props} name={passwordVisible ? 'eye-off' : 'eye'} />
        </TouchableWithoutFeedback>
    );

    return (
        <KeyboardAvoidingView>
            <ImageOverlay
                style={styles.container}
                source={image}
            >
                <View style={styles.headerContainer}>
                    <Text
                        category='h1'
                        status='control'>
                        Hello
                        </Text>
                    <Text
                        style={styles.signInLabel}
                        category='s1'
                        status='control'>
                        Sign in to your account
                        </Text>
                </View>
                <View style={styles.formContainer}>
                    <Input
                        status='control'
                        placeholder='Email'
                        accessoryRight={PersonIcon}
                        value={email}
                        onChangeText={setEmail}
                    />
                    <Input
                        style={styles.passwordInput}
                        status='control'
                        placeholder='Password'
                        accessoryRight={renderPasswordIcon}
                        value={password}
                        secureTextEntry={!passwordVisible}
                        onChangeText={setPassword}
                    />
                    {/*<View style={styles.forgotPasswordContainer}>*/}
                    {/*    <Button*/}
                    {/*        style={styles.forgotPasswordButton}*/}
                    {/*        appearance='ghost'*/}
                    {/*        status='control'*/}
                    {/*        onPress={onForgotPasswordButtonPress}>*/}
                    {/*        Forgot your password?*/}
                    {/*    </Button>*/}
                    {/*</View>*/}
                </View>
                <Button
                    style={styles.signInButton}
                    size='giant'
                    onPress={onSignInButtonPress}>
                    SIGN IN
                </Button>
                <View style={styles.socialAuthContainer}>
                    <Text
                        style={styles.socialAuthHintText}
                        status='control'>
                        Or Sign In using Social Media
                    </Text>
                    <View style={styles.socialAuthButtonsContainer}>
                        <Button
                            appearance='ghost'
                            status='control'
                            size='giant'
                            accessoryLeft={GoogleIcon}
                        />
                        <Button
                            appearance='ghost'
                            status='control'
                            size='giant'
                            accessoryLeft={FacebookIcon}
                        />
                    </View>
                </View>
                <Button
                    style={styles.signUpButton}
                    appearance='ghost'
                    status='control'
                    onPress={onSignUpButtonPress}>
                    Don't have an account? Sign Up
                </Button>
            </ImageOverlay>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContainer: {
        minHeight: 216,
        justifyContent: 'center',
        alignItems: 'center',
    },
    formContainer: {
        flex: 1,
        paddingHorizontal: 16,
    },
    signInLabel: {
        marginTop: 16,
    },
    passwordInput: {
        marginTop: 16,
    },
    signInButton: {
        marginHorizontal: 16,
    },
    forgotPasswordContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    forgotPasswordButton: {
        paddingHorizontal: 0,
    },
    signUpButton: {
        marginVertical: 12,
    },
    socialAuthContainer: {
        marginTop: 32,
    },
    socialAuthButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    socialAuthHintText: {
        alignSelf: 'center',
        marginBottom: 16,
    },
});
