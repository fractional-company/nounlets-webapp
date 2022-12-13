import { IS_SAFE_TO_RENDER } from 'pages/_app'
import { ReactNode, useEffect, useState } from 'react'

export default function OnMounted(props: { children: JSX.Element; placeholder?: JSX.Element }) {
  const [isMounted, setIsMounted] = useState(IS_SAFE_TO_RENDER)

  useEffect(() => {
    if (IS_SAFE_TO_RENDER) {
      setIsMounted(true)
    }
  }, [])

  if (!isMounted) return props.placeholder || null
  return props.children
}
