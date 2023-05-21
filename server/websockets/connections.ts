const userIdToSocketId = new Map([])
const socketIdToUserId = new Map([])

export function registerConnection(socketId: string, userId: string) {
  userIdToSocketId[userId] = socketId
  socketIdToUserId[socketId] = userId
}

export function removeConnection(socketId: string) {
  const userId = socketIdToUserId[socketId]
  delete userIdToSocketId[userId]
  delete socketIdToUserId[socketId]
}

export function getSocketIdByUserId(userId: string) {
  return userIdToSocketId[userId]
}
