export default function AppFooter(): JSX.Element {
  return (
    <div className="app-footer pt-28 pb-20">
      <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-12 text-gray-4 text-px18 font-700">
        <a href="" target="_blank" className="hover:text-secondary-green transition-colors">
          Discord
        </a>
        <a href="" target="_blank" className="hover:text-secondary-green transition-colors">
          Twitter
        </a>
        <a href="" target="_blank" className="hover:text-secondary-green transition-colors">
          Etherscan
        </a>
        <a
          href="https://tessera.co/"
          target="_blank"
          rel="noreferrer"
          className="hover:text-secondary-green transition-colors"
        >
          tessera.co
        </a>
      </div>
    </div>
  )
}
