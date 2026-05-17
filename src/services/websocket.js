import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const WS_URL = 'http://localhost:8080/ws';
const API_URL = 'http://localhost:8080/api';

let stompClient = null;
let subscriptions = {};

export const api = {
  async createRoom(playerName, color) {
    const res = await fetch(`${API_URL}/rooms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerName, color: color.toUpperCase() }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async joinRoom(playerName, color, roomCode) {
    const res = await fetch(`${API_URL}/rooms/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerName, color: color.toUpperCase(), roomCode }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async getRoom(code, playerId) {
    const res = await fetch(`${API_URL}/rooms/${code}?playerId=${playerId}`);
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async disbandRoom(code) {
    await fetch(`${API_URL}/rooms/${code}`, { method: 'DELETE' });
  },

  async startGame(roomCode) {
    const res = await fetch(`${API_URL}/game/${roomCode}/start`, { method: 'POST' });
    if (!res.ok) throw new Error(await res.text());
  },

  async retryGame(roomCode) {
    const res = await fetch(`${API_URL}/game/${roomCode}/retry`, { method: 'POST' });
    if (!res.ok) throw new Error(await res.text());
  },

  async getStats(playerId) {
    const res = await fetch(`${API_URL}/game/stats/${playerId}`);
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
};

export const ws = {
  connect(onConnected, onError) {
    stompClient = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      reconnectDelay: 3000,
      onConnect: () => {
        console.log('WebSocket connected');
        onConnected?.();
      },
      onStompError: (frame) => {
        console.error('STOMP error', frame);
        onError?.(frame);
      },
    });
    stompClient.activate();
  },

  disconnect() {
    Object.values(subscriptions).forEach(sub => sub?.unsubscribe());
    subscriptions = {};
    stompClient?.deactivate();
    stompClient = null;
  },

  subscribeRoom(roomCode, onMessage) {
    if (!stompClient?.connected) return;
    const key = `room-${roomCode}`;
    subscriptions[key]?.unsubscribe();
    subscriptions[key] = stompClient.subscribe(
      `/topic/room/${roomCode}`,
      (msg) => onMessage(JSON.parse(msg.body))
    );
  },

  subscribePowerUp(roomCode, onMessage) {
    if (!stompClient?.connected) return;
    const key = `powerup-${roomCode}`;
    subscriptions[key]?.unsubscribe();
    subscriptions[key] = stompClient.subscribe(
      `/topic/room/${roomCode}/powerup`,
      (msg) => onMessage(JSON.parse(msg.body))
    );
  },

  sendInput(roomCode, playerId, direction, activatePowerUp = false) {
    if (!stompClient?.connected) return;
    stompClient.publish({
      destination: `/app/game/${roomCode}/input`,
      body: JSON.stringify({ playerId, direction, activatePowerUp }),
    });
  },

  sendQuizAnswer(roomCode, playerId, selectedIndex) {
    if (!stompClient?.connected) return;
    stompClient.publish({
      destination: `/app/game/${roomCode}/quiz-answer`,
      body: JSON.stringify({ playerId, selectedIndex }),
    });
  },

  isConnected() {
    return stompClient?.connected ?? false;
  },
};
