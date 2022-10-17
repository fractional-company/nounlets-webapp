import { ReactNode, useEffect, useState } from 'react';

export default function OnMounted(props: { children?: ReactNode; placeholder?: ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <>{props.placeholder}</>;
  return <>{props.children}</>;
}
