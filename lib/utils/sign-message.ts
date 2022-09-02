export default function generateSingInMessage(address: string) {
  const message = `Welcome to Fractional!\n\nClick Sign to acknowledge you have read and accept the Tessera Terms of Service (https://tessera.co/terms) and Privacy Policy (https://tessera.co/privacy) to access the Tessera protocol.  Please review our Disclaimer (https://fractional.art/disclaimer) as well.\n\nYou are signing in with ${address.toLowerCase()}.\n\nYou must be signed in to favorite vaults, update your profile details, or change notification settings.\n\n\n\nNOTE: Clicking Sign will not initiate a blockchain transaction or cost network fees.\n\nYour authentication status will reset after 2 weeks.`
  return message
}
