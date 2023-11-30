import React from 'react';

const CircleRating = ({ value, total }: { value: number; total: number }) => {
    const solidCircles = value > total ? total : value;
    const regularCircles = total - solidCircles;

    const solidCircleIcon = 'fa-solid fa-circle';
    const regularCircleIcon = 'fa-regular fa-circle';

    return (
        <div className="flex flex-row gap-1">
            {[...Array(solidCircles)].map((_, index) => (
                <i key={index} className={solidCircleIcon} />
            ))}
            {[...Array(regularCircles)].map((_, index) => (
                <i key={index} className={regularCircleIcon} />
            ))}
        </div>
    );
};

export default CircleRating;
