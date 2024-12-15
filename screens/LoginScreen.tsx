import React, { useState } from "react"
import {
    Text,
    TextInput,
    View,
    ActivityIndicator,
    TouchableOpacity,
    Image,
} from "react-native"
import { useForm, Controller } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { StackNavigationProp } from "@react-navigation/stack"
import { RootStackParamList } from "../types"
import config from "../config"
import image from "../constants/image"

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
                `${config.API_BASE_URL}/api/users/login`,
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
        <View className="h-full w-full p-6 items-center justify-center">
            <Text className="font-bold text-3xl text-center text-blck mb-4">
                Selamat Datang di Dinas Pendidikan Kota Palangka Raya
            </Text>
            <Image
                source={image.disdikLogo}
                className="w-[100px] h-[130px] mb-4"
            />
            <Text className="text-center font-poppinsR text-lightGrey mb-4">
                Mohon inputkan data anda dengan benar
            </Text>
            <View className="w-full">
                <Text className="font-bold text-lg mb-1">Email</Text>
                <Controller
                    name="email"
                    control={form.control}
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            className="border rounded-lg mb-4 p-4"
                            placeholder="Email"
                            value={value}
                            onChangeText={onChange}
                        />
                    )}
                />
            </View>

            <View className="w-full">
                <Text className="font-bold text-lg mb-1">Password</Text>
                <Controller
                    name="password"
                    control={form.control}
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            className="border rounded-lg mb-4 p-4"
                            placeholder="Password"
                            secureTextEntry
                            value={value}
                            onChangeText={onChange}
                        />
                    )}
                />
            </View>

            {loading ? (
                <ActivityIndicator size="large" />
            ) : (
                <View className="w-full">
                    <TouchableOpacity
                        className="bg-blues rounded-lg p-3"
                        onPress={form.handleSubmit(handleLogin)}
                        disabled={form.formState.isSubmitting}
                    >
                        <Text className="text-white text-xl font-poppinsR text-center">
                            Login
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    )
}
