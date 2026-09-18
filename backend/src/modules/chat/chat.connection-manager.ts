import { WebSocket } from 'ws';

class ConnectionManager {
  private connections = new Map<number, WebSocket>();

  add(userId: number, socket: WebSocket) {
    // Agar user pehle se connected hai, to purana connection close kar dein
    const existingSocket = this.connections.get(userId);
    if (existingSocket && existingSocket !== socket) {
      try {
        existingSocket.close();
      } catch {
        // Safe fail
      }
    }
    this.connections.set(userId, socket);
  }

  remove(userId: number) {
    const socket = this.connections.get(userId);
    if (socket) {
      this.connections.delete(userId);
    }
  }

  get(userId: number): WebSocket | undefined {
    return this.connections.get(userId);
  }

  // Active Users count dekhne ke liye (Debugging ke liye helpful hai)
  getConnectedCount(): number {
    return this.connections.size;
  }
}

export const connectionManager = new ConnectionManager();