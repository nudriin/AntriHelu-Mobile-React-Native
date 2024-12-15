import React, { useEffect, useState } from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import LoginScreen from "./screens/LoginScreen"
import AddQueueScreen from "./screens/AddQueueScreen"
import "./global.css"
import AsyncStorage from "@react-native-async-storage/async-storage"

const Stack = createStackNavigator()

export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)

    useEffect(() => {
        const checkLoginStatus = async () => {
            const token = await AsyncStorage.getItem("authToken")
            setIsLoggedIn(!!token) // Jika token ada, berarti sudah login
        }
        checkLoginStatus()
    }, [])

    return (
        <NavigationContainer>
            <Stack.Navigator>
                {isLoggedIn ? (
                    <>
                        <Stack.Screen
                            name="AddQueueScreen"
                            component={AddQueueScreen}
                            options={{ headerShown: false }}
                        />
                    </>
                ) : (
                    <>
                        <Stack.Screen
                            name="LoginScreen"
                            component={LoginScreen}
                            options={{ headerShown: false }}
                        />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    )
}
