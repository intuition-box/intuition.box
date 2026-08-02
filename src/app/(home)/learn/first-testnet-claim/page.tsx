import { permanentRedirect } from 'next/navigation';

export default function FirstTestnetClaimRedirect() {
  permanentRedirect('/learn/reading-the-graph');
}
