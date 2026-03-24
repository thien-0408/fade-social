import { useEffect } from 'react';
import { apiFetch } from '../lib/api';
import { getAccessToken } from '../lib/auth';

export function useHeartbeat(enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const ping = async () => {
      try {
        const token = getAccessToken();
        if (token) {
          await apiFetch('/users/heartbeat', {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` }
          });
        }
      } catch (err) {
        console.error('Heartbeat failed', err);
      }
    };

    // Ping immediately on mount
    ping();

    // Ping every 45 seconds to keep the user online
    const intervalId = setInterval(ping, 45000);

    return () => clearInterval(intervalId);
  }, [enabled]);
}
