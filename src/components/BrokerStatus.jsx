import React from 'react';
import { Link2 } from 'lucide-react';

// "Connected to a real broker" badge. Makes the prototype feel like it's plugged
// into actual APIs (Alpaca/IBKR sandbox style), not just a mockup.
export default function BrokerStatus() {
  return (
    <div className="broker-status">
      <span className="broker-dot" />
      <Link2 size={14} />
      <span style={{ fontSize: '13px' }}>
        <strong>Broker connected:</strong> Alpaca Paper Trading
      </span>
      <span className="text-muted" style={{ fontSize: '12px' }}>
        Sandbox API · No real money
      </span>
    </div>
  );
}
