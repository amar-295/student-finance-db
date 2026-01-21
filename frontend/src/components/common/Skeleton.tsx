import React from 'react';

interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'rect' | 'circle';
    width?: string | number;
    height?: string | number;
}

const Skeleton: React.FC<SkeletonProps> = ({
    className = '',
    variant = 'rect',
    width,
    height,
}) => {
    const getVariantClass = () => {
        switch (variant) {
            case 'text':
                return 'rounded-md h-4 w-full';
            case 'circle':
                return 'rounded-full';
            case 'rect':
            default:
                return 'rounded-xl';
        }
    };

    return (
        <div
            className={`animate-pulse bg-gray-200 dark:bg-white/5 ${getVariantClass()} ${className}`}
            style={{
                width: width,
                height: height,
            }}
        />
    );
};

export default Skeleton;
