import { io } from "socket.io-client";

let socketInstance = null;

function getSocketUrl() {
  if (typeof window === 'undefined') return "http://localhost:5000";
  if (window.location.port === '5000') return window.location.origin;
  return `http://${window.location.hostname}:5000`;
}

export function getSocket(tenantId = "TENANT-FINTECH-01") {
  if (!socketInstance) {
    try {
      socketInstance = io(getSocketUrl(), {
        query: { tenantId },
        transports: ["websocket", "polling"],
        timeout: 5000
      });
    } catch (e) {
      console.warn("Socket connection failed:", e);
    }
  }
  return socketInstance;
}

export function switchSocketTenant(tenantId = "TENANT-FINTECH-01") {
  if (socketInstance) {
    try {
      socketInstance.disconnect();
    } catch (e) {
      // ignore
    }
  }
  try {
    socketInstance = io(getSocketUrl(), {
      query: { tenantId },
      transports: ["websocket", "polling"],
      timeout: 5000
    });
  } catch (e) {
    console.warn("Socket switch failed:", e);
  }
  return socketInstance;
}
