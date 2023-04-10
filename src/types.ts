export type RequestToAuth = {
  sessionId: string,
  serverId: number,
  authPlugin: number,
  authPage: string,
  waitingPageConfig?: any,
  accessToken: string,
}

export type WaitJoining = {
  sessionId: string,
  serverId: number,
  userId: string,
  username: string,
  avatar?: string,
}

export type Session = {
  sessionId: string,
  serverId: number,
  userId: string,
  username: string,
  avatar?: string,
  roomId: string,
}