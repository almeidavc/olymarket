const userIdToSocketId = new Map<string, string>([])
const socketIdToUserId = new Map<string, string>([])

export function registerConnection(socketId: string, userId: string) {
  userIdToSocketId.set(userId, socketId)
  socketIdToUserId.set(socketId, userId)
}

export function removeConnection(socketId: string) {
  const userId = socketIdToUserId.get(socketId)!
  userIdToSocketId.delete(userId)
  socketIdToUserId.delete(socketId)
}

export function getSocketIdByUserId(userId: string) {
  return userIdToSocketId.get(userId)
}
