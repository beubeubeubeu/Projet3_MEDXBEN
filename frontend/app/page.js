'use client';

import { useAccount } from "wagmi";

export default function Home() {

const { address, isConnected } = useAccount();

return (
  <>
    <p>
      {isConnected ? `Connected to ${address}` : "Not connected"}
    </p>
  </>
);
}
