import React from "react"

interface CopyIconProps {
    size?: number
    className?: string
}

const CopyIcon: React.FC<CopyIconProps> = ({size = 16, className}) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <rect x="5" y="5" width="9" height="9" rx="1" stroke="currentColor" strokeWidth="1.2" />
            <path d="M2 11V2C2 1.44772 2.44772 1 3 1H10" stroke="currentColor" strokeWidth="1.2" />
        </svg>
    )
}

export default CopyIcon
