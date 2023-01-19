export default function IconTesseraLogo(props: { className?: string }) {
  return (
    <svg
      width="17"
      height="16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 17 16"
      className={props.className}
    >
      <g clipPath="url(#a)">
        <path d="M16.2736 0H-.0263672v16.3H16.2736V0Z" fill="#0E001E" />
        <path
          d="M15.7236 15.5H.723633V.5H15.7236v15Zm-14.49997-.45H15.2236V1H1.22363v14.05Z"
          fill="#E7E6E1"
        />
        <path d="M7.32363 4.9h-2.85V3.25h7.54997v1.7H9.17363V13h-1.85V4.9Z" fill="#E7E6E1" />
      </g>
      <defs>
        <clipPath id="a">
          <path fill="#fff" transform="translate(.223633)" d="M0 0h16v16H0z" />
        </clipPath>
      </defs>
    </svg>
  )
}
