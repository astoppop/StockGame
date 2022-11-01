import { ScrollView, StyleSheet, Text, View, Button, Image, TouchableOpacity, Modal, TextInput, Pressable} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';

const filledPlus = require('./assets/filledPlus.png');
const transparentPlus = require('./assets/transparentPlus.png');
const filledHome = require('./assets/filledHome.png');
const transparentHome = require('./assets/transparentHome.png');
const filledList = require('./assets/filledList.png');
const transparentList = require('./assets/transparentList.png');
const closeX = require('./assets/close.png');
const calendar = require('./assets/calendar.png');
const check = require('./assets/check.png');

const Tab = createBottomTabNavigator();

let tasks = [];

class Task {
    constructor(title, desc, date, time) {
        this.title = title;
        this.desc = desc;
        this.date = date;
    }
};

const Placeholder = () => <View/>;
const now = new Date();

const App = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [calendarVisible, setCalendarVisible] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [day, setDay] = useState(-1);
    const [month, setMonth] = useState(-1);
    const [year, setYear] = useState(-1);
    const [minute, setMinute] = useState(59);
    const [hour, setHour] = useState(23);
    const [toDoKeyRender, toDoRerender] = useState("");

    const calcTimeDiff = (date1, date2) => {
        return (date2.getTime() - date1.getTime()) / (1000 * 60);
    };

    const getTextFromDiff = (diff) => {
        if (diff < 0) {return "Overdue";}
        else if (diff <= 1) {return "Due in < 1 minute";}
        else if (diff < 180) {return "Due in " + Math.round(diff) + " minutes";}
        else if (diff < 1440) {return "Due in " + Math.round(diff / 60) + " hours";}
        else {return "Due in " + Math.round(diff / 1440) + " days";}
    }

    function sortTime(tasks) {
        let taskTimes = tasks.map((item) => {
            return [calcTimeDiff(now, item.date), item];
        });
        taskTimes = taskTimes.sort(function(a, b) {return a[0] - b[0]});
        let dueToday = [];
        let dueWeek = [];
        let dueLater = [];

        const minTilMidnightDate = new Date();
        minTilMidnightDate.setHours(24, 0, 0, 0);
        let minTilMidnight = (minTilMidnightDate.getTime() - now.getTime()) / (1000 * 60);

        for (let i = 0; i < taskTimes.length; i++) {
            if (taskTimes[i][0] <= minTilMidnight) {
                dueToday.push(taskTimes[i][1]);
            } else if (taskTimes[i][0] <= 10080) {
                dueWeek.push(taskTimes[i][1]);
            } else {
                dueLater.push(taskTimes[i][1]);
            }
        }

        return [dueToday, dueWeek, dueLater];
    };

    // saveData = async () => {
    //     try {
    //         await AsyncStorage.setItem("data", JSON.stringify(taskItems));
    //     }
    //     catch (error) {
    //         console.log(error);
    //     }
    // }
    
    // async function loadData() {
    //     let data;
    //     let parsed = [];
    //     try {
    //         data = await AsyncStorage.getItem("data");
    //         parsed = JSON.parse(data);
    //         // setTaskItems(parsed);
    //         return parsed;
    //     }
    //     catch (error) {
    //         console.log(error);
    //     }
    // }

    const displayTask = (item, index) => (
        <View key={ index } style={{
            backgroundColor: '#f2f2f2',
            borderRadius: 15,
            margin: 10,
        }}>
            <View style={{
                marginRight: 55,
                padding: 5,
                minHeight: 35,
                alignContent: 'center',
                justifyContent: 'center',
            }}>
                <Text style={{
                    fontSize: 20,
                    alignSelf: 'center',
                    marginTop: 5,
                    marginBottom: 5,
                }}>{ item.title }</Text>
                {item.desc != "" && <Text style={ styles.taskText }>{ item.desc }</Text>}
                <Text style={ styles.taskText }>{ getTextFromDiff(calcTimeDiff(now, item.date)) }</Text>
            </View>
            <Pressable
                onPress={() => {
                    tasks.splice(index, 1);
                    // saveData(tasks);
                    if (toDoKeyRender.length > 0) {toDoRerender("");}
                    else {toDoRerender("a");}
                }}
                style={{
                    position: 'absolute',
                    backgroundColor: '#028cc9',
                    right: 0,
                    height: '100%',
                    width: 50,
                    borderTopRightRadius: 15,
                    borderBottomRightRadius: 15,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                <Image
                    source={ check }
                    style={{
                        width: 35,
                        height: 35,
                        tintColor: '#fff',
                    }}
                />
            </Pressable>
        </View>
    );

    const Home = () => {
        // useEffect(() => {
        //     // loadData().then(
        //     //     loadedTasks => {
        //     //         // console.log(loadedTasks);
        //     //         tasks = loadedTasks;
        //     //     }
        //     // );
        //     // tasks = taskItems;
        //     console.log(tasks);
        // }, []);

        return (
            <ScrollView style={{
                flex: 1,
                flexDirection: 'column',
                marginBottom: 65,
                backgroundColor: '#fff',
            }}>
                <Text style={{
                    fontSize: 30,
                    alignSelf: 'center',
                    marginTop: 15,
                    marginBottom: 10,
                }}>Due Today</Text>
                { sortTime(tasks)[0].map((item, index) => { return displayTask(item, index); }) }
                <Text style={{
                    fontSize: 30,
                    alignSelf: 'center',
                    marginTop: 15,
                    marginBottom: 10,
                }}>Due This Week</Text>
                { sortTime(tasks)[1].map((item, index) => { return displayTask(item, index); }) }
                <Text style={{
                    fontSize: 30,
                    alignSelf: 'center',
                    marginTop: 15,
                    marginBottom: 10,
                }}>Due Later</Text>
                { sortTime(tasks)[2].map((item, index) => { return displayTask(item, index); }) }
            </ScrollView>
        );
    }

    const ToDo = () => {
        return (
            <ScrollView key={ toDoKeyRender } style= {{
                flex: 1,
                flexDirection: 'column',
                marginBottom: 65,
                backgroundColor: '#fff',
            }}>
                {tasks.map((item, index) => { return displayTask(item, index); })}
            </ScrollView>
        );
    }

    useEffect(() => {
        setDay(now.getDate());
        setMonth(now.getMonth());
        setYear(now.getFullYear());
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <Modal
                animationType='fade'
                transparent={ true }
                visible={ modalVisible }
                onRequestClose={() => {
                    setModalVisible(false);
                }}
                hardwareAccelerated={ true }
            >
                <View style={{
                    backgroundColor: '#000',
                    flex: 1,
                    opacity: 0.8,
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                }} />

                <View style={{
                    width: '100%',
                    height: '100%',
                }}>
                    <View style={{
                        width: '100%',
                        height: '100%',
                    }}>
                        <View style={{
                            width: '90%',
                            height: '90%',
                            padding: 20,
                            margin: 20,
                            borderRadius: 8,
                            backgroundColor: '#fff',
                            shadowColor: '#4048BF',
                            shadowOffset:{
                                width: 8.4,
                                height: 8.4
                            },
                            shadowOpacity: 0.74,
                            shadowRadius: 30,
                            elevation: 10,
                            alignItems: 'center',
                        }}>
                            <Text style={{
                                color: "#404040",
                                fontSize: 30,
                                marginTop: 10,
                                marginBottom: 30,
                            }}>Add Task</Text>

                            <Text style={ styles.textInputText }>Title</Text>
                            <View style={ styles.textInputView }>
                                <TextInput
                                    style={{
                                        padding: 2,
                                        paddingLeft: 4,
                                        paddingRight: 4,
                                    }}
                                    placeholder='Title'
                                    placeholderTextColor='#808080'
                                    onChangeText={(text) => setTitle(text.trim())}
                                />
                            </View>

                            <Text style={ styles.textInputText }>Description</Text>
                            <View style={[ styles.textInputView, {
                                minHeight: 100,
                            } ]}>
                                <TextInput
                                    style={{
                                        height: 150,
                                        padding: 2,
                                        paddingLeft: 4,
                                        paddingRight: 4,
                                        textAlign: 'left',
                                        textAlignVertical: 'top',
                                    }}
                                    multiline={ true }
                                    placeholder='Description (optional)'
                                    placeholderTextColor='#808080'
                                    onChangeText={(text) => setDescription(text.trim())}
                                />
                            </View>

                            <Text style={ styles.textInputText }>Date</Text>
                            <View style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                                <Text>{ month + 1 } / { day } / { year }</Text>
                                <Pressable
                                    onPress={() => setCalendarVisible(true)}>
                                    <Image 
                                        source={ calendar }
                                        style={{
                                            width: 50,
                                            height: 50,
                                        }}
                                    />
                                </Pressable>
                            </View>
                            <View style={{
                                    position: 'absolute',
                                }}>
                                { modalVisible && calendarVisible &&
                                <Calendar
                                    onDayPress={day => {
                                        setDay(day.day);
                                        setMonth(day.month - 1);
                                        setYear(day.year);
                                        setCalendarVisible(false);
                                    }}
                                />}
                            </View>
                            
                            <Text style={ styles.textInputText }>Time</Text>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                            }}>
                                <TextInput
                                        style={{
                                            padding: 2,
                                            paddingLeft: 4,
                                            paddingRight: 4,
                                            textAlign: 'left',
                                            textAlignVertical: 'top',
                                        }}
                                        maxLength={ 2 }
                                        placeholder='23'
                                        placeholderTextColor='#808080'
                                        onChangeText={(text) => setHour(text.trim())}
                                        keyboardType='phone-pad'
                                />
                                <Text>:</Text>
                                <TextInput
                                        style={{
                                            padding: 2,
                                            paddingLeft: 4,
                                            paddingRight: 4,
                                            textAlign: 'left',
                                            textAlignVertical: 'top',
                                        }}
                                        maxLength={ 2 }
                                        placeholder='59'
                                        placeholderTextColor='#808080'
                                        onChangeText={(text) => setMinute(text.trim())}
                                        keyboardType='phone-pad'
                                />
                            </View>

                            <Pressable
                                onPress={() => setModalVisible(false)}
                                style={{
                                    position: 'absolute',
                                    backgroundColor: '#028cc9',
                                    top: 0,
                                    right: 0,
                                    borderTopRightRadius: 8,
                                    borderBottomLeftRadius: 8,
                                    width: 50,
                                    height: 50,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <Image
                                        source={ closeX }
                                        style={{
                                            width: '90%',
                                            height: '90%',
                                            tintColor: '#fff',
                                        }}
                                    />
                            </Pressable>
                                
                            <Pressable
                                onPress={() => {
                                    let task;
                                    let date = new Date(year, month, day, hour, minute)
                                    if (title == "") {task = new Task('New Task', description, date);}
                                    else {task = new Task(title, description, date);}

                                    tasks.push(task);
                                    // saveData(tasks);

                                    setTitle("");
                                    setDescription("");

                                    let now = new Date();
                                    setDay(now.getDate());
                                    setMonth(now.getMonth());
                                    setYear(now.getFullYear());
                                    
                                    setMinute(59);
                                    setHour(23);

                                    setModalVisible(false);
                                }}
                                style={{
                                    backgroundColor: '#028cc9',
                                    width: 80,
                                    height: 80,
                                    borderRadius: 40,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                <Image
                                    source={ filledPlus }
                                    style={{
                                        width: '60%',
                                        height: '60%',
                                        tintColor: '#fff',
                                    }}
                                />
                            </Pressable>
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
                        alignContent: 'center',
                        justifyContent: 'center',
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
                                    <TouchableOpacity activeOpacity={ 0.9 } onPress={() => setModalVisible(true)}
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
    textInputView: {
        width: '95%',
        borderWidth: 2,
        borderColor: '#000',
        borderRadius: 5,
        marginBottom: 10,
    },
    taskText: {
        marginLeft: 20,
        paddingBottom: 10,
        fontSize: 15,
        color: '#00161f',
    },
});

export default App;