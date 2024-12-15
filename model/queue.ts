export interface QueueAggregateResponse {
    total?: number
    currentQueue?: number
    nextQueue?: number
    queueRemainder?: number
    locket_id: number
}
