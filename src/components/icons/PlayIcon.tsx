import React from "react"

interface PlayIconProps {
  readonly size?: number
  readonly color?: string
  readonly className?: string
}

const PlayIcon: React.FC<PlayIconProps> = ({size = 16, color = "currentColor", className}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M3 2.5L13 8L3 13.5V2.5Z" fill={color} stroke={"#57965c"} />
    </svg>
  )
}

export default PlayIcon
