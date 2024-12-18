import React, { useEffect, useState } from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import LoginScreen from "./screens/LoginScreen"
import AddQueueScreen from "./screens/AddQueueScreen"
import "./global.css"
import AsyncStorage from "@react-native-async-storage/async-storage"
import "react-native-gesture-handler"

const Stack = createStackNavigator()

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="AddQueueScreen">
                <Stack.Screen
                    name="LoginScreen"
                    component={LoginScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="AddQueueScreen"
                    component={AddQueueScreen}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}
