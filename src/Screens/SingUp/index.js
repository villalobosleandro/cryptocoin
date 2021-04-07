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
import { sha512 } from 'react-native-sha512';

import { ImageOverlay } from './../../Shared/image-overlay.component';
import { EmailIcon, PersonIcon, PlusIcon } from './../../Shared/icons';
import { KeyboardAvoidingView } from './../../Shared/3rd-party';
import {AuthContext} from '../../Navigation/AuthProvider';

export const SingUp = ({ navigation }) => {
    const [loading, setLoading] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const image = { uri: "https://images.unsplash.com/photo-1612197527762-8cfb55b618d1?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MTJ8fGJpdGNvaW5zfGVufDB8fDB8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=60" };
    const { register } = useContext(AuthContext);

    const styles = useStyleSheet(themedStyles);

    const onSignUpButtonPress = async () => {
        setLoading(true);
        const pass = await sha512(password);
        const data = {
            email,
            firstName,
            lastName,
            password: pass
        };

        const response = await register(data);
        if(response === undefined) {
            setLoading(false);

        }else {
            Alert.alert('Error!!!', 'There is already an account with the email provided');
            setLoading(false);
        }
    };

    const onSignInButtonPress = () => {
        navigation && navigation.navigate('Login');
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
