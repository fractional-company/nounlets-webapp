import { getCurrentChainExplorerAddressLink } from 'src/lib/utils/common'

export default function AppFooter(): JSX.Element {
  return (
    <div className="app-footer pt-28 pb-20">
      <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-12 text-gray-4 text-px18 font-700">
        <a
          href="https://discord.com/invite/8a34wmRjWB"
          target="_blank"
          className="hover:text-primary transition-colors"
          rel="noreferrer"
        >
          Discord
        </a>
        <a
          href="https://twitter.com/tessera"
          target="_blank"
          className="hover:text-primary transition-colors"
          rel="noreferrer"
        >
          Twitter
        </a>
        <a
          href={getCurrentChainExplorerAddressLink(process.env.NEXT_PUBLIC_NOUN_VAULT_ADDRESS!)}
          target="_blank"
          className="hover:text-primary transition-colors"
          rel="noreferrer"
        >
          Etherscan
        </a>
        <a
          href="src/components/common/AppFooter.tsx"
          target="_blank"
          rel="noreferrer"
          className="hover:text-primary transition-colors"
        >
          tessera.co
        </a>
      </div>
    </div>
  )
}
