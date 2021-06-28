import { Formik } from 'formik';
import React, { useState, Fragment, useEffect } from 'react';
import {
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import { FormInput, FormButton, ErrorMessage } from './Center';
import { ScrollView } from 'react-native-gesture-handler';
import { IconButton, withTheme, Snackbar, Button } from 'react-native-paper';
import * as Yup from 'yup';
import { Divider } from 'react-native-elements';
import Clipboard from '@react-native-community/clipboard';
import { useFocusEffect } from '@react-navigation/native';
import {
  createData,
  editData,
  deleteData,
  createDataNew,
  EditDataNew,
} from '../db/operations';
//import { Input, Icon } from "react-native-elements";
import Icon from 'react-native-vector-icons/FontAwesome';
//import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CryptoJS from 'react-native-crypto-js';
import { Component } from 'react';
import BackgroundColor from 'react-native-background-color';
import { BarPasswordStrengthDisplay } from 'react-native-password-strength-meter';
import { Platform, StyleSheet } from "react-native";



const createAccount = index => ({
  id: '',
  account: `Account ${index + 1}`,
  login: '',
  password: '',
  passwordIcon: 'eye',
  showPassword: true,
  note: '',
});

// const createAccount = index => ({

//   account: `Account ${index + 1}`,
//   login: `Login ${index + 1}`,
//   password: `Password ${index + 1}`,
//   passwordIcon: 'eye',
//   showPassword: true,
//   note: `Note ${index + 1}`,
// });
const validationSchema = Yup.object().shape({
  name: Yup.string()
    .label('Name')
    .required()
    .min(2, 'Must have at least 2 characters'),
  webAddress: Yup.string()
    .label('webAddress')
    .required('Web Address is a required field'),
});

//Decryption

const decrypt = (password) => {
  let bytes = CryptoJS.AES.decrypt(password, 'secret key 123');
  let originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText.toString();
}


//Generate Password
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive 
}

const generatePassword = (passwordLength) => {
  passwordLength = 10;
  var numberChars = '0123456789';
  var upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var lowerChars = 'abcdefghijklmnopqrstuvwxyz';
  var specialChars = '!@#$%^&*()+_\-=}{[\]|:;"/?.><,`~';
  var allChars = numberChars + upperChars + lowerChars + specialChars;
  var randPasswordArray = Array(passwordLength);
  randPasswordArray[0] = numberChars;
  randPasswordArray[1] = upperChars;
  randPasswordArray[2] = lowerChars;
  randPasswordArray[3] = specialChars;
  randPasswordArray = randPasswordArray.fill(allChars, 3);
  return shuffleArray(
    randPasswordArray.map(function (x) {
      return x[Math.floor(Math.random() * x.length)];
    }),
  ).join('');
}

function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}
const generatePass = () => {
  var generatedPassword = generatePassword();
  setPassword(generatedPassword);
}


/*
 * Form for submitting a bunch of questions
 * */
const CreateEditForm = props => {
  const { navigation, route } = props;
  const RouteParams = route.params;

  if (!RouteParams.createFlag && RouteParams.item != 'No-Item') {
    //EDIT FORM
    var [Pass, setPass] = useState(
      JSON.parse(JSON.stringify(RouteParams.item)),
    ); //TODO
    var aaa = JSON.parse(JSON.stringify(RouteParams.item.accountsNew)); //TODO
    aaa.map(itm => {
      itm.showPassword = true;
      itm.passwordIcon = 'eye';
    }); //TODO
    var [PassAccountNew, setPassAccountNew] = useState(aaa);
    var [isCreate, setIsCreate] = useState(false);
    var [id, setId] = useState(RouteParams.item.id);
    var [password, setPassword] = useState('');


    // EDIT Form Navigation Option
    props.navigation.setOptions({
      title: 'Edit Password',

      headerStyle: {
        backgroundColor: '#BDB76B', //TODO //DarkKhaki
      },
      headerTitleStyle: {
        fontWeight: 'bold',
        color: '#B22222', //FireBrick
      },
      headerTintColor: '#fff', //TODO
      headerRight: () => (
        <IconButton
          icon="delete"
          size={30}
          color="#B22222" //TODO
          mode="contained"
          dark={true}
          onPress={() => {
            deleteData(id)
              .then(data => {
                navigation.goBack();
              })
              .catch(error => {
                console.log('DeleteData ERROR', error);
              });
          }}
        />
      ),
    });
  } else {
    //CREATE FORM
    var [Pass, setPass] = useState(); //TODO
    var [isCreate, setIsCreate] = useState(true); //TODO

    var [PassAccountNew, setPassAccountNew] = useState(); //TODO
    var [id, setId] = useState(); //TODO
    var [password, setPassword] = useState('');


    

    // Create Form Navigation Option for
    props.navigation.setOptions({
      title: 'Add Password',
      headerStyle: {
        backgroundColor: '#BDB76B', //TODO //DarkKhaki
      },
      headerTitleStyle: {
        fontWeight: 'bold',
        color: '#B22222', //FireBrick
      },
      headerTintColor: '#fff', //TODO
      headerRight: () => <></>,
    });
  }
  return (

    //<View style={{height: '100%',backgroundColor: '#2b2b39'}}>
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#FFF8DC', }}

      onPress={Keyboard.dismiss}
    // enabled behavior="padding"
    >
      <ScrollView>
        <Formik
          initialValues={{
            name: isCreate ? '' : Pass.name,
            webAddress: isCreate ? '' : Pass.website,
            accounts: isCreate ? [] : PassAccountNew,
          }}
          validationSchema={validationSchema}
          onSubmit={(values, actions) => {
            setTimeout(() => {
              if (isCreate) {
                createDataNew(values)
                  .then(data => {
                    navigation.navigate('Home');
                    actions.setSubmitting(false);
                  })
                  .catch(error => {
                    console.log('createData ERROR', error);
                  });
              } else {
                EditDataNew(values, id)
                  .then(data => {
                    navigation.navigate('Home');
                    actions.setSubmitting(false);
                  })
                  .catch(error => {
                    console.log('editData ERROR', error);
                  });
              }
            }, 0);
          }}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            isValid,
            errors,
            isSubmitting,
            setFieldValue,
          }) => (
            <View style={{}}>

              <FormInput
                name="name"
                label="Website Name"
                value={values.name}
                onChangeText={handleChange('name')}
                // placeholder="Enter your full name"
                //icon="mail"
                // iconColor="#2C384A"
                onBlur={handleBlur('name')}
                errorMessage={errors.name}
              />
              <FormInput
                name="webAddress"
                label="Website"
                value={values.webAddress}
                onChangeText={handleChange('webAddress')}
                //leftIcon={<Icon size={24} name="web-box" type='MaterialCommunityIcons' />}
                // placeholder="Enter web address"
                leftIcon={<Icon size={24} name="globe" color="#CD5C5C" />}
                onBlur={handleBlur('webAddress')}
                errorMessage={errors.webAddress}
              />
              <Divider
                style={{ backgroundColor: 'tomato', height: 1, margin: 3 }}
              />
              {values.accounts.map(({ text }, index) => (
                <Fragment>
                  <View
                    style={{
                      margin: 10,
                    }}>
                    <View style={{}}>
                      <Text>{index + +'4'}</Text>
                      <FormInput
                        key={index + +'4'}
                        name="account"
                        label="Account"
                        value={values.accounts[index].account}
                        inputStyle={{ flex: 1, paddingRight: 45 }}
                        onChangeText={handleChange(
                          `accounts[${index}].account`,
                        )}
                        // placeholder="my Account"
                        onBlur={handleBlur(`accounts[${index}].account`)}
                      />
                      <IconButton
                        icon="delete"
                        style={{ position: 'absolute', top: 33, right: 8 }}
                        size={30}
                        color="tomato"
                        mode="contained"
                        dark={true}
                        onPress={() => {
                          values.accounts.splice(index, 1);
                          setFieldValue('accounts', values.accounts);
                        }}
                      />
                    </View>
                    <FormInput
                      key={index + '3'}
                      name="login"
                      label="Username"
                      value={values.accounts[index].login}
                      onChangeText={handleChange(`accounts[${index}].login`)}
                      leftIcon={<Icon size={24} name="user-circle-o" color="#CD5C5C" />}
                      // placeholder="Login"
                      onBlur={handleBlur(`accounts[${index}].login`)}
                    />

                    <View style={{}}>
                      <FormInput
                        key={index + '2'}
                        name="password"
                        secureTextEntry={values.accounts[index].showPassword}
                        label="Password"
                        value={values.accounts[index].password}
                        //value={password}
                        leftIcon={<Icon size={24} name="lock" color="#CD5C5C" />}
                        onChangeText={handleChange(
                          `accounts[${index}].password`,
                        )}
                        // placeholder="password"
                        inputStyle={{ flex: 1, paddingRight: 85 }}
                        onBlur={handleBlur(`accounts[${index}].password`)}
                      />
                      <IconButton
                        icon={values.accounts[index].passwordIcon}
                        style={{ position: 'absolute', top: 33, right: 52 }}
                        size={30}
                        color="tomato"
                        mode="contained"
                        dark={true}
                        onPress={() => {
                          if (values.accounts[index].showPassword) {
                            let data = JSON.parse(JSON.stringify(values));
                            data.accounts[index].showPassword = false;
                            data.accounts[index].passwordIcon = 'eye-off';
                            setFieldValue('accounts', data.accounts);
                          } else {
                            let data1 = JSON.parse(JSON.stringify(values));
                            data1.accounts[index].showPassword = true;
                            data1.accounts[index].passwordIcon = 'eye';
                            setFieldValue('accounts', data1.accounts);
                          }
                        }}
                      />

                      <IconButton
                        // Password Decryption
                        icon="content-copy"
                        style={{ position: 'absolute', top: 33, right: 8 }}
                        size={30}
                        color="tomato"
                        mode="contained"
                        dark={true}
                        onPress={() => {
                          Clipboard.setString(decrypt(values.accounts[index].password));
                        }}
                      />
                    </View>

                    <View >
                      <BarPasswordStrengthDisplay
                        password={values.accounts[index].password}
                      />
                    </View>


                    <View style={{ margin: 25 }}>
                      <FormButton
                        buttonType="outline"
                        onPress={() => generatePass()}
                        title="Generate Password"
                        buttonColor="#F57C00" //TODO
                        //disabled={!isValid || isSubmitting}
                        //loading={isSubmitting}
                      />
                    </View>


                    <FormInput
                      key={index + '1'}
                      name="note"
                      label="Note"
                      value={values.accounts[index].note}
                      onChangeText={handleChange(`accounts[${index}].note`)}
                      leftIcon={<Icon size={24} name="tasks" color="#CD5C5C" />}
                      // placeholder="Notes"
                      onBlur={handleBlur(`accounts[${index}].note`)}
                    />
                  </View>
                  <Divider
                    style={{ backgroundColor: 'tomato', height: 1, margin: 3 }} //TODO
                  />
                </Fragment>
              ))}
              <Button
                // mode="contained"
                style={{
                  // textAlign: 'left',
                  width: '50%',
                }}
                dark={true}
                color="tomato"
                onPress={() =>
                  setFieldValue('accounts', [
                    ...values.accounts,
                    createAccount(values.accounts.length),
                  ])
                }>
                Add Account
              </Button>

              <View style={{ margin: 25 }}>
                <FormButton
                  buttonType="outline"
                  onPress={handleSubmit}
                  title={isCreate ? 'Save' : 'Update'}
                  buttonColor="#F57C00" //TODO
                  disabled={!isValid || isSubmitting}
                  loading={isSubmitting}
                />
              </View>
            </View>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
    // </View>


  );


};

export default CreateEditForm;