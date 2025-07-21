import React from "react"

interface CheckIconProps {
  readonly size?: number
  readonly color?: string
  readonly className?: string
}

const CheckIcon: React.FC<CheckIconProps> = ({size = 16, color = "currentColor", className}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M13.3333 4L6 11.3333L2.66667 8"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default CheckIcon
