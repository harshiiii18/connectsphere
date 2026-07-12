import { useEffect } from 'react';
import socket from '../socket';

function Dashboard() {
  useEffect(() => {
    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
    });
  }, []);

  return <h2>Dashboard - Coming soon!</h2>;
}

export default Dashboard;