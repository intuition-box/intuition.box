import { ShieldCheck } from 'lucide-react';
import { intuitionTestnetLearnNetwork } from '@/lib/learn';

interface TestnetNoticeProps {
  compact?: boolean;
}

export function TestnetNotice({ compact = false }: TestnetNoticeProps) {
  const network = intuitionTestnetLearnNetwork;

  return (
    <aside
      className="not-prose my-8 border-y border-ib-brand/20 bg-ib-brand-alpha px-1 py-5"
      aria-label="Testnet safety notice"
    >
      <div className="flex items-start gap-3">
        <ShieldCheck className="mt-0.5 size-5 shrink-0 text-ib-brand" />
        <div>
          <p className="m-0 font-medium text-fd-foreground">
            Testnet is the learning boundary
          </p>
          <p className="mt-1 text-sm leading-6 text-fd-muted-foreground">
            {compact
              ? 'All write-related examples are simulated on Intuition Testnet with tTRUST.'
              : 'Every write-related example targets ' +
                network.name +
                ' (chain ' +
                network.chainId +
                ') and ' +
                network.symbol +
                '. This site never connects a wallet, requests a signature, or broadcasts a transaction.'}
          </p>
        </div>
      </div>
    </aside>
  );
}
