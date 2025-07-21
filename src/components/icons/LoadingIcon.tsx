import React from "react"

interface LoadingIconProps {
  readonly size?: number
  readonly color?: string
  readonly className?: string
}

const LoadingIcon: React.FC<LoadingIconProps> = ({
  size = 16,
  color = "currentColor",
  className,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M8 1V4" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="1" />
      <path d="M8 12V15" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.3" />
      <path d="M15 8H12" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      <path d="M4 8H1" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.1" />
      <path
        d="M12.364 3.636L10.243 5.757"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.9"
      />
      <path
        d="M5.757 10.243L3.636 12.364"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.2"
      />
      <path
        d="M12.364 12.364L10.243 10.243"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.5"
      />
      <path
        d="M5.757 5.757L3.636 3.636"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.1"
      />
    </svg>
  )
}

export default LoadingIcon
