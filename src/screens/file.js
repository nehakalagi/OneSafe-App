// Example of File Picker in React Native
// https://aboutreact.com/file-picker-in-react-native/

// Import React
import React, { useState } from 'react';
// Import required components
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    Image,
    Button,
} from 'react-native';

// Import Document Picker
import DocumentPicker from 'react-native-document-picker';
import BackgroundColor from 'react-native-background-color';
import RNFS from "react-native-fs";
import CryptoJS from 'react-native-crypto-js';
import Toast from 'react-native-simple-toast';


//Encryption
//const encrypt = (URI) => {
//  return CryptoJS.AES.encrypt(URI, 'secret key 123').toString();
// console.log(URI)
//}



readFile = async (MyPath) => {
    try {
        //const path =MyPath+ "/rn.txt";
        const path = MyPath;
        const contents = await RNFS.readFile(path, "utf8");
        return ("" + contents);
    } catch (e) {
        alert("" + e);
    }
};

//Decryption

const decrypt = (newContent) => {
    let bytes = CryptoJS.AES.decrypt(newContent, 'secret key 123');
    let originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText.toString();
    //console.log("DECRYPTED")
}


const App = () => {
    const [singleFile, setSingleFile] = useState('');
    const [multipleFile, setMultipleFile] = useState([]);
    const [file, setFile] = useState([]);

    const selectOneFile = async () => {
        //Opening Document Picker for selection of one file
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.plainText],
                //There can me more options as well
                // DocumentPicker.types.allFiles
                // DocumentPicker.types.images
                // DocumentPicker.types.plainText
                // DocumentPicker.types.audio
                // DocumentPicker.types.pdf
            });
            //Printing the log realted to the file
            console.log('res : ' + JSON.stringify(res));
            console.log('URI : ' + res.uri);
            console.log('Type : ' + res.type);
            console.log('File Name : ' + res.name);
            console.log('File Size : ' + res.size);

            

            //for path
            var RNGRP = require('react-native-get-real-path');
            RNGRP.getRealPathFromURI(res.uri).then(URI =>
                content = RNFS.readFile(URI).then(content => {
                    //Printing the path
                    console.log(URI)
                    //Printing Contents of file
                    console.log(content)
                    // console.log("Hello world")
                    var newContent = encrypt(URI);

                    var DecryptContent = decrypt(newContent);
                    //console.log("Hello world")
                    //Printing Encrypted content
                    console.log(newContent)


                    // write the file
                    var path = URI;
                    RNFS.writeFile(path, newContent, 'utf8')
                        .then((success) => {
                            console.log('FILE ENCRYPTED AND WRITTEN!');
                            Toast.show('Selected File is Encrypted', Toast.LONG);
                        })
                        .catch((err) => {
                            console.log(err.message);
                        });


                    // write the file
                    var path = URI;
                    RNFS.writeFile(path, DecryptContent, 'utf8')
                        .then((success) => {
                            console.log('FILE DECRYPTED AND WRITTEN!');
                            Toast.show('Selected File is Decrypted', Toast.LONG);
                        })
                        .catch((err) => {
                            console.log(err.message);
                        });


                }
                )
            )

            //Encryption
            const encrypt = (newContent) => {
                return CryptoJS.AES.encrypt(newContent, 'secret key 123').toString();
                //console.log("Hello world")
                //console.log(newContent)
            }


            
            //RNFS.writeFile(path, contents, 'ascii').then(res => {
            //console.log(err.message, err.code)
            //});


            //content=encrypt(content);
            // console.log(content)
            //const content = RNFS.readFile(RNGRP);
            //console.log(content);

            //Setting the state to show single file attributes
            setSingleFile(res);

        } catch (err) {
            //Handling any exception (If any)
            if (DocumentPicker.isCancel(err)) {
                //If user canceled the document selection
                alert('Canceled from single doc picker');
            } else {
                //For Unknown Error
                alert('Unknown Error: ' + JSON.stringify(err));
                throw err;
            }
        }
    };

    {/* const selectMultipleFile = async () => {
            //Opening Document Picker for selection of multiple file
            try {
                const results = await DocumentPicker.pickMultiple({
                    type: [DocumentPicker.types.images],
                    //There can me more options as well find above
                });
                for (const res of results) {
                    //Printing the log realted to the file
                    console.log('res : ' + JSON.stringify(res));
                    console.log('URI : ' + res.uri);
                    console.log('Type : ' + res.type);
                    console.log('File Name : ' + res.name);
                    console.log('File Size : ' + res.size);
                }
                const content = readFile(res.uri);
                console.log(content);
                //Setting the state to show multiple file attributes
                setMultipleFile(results);
            } catch (err) {
                //Handling any exception (If any)
                if (DocumentPicker.isCancel(err)) {
                    //If user canceled the document selection
                    alert('Canceled from multiple doc picker');
                } else {
                    //For Unknown Error
                    alert('Unknown Error: ' + JSON.stringify(err));
                    throw err;
                }
            }
        };*/}

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Text style={styles.titleText}>
                Upload File
            </Text>
            <View style={styles.container}>
                {/*To show single file attribute*/}
                <TouchableOpacity
                    activeOpacity={0.5}
                    style={styles.buttonStyle}
                    onPress={selectOneFile}>
                    {/*Single file selection button*/}
                    <Text style={{ marginRight: 10, fontSize: 19, }}>
                        Click here to pick one file
                    </Text>
                    <Image
                        source={{
                            uri: 'https://img.icons8.com/offices/40/000000/attach.png',
                        }}
                        style={styles.imageIconStyle}
                    />
                </TouchableOpacity>
                {/*Showing the data of selected Single file*/}
                <Text style={styles.textStyle}>
                    File Name: {singleFile.name ? singleFile.name : ''}
                    {'\n'}
                    Type: {singleFile.type ? singleFile.type : ''}
                    {'\n'}
                    File Size: {singleFile.size ? singleFile.size : ''}
                    {'\n'}
                    URI: {singleFile.uri ? singleFile.uri : ''}
                    {'\n'}
                </Text>

                <Button
                    title="DECRYPT"
                    color="#FFDAB9"
                    onPress={() => decrypt(newContent)}
                />
                <View
                    style={{
                        backgroundColor: 'grey',
                        height: 2,
                        margin: 10
                    }} />

                {/*To multiple single file attribute*/}
                {/* <TouchableOpacity
                        activeOpacity={0.5}
                        style={styles.buttonStyle}
                        onPress={selectMultipleFile}>
                        //Multiple files selection button
                        <Text style={{ marginRight: 10, fontSize: 19 }}>
                            Click here to pick multiple files
                        </Text>
                        <Image
                            source={{
                                uri: 'https://img.icons8.com/offices/40/000000/attach.png',
                            }}
                            style={styles.imageIconStyle}
                        />
                    </TouchableOpacity>
                    <ScrollView>
                        //Showing the data of selected Multiple files
                        {multipleFile.map((item, key) => (
                            <View key={key}>
                                <Text style={styles.textStyle}>
                                    File Name: {item.name ? item.name : ''}
                                    {'\n'}
                                    Type: {item.type ? item.type : ''}
                                    {'\n'}
                                    File Size: {item.size ? item.size : ''}
                                    {'\n'}
                                    URI: {item.uri ? item.uri : ''}
                                    {'\n'}
                                </Text>
                            </View>
                        ))}
                    </ScrollView> */}


            </View >
        </SafeAreaView >
    );
};

export default App;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF8DC',
        padding: 16,
        paddingHorizontal: 20,
    },
    titleText: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingVertical: 20,
        color: '#2F4F4F',
        backgroundColor: '#FAEBD7',

    },
    textStyle: {
        backgroundColor: '#FAEBD7',
        fontSize: 18,
        marginTop: 16,
        color: 'black',
    },
    buttonStyle: {
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: '#FFDAB9',
        padding: 5,
    },
    imageIconStyle: {
        height: 20,
        width: 20,
        resizeMode: 'stretch',
    },
    item: {
        marginTop: 80,
        padding: 30,
        backgroundColor: 'pink',
        fontSize: 24,
    }
});