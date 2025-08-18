import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip,
} from 'recharts';

function App() {
  const [metrics, setMetrics] = useState({});
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let timerId;

    const fetchMetrics = async () => {
      try {
        const res = await axios.get('/api/metrics');
        setMetrics(res.data);
        setHistory((prev) => [
          ...prev.slice(-9),
          { ...res.data, time: new Date().toLocaleTimeString() },
        ]);
        setError(null);
      } catch (err) {
        setError('Failed to fetch metrics');
      }
    };

    fetchMetrics();
    timerId = setInterval(fetchMetrics, 3000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h1>System Metrics</h1>

      {error && (
        <div
          style={{
            marginBottom: 12,
            padding: 8,
            background: '#fee',
            border: '1px solid #fbb',
          }}
        >
          {error}
        </div>
      )}

      {metrics && (
        <div style={{ marginBottom: 16 }}>
          <p>
            CPU Usage:
            {' '}
            {metrics.cpu_usage}
            %
          </p>
          <p>
            Latency:
            {' '}
            {metrics.latency}
            ms
          </p>
          <p>
            Memory Usage:
            {' '}
            {metrics.memory_usage}
            MB
          </p>
          <p>
            Requests Count:
            {' '}
            {metrics.requests_count}
          </p>
        </div>
      )}

      <LineChart width={600} height={300} data={history}>
        <Line type="monotone" dataKey="cpu_usage" />
        <CartesianGrid />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
      </LineChart>
    </div>
  );
}

export default App;
