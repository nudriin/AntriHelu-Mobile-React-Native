import React, { useCallback, useEffect, useState } from "react"
import {
    ActivityIndicator,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native"
import { socket } from "../socket/socket"
import AsyncStorage from "@react-native-async-storage/async-storage"
import getLocketCodeFromName from "../helper/getLocketCodeFromName"
import printQueue from "../helper/printQueue"
import { Locket } from "../model/locket"
import { QueueAggregateResponse } from "../model/queue"
import config from "../config"

export default function AddQueueScreen() {
    const [loading, setLoading] = useState(false)
    const [locket, setLocket] = useState<Locket[]>([])
    const [queues, setQueues] = useState<Map<number, QueueAggregateResponse>>(
        new Map()
    )

    const getAllLocket = useCallback(async () => {
        try {
            setLoading(true)
            const response = await fetch(`${config.API_BASE_URL}/api/locket`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })

            const body = await response.json()
            if (!body.errors) {
                setLocket(body.data)
            } else {
                throw new Error(body.errors)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }, [])

    const getTotalQueue = useCallback(async () => {
        if (locket.length === 0) return // Exit if no locket data

        try {
            setLoading(true)
            const queuePromises = locket.map(async (value) => {
                const response = await fetch(
                    `${config.API_BASE_URL}/api/queue/locket/${value.id}/total`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                )

                return await response.json()
            })

            const result = await Promise.all(queuePromises)
            const queueMap = new Map<number, QueueAggregateResponse>()
            result.forEach((result: any) => {
                if (!result.errors) {
                    queueMap.set(result.data.locket_id, result.data)
                } else {
                    console.error(result.errors)
                    throw new Error(result.errors)
                }
            })

            setQueues(queueMap)
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.log(error)
        }
    }, [locket])

    useEffect(() => {
        getAllLocket()
    }, [getAllLocket])

    useEffect(() => {
        getTotalQueue()
    }, [getTotalQueue])

    useEffect(() => {
        setLoading(true)

        socket.connect()
        socket.on("connect", () => {
            console.log(socket.id) // an alphanumeric id...
        })

        const onTotal = () => {
            getTotalQueue()
        }

        socket.on("total", onTotal)

        setLoading(false)
        return () => {
            socket.off("total", onTotal)
        }
    }, [getTotalQueue])

    const addQueue = async (id: number) => {
        try {
            setLoading(true)
            socket.emit("getTotalQueue", id)
            socket.emit("getRemainQueue", id)
            socket.emit("getNextQueue", id)
            socket.emit("getAllQueue", id)

            const token = await AsyncStorage.getItem("authToken") // Get auth token from AsyncStorage
            const response = await fetch(`${config.API_BASE_URL}/api/queue`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    locket_id: id,
                }),
            })

            const body = await response.json()
            if (!body.errors) {
                await getTotalQueue()
                alert("Antrian berhasil di ambil")
                setLoading(false)
            } else {
                setLoading(false)
                alert(`Terjadi error ${body.errors}`)
                throw new Error(body.errors)
            }
        } catch (error) {
            setLoading(false)
            console.log(error)
        }
    }

    return (
        <ScrollView
            className="mt-8 bg-ash"
            contentContainerStyle={{ padding: 20 }}
        >
            {locket.map((value, index) => {
                const totalQueue = queues.get(value.id)?.total ?? 0
                const locketCode = getLocketCodeFromName(value.name)
                const total = `${locketCode}${String(totalQueue).padStart(
                    2,
                    "0"
                )}`
                const totalPrint = `${locketCode}${String(
                    totalQueue + 1
                ).padStart(2, "0")}`

                return (
                    <View
                        className="text-center bg-white border-2 mb-4 p-6 rounded-3xl"
                        key={index}
                    >
                        <Text className="text-center text-blck font-medium text-2xl mb-2">
                            Antrian Loket
                        </Text>
                        <Text className="text-center text-blues text-4xl font-bold mt-4 mb-4">
                            {total}
                        </Text>
                        <Text className="text-center text-blck font-medium text-2xl mb-3">
                            {value.name.toUpperCase()}
                        </Text>

                        <TouchableOpacity
                            className="bg-blues text-center p-4 rounded-lg"
                            onPress={(e) => {
                                addQueue(value.id)
                                printQueue(value.name, totalQueue)
                            }}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text className="text-center text-white font-bold">
                                    Tambah Antrian
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                )
            })}
        </ScrollView>
    )
}
