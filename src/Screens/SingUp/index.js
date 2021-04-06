import React, { useState, useCallback, useContext } from 'react';
import { View, TouchableWithoutFeedback, Alert } from 'react-native';
import {
    Button,
    CheckBox,
    Input,
    StyleService,
    useStyleSheet,
    Text,
    Icon,
    Spinner,
    Layout
} from '@ui-kitten/components';
import { Toast } from 'native-base';

import { ImageOverlay } from './../../Shared/image-overlay.component';
import { EmailIcon, PersonIcon, PlusIcon } from './../../Shared/icons';
import { KeyboardAvoidingView } from './../../Shared/3rd-party';
import {AuthContext} from '../../Navigation/AuthProvider';

export const SingUp = ({ navigation }) => {
    const [loading, setLoading] = useState(false);
    const [firstName, setFirstName] = useState('firstname1');
    const [lastName, setLastName] = useState('lastname1');
    const [email, setEmail] = useState('mail1@mail.com');
    const [password, setPassword] = useState('asd123');
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const image = { uri: "https://images.unsplash.com/photo-1612197527762-8cfb55b618d1?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MTJ8fGJpdGNvaW5zfGVufDB8fDB8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=60" };
    const { register } = useContext(AuthContext);

    const styles = useStyleSheet(themedStyles);

    const onSignUpButtonPress = async () => {
        setLoading(true);
        const data = {
            email,
            firstName,
            lastName,
            password
        };

        const response = await register(data);
        if(response === undefined) {
            setLoading(false);


            // Toast.show({
            //     topOffset: 60,
            //     type: "success",
            //     text1: "New Category added",
            //     text2: ""
            // });
        }else {
            Alert.alert('El usuario ya existe');
            setLoading(false);
        }
        // console.log('\x1b[1;34m', 'LOG: aaaaaaaaaa', response);

        // navigation && navigation.goBack();
    };

    const onSignInButtonPress = () => {
        navigation && navigation.navigate('Login');
    };

    const onPasswordIconPress = () => {
        setPasswordVisible(!passwordVisible);
    };

    const renderEditAvatarButton = () => (
        <Button
            style={styles.editAvatarButton}
            status='basic'
            accessoryRight={PlusIcon}
        />
    );

    const renderPasswordIcon = (props) => (
        <TouchableWithoutFeedback onPress={onPasswordIconPress}>
            <Icon {...props} name={passwordVisible ? 'eye-off' : 'eye'} />
        </TouchableWithoutFeedback>
    );

    return (
        <KeyboardAvoidingView>
            {
                loading ?
                    <Layout style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
                        <Spinner/>
                    </Layout> :
                    <ImageOverlay
                        style={styles.container}
                        source={image}>

                        <View style={styles.formContainer}>
                            <Input
                                status='control'
                                autoCapitalize='none'
                                placeholder='First Name'
                                accessoryRight={PersonIcon}
                                value={firstName}
                                onChangeText={setFirstName}
                            />
                            <Input
                                status='control'
                                style={styles.formInput}
                                autoCapitalize='none'
                                placeholder='Last Name'
                                accessoryRight={PersonIcon}
                                value={lastName}
                                onChangeText={setLastName}
                            />
                            <Input
                                style={styles.formInput}
                                status='control'
                                autoCapitalize='none'
                                placeholder='Email'
                                accessoryRight={EmailIcon}
                                value={email}
                                onChangeText={setEmail}
                            />
                            <Input
                                style={styles.formInput}
                                status='control'
                                autoCapitalize='none'
                                secureTextEntry={!passwordVisible}
                                placeholder='Password'
                                accessoryRight={renderPasswordIcon}
                                value={password}
                                onChangeText={setPassword}
                            />
                        </View>
                        <Button
                            style={styles.signUpButton}
                            size='giant'
                            onPress={onSignUpButtonPress}>
                            SIGN UP
                        </Button>
                        <Button
                            style={styles.signInButton}
                            appearance='ghost'
                            status='control'
                            onPress={onSignInButtonPress}>
                            Already have an account? Sign In
                        </Button>
                    </ImageOverlay>
            }

        </KeyboardAvoidingView>
    );
};

const themedStyles = StyleService.create({
    container: {
        flex: 1,
        backgroundColor: 'background-basic-color-1',
    },
    headerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 216,
    },
    profileAvatar: {
        width: 116,
        height: 116,
        borderRadius: 58,
        alignSelf: 'center',
        backgroundColor: 'background-basic-color-1',
        tintColor: 'text-hint-color',
    },
    editAvatarButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    formContainer: {
        flex: 1,
        paddingTop: 32,
        paddingHorizontal: 16,
    },
    formInput: {
        marginTop: 16,
    },
    termsCheckBox: {
        marginTop: 24,
    },
    termsCheckBoxText: {
        color: 'text-control-color',
        marginLeft: 10,
    },
    signUpButton: {
        marginHorizontal: 16,
    },
    signInButton: {
        marginVertical: 12,
        marginHorizontal: 16,
    },
});
