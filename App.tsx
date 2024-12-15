import React from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import LoginScreen from "./screens/LoginScreen"
import AddQueueScreen from "./screens/AddQueueScreen"

const Stack = createStackNavigator()

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="LoginScreen">
                <Stack.Screen name="LoginScreen" component={LoginScreen} />
                <Stack.Screen
                    name="AddQueueScreen"
                    component={AddQueueScreen}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}
