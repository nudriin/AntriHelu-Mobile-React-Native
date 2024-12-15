import React, { useEffect, useState } from "react"
import { Button, Text, View } from "react-native"
import { socket } from "../socket/socket"

export default function AddQueueScreen() {
    const [queues, setQueues] = useState<number[]>([])

    useEffect(() => {
        socket.connect()

        socket.on("total", (data: number[]) => {
            setQueues(data)
        })

        return () => {
            socket.disconnect()
        }
    }, [])

    const addQueue = (locketId: number) => {
        socket.emit("addQueue", locketId)
    }

    return (
        <View style={{ padding: 20 }}>
            {queues.map((queue, index) => (
                <View key={index}>
                    <Text>
                        Antrian Loket {index + 1}: {queue}
                    </Text>
                    <Button
                        title="Tambah Antrian"
                        onPress={() => addQueue(index + 1)}
                    />
                </View>
            ))}
        </View>
    )
}
