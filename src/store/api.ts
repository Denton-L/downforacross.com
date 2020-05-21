const REMOTE_SERVER_HTTPS = 'https://downforacross.com';
const REMOTE_SERVER_HTTP = '54.151.18.249:3021';
const REMOTE_SERVER_URL = window.location.protocol === 'https:' ? REMOTE_SERVER_HTTPS : REMOTE_SERVER_HTTP;

export const SERVER_URL = process.env.REACT_APP_USE_LOCAL_SERVER
  ? 'http://localhost:3021'
  : REMOTE_SERVER_URL;

// socket.io server is same as api server
export const SOCKET_HOST = SERVER_URL;

// ========== GET /api/stats ============

interface Counts {
  gameEvents: number;
  activeGames: number;
  bytesTransferred: number;
}

export interface TimeWindowStats {
  name: string;
  stats: {
    windowStart: number;
    prevCounts: Counts;
    counts: Counts;
    activeGids: string[];
    percentComplete: number;
  };
}

export async function fetchStats() {
  const resp = await fetch(`${SERVER_URL}/api/stats`);
  const json = await resp.json();
  const timeWindowStats: TimeWindowStats[] = json;
  return timeWindowStats;
}
