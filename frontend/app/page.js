'use client';

import Layout from "./components/Layout";
import { useAccount } from "wagmi";

export default function Home() {

const { address, isConnected } = useAccount();

return (
  <>
    <Layout>
      <p>
        {isConnected ? `Connected to ${address}` : "Not connected"}
      </p>
    </Layout>
  </>
);
}
