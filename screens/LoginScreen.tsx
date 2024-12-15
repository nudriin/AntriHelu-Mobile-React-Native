import React, { useState } from "react"
import { Button, Text, TextInput, View, ActivityIndicator } from "react-native"
import { useForm, Controller } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { StackNavigationProp } from "@react-navigation/stack"
import { RootStackParamList } from "../types"

const formSchema = z.object({
    email: z.string().email({ message: "Email tidak valid" }).min(1),
    password: z.string().min(4, { message: "Password minimal 4 karakter" }),
})

type FormSchemaType = z.infer<typeof formSchema>

type LoginScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    "LoginScreen"
>

interface LoginScreenProps {
    navigation: LoginScreenNavigationProp
}

export default function LoginScreen({ navigation }: LoginScreenProps) {
    const form = useForm<FormSchemaType>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const [loading, setLoading] = useState(false)

    const handleLogin = async (data: FormSchemaType) => {
        setLoading(true)
        try {
            const response = await fetch(
                "https://api-queue.nudriin.space/api/users/login",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                }
            )

            const responseBody = await response.json()

            if (responseBody.data) {
                await AsyncStorage.setItem("authToken", responseBody.data.token)
                navigation.navigate("AddQueueScreen") // This will now have proper type checking
            } else {
                alert("Login gagal, periksa email/password Anda!")
            }
        } catch (error) {
            console.error(error)
            alert("Something went wrong, please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <View style={{ padding: 20 }}>
            <Text>Email</Text>
            <Controller
                name="email"
                control={form.control}
                render={({ field: { onChange, value } }) => (
                    <TextInput
                        style={{ borderWidth: 1, marginBottom: 10 }}
                        placeholder="Email"
                        value={value}
                        onChangeText={onChange}
                    />
                )}
            />

            <Text>Password</Text>
            <Controller
                name="password"
                control={form.control}
                render={({ field: { onChange, value } }) => (
                    <TextInput
                        style={{ borderWidth: 1, marginBottom: 10 }}
                        placeholder="Password"
                        secureTextEntry
                        value={value}
                        onChangeText={onChange}
                    />
                )}
            />

            {loading ? (
                <ActivityIndicator size="large" />
            ) : (
                <Button
                    title="Login"
                    onPress={form.handleSubmit(handleLogin)}
                    disabled={form.formState.isSubmitting}
                />
            )}
        </View>
    )
}
