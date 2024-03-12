'use client';

import { useAccount } from "wagmi";
import Voting from './components/Voting'

export default function Home() {

return (
  <>
    <Voting />
  </>
);
}
