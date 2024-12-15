import React, { useCallback, useEffect, useState } from "react"
import {
    ActivityIndicator,
    Button,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native"
import { socket } from "../socket/socket"
import AsyncStorage from "@react-native-async-storage/async-storage"

function getLocketCodeFromName(locketName: string | undefined) {
    if (!locketName) return ""
    const name = locketName.toUpperCase()
    if (name.length < 2) return name // Jika nama terlalu pendek, kembalikan apa adanya
    return `${name[0]}${name[name.length - 1]}` // Mengambil huruf pertama dan terakhir
}

export interface Locket {
    id: number
    name: string
    createdAt: Date
}

export interface QueueAggregateResponse {
    total?: number
    currentQueue?: number
    nextQueue?: number
    queueRemainder?: number
    locket_id: number
}

export default function AddQueueScreen() {
    const [loading, setLoading] = useState(false)
    const [locket, setLocket] = useState<Locket[]>([])
    const [queues, setQueues] = useState<Map<number, QueueAggregateResponse>>(
        new Map()
    )

    const getAllLocket = useCallback(async () => {
        try {
            setLoading(true)
            const response = await fetch(
                "https://api-queue.nudriin.space/api/locket",
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            )

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
                    `https://api-queue.nudriin.space/api/queue/locket/${value.id}/total`,
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
            const response = await fetch(
                "https://api-queue.nudriin.space/api/queue",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        locket_id: id,
                    }),
                }
            )

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
        <ScrollView contentContainerStyle={{ padding: 20 }}>
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

                let backgroundColor = "#fff"
                if (index === 0) backgroundColor = "#8E8CFF"
                else if (index === 1) backgroundColor = "#FFB800"
                // Add other color conditions as necessary

                return (
                    <View
                        key={index}
                        style={{
                            marginBottom: 20,
                            backgroundColor,
                            padding: 20,
                            borderRadius: 10,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 24,
                                fontWeight: "bold",
                                marginBottom: 10,
                            }}
                        >
                            Antrian Loket {value.name}
                        </Text>
                        <Text
                            style={{
                                fontSize: 32,
                                fontWeight: "bold",
                                marginBottom: 10,
                            }}
                        >
                            {total}
                        </Text>
                        <Text style={{ fontSize: 20, marginBottom: 20 }}>
                            Loket {value.name}
                        </Text>

                        <TouchableOpacity
                            onPress={(e) => {
                                addQueue(value.id)
                            }}
                            disabled={loading}
                            style={{
                                backgroundColor: "#4CAF50",
                                padding: 10,
                                borderRadius: 5,
                                alignItems: "center",
                            }}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text
                                    style={{
                                        color: "#fff",
                                        fontWeight: "bold",
                                    }}
                                >
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
