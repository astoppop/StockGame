import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, View, Button, Image, TouchableOpacity, Modal, Pressable } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useState } from 'react';

import Home from './screens/Home.js';
import ToDo from './screens/ToDo.js';

const filledPlus = require('./assets/filledPlus.png');
const transparentPlus = require('./assets/transparentPlus.png');
const filledHome = require('./assets/filledHome.png');
const transparentHome = require('./assets/transparentHome.png');
const filledList = require('./assets/filledList.png');
const transparentList = require('./assets/transparentList.png');

const Tab = createBottomTabNavigator();

const Placeholder = () => <View/>;

const App = () => {
    const [modalVisible, setModalVisible] = useState(false);
    return (
        <View style={{ flex: 1 }}>
            <Modal
                animationType='fade'
                transparent={ true }
                visible={ modalVisible }
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
                hardwareAccelerated={ true }
            >
                <View style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#000000',
                    flex: 1,
                    opacity: 0.8,
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                }} />
                
                <View style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                }}>
                    <View style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <View style={[ styles.wrap ]}>
                            <Text style={{
                                color: "#404040",
                                fontSize: 60,
                                marginTop: 10,
                                marginBottom: 30,
                            }}>My Goals</Text>
                            <View style={{flexDirection: 'row'}}>
                                <TouchableOpacity style={{
                                    backgroundColor: "transparent",
                                    borderRadius: 100,
                                    borderColor: '#404040',
                                    marginTop: 64,
                                    borderWidth: 1,
                                    paddingTop: 16,
                                    paddingBottom: 16,
                                    paddingLeft: 25,
                                    paddingRight: 25,
                                    marginHorizontal: 5,
                                    flex: 1,
                                    alignItems: 'center',
                                }}
                                onPress={() => setModalVisible(!modalVisible)}>
                                    <Text style={{
                                        color: "#404040",
                                        fontSize: 17.5,
                                    }}>Close</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
            
            <NavigationContainer>
                <Tab.Navigator screenOptions={{
                    tabBarStyle: {
                        position: 'absolute',
                        backgroundColor: '#00161f',
                        height: 65,
                    },
                    tabBarLabelPosition: 'below-icon',
                    tabBarOptions: { showIcon: true },
                    tabBarActiveTintColor: '#EEEADE',
                    tabBarInactiveTintColor: '#808080',
                }}>
                    <Tab.Screen name='Home' component={ Home } options={{
                        tabBarIcon: ({ focused, color, size }) => (
                            <Image
                                source={ focused ? filledHome : transparentHome }
                                style={{
                                    width: 35,
                                    height: 35, 
                                    tintColor: '#EEEADE',
                                }}
                            />
                        ),
                    }}/>
                    <Tab.Screen name='Add Task' component={ Placeholder } options={{
                            tabBarLabel: () => null,
                            tabBarIcon: ({ focused, color, size }) => (
                                <Image
                                    source={ focused ? filledPlus : transparentPlus }
                                    style={{
                                        width: 50,
                                        height: 50,
                                        tintColor: focused ? '#EEEADE' : '#00161f',
                                    }}
                                />
                            ),
                            tabBarButton: ({ children, onPress }) => (
                                <View style={{
                                    top: -15,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                    <View style={{
                                        position: 'absolute',
                                        width: 98,
                                        height: 98,
                                        backgroundColor: '#00161f',
                                        borderRadius: 50,
                                    }} />
                                    <TouchableOpacity activeOpacity={ 0.9 } onPress={ () => setModalVisible(true) }
                                    style={{
                                        width: 80,
                                        height: 80,
                                        backgroundColor: '#028cc9',
                                        borderRadius: 50,
                                    }}>
                                        { children }
                                    </TouchableOpacity>
                                </View>
                            ),
                        }}
                    />
                    <Tab.Screen name='To Do' component={ ToDo } options={{
                        tabBarIcon: ({ focused, color, size }) => {
                            return <Image
                                source={ focused ? filledList : transparentList }
                                style={{
                                    width: 35,
                                    height: 35, 
                                    tintColor: '#EEEADE',
                                }}
                            />
                        },
                    }}/>
                </Tab.Navigator>
            </NavigationContainer>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#808000',
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollContainer: {
        // backgroundColor: 'purple',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'stretch',
        flexProperty: 'flexWrap',
    },
    button: {
        backgroundColor: 'red',
        color: 'red',
        alignItems: 'center',
    },
    wrap:{
        width: 500,
        height: 500,
        padding: 20,
        margin: 20,
        borderRadius: 8,
        backgroundColor: 'white',
        shadowColor: '#4048BF',
        shadowOffset:{
            width: 8.4,
            height: 8.4
        },
        shadowOpacity: 0.74,
        shadowRadius: 30,
        elevation: 10,
        alignItems: 'center',
    },
});

export default App;