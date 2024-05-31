import React, { useState, useEffect, memo } from 'react';
import moment from 'moment';

const CountDown = ({ targetDate, onTimeUp }) => {
    const calculateTimeLeft = () => {
        const now = moment();
        const then = moment(targetDate);
        const duration = moment.duration(then.diff(now));

        return {
            days: Math.floor(duration.asDays()),
            hours: String(duration.hours()).padStart(2, '0'),
            minutes: String(duration.minutes()).padStart(2, '0'),
            seconds: String(duration.seconds()).padStart(2, '0'),
            total: duration.asMilliseconds(),
        };
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setInterval(() => {
            const newTimeLeft = calculateTimeLeft();
            setTimeLeft(newTimeLeft);
            if (newTimeLeft.total <= 0) {
                clearInterval(timer);
                onTimeUp(); // Notify parent component
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate, onTimeUp]);

    return (
        <>
            {timeLeft.total <= 0 ? (
                <span>Time's up!</span>
            ) : (
                <span>
                    {`${timeLeft.days} day${timeLeft.days !== 1 ? 's' : ''} ${timeLeft.hours}:${timeLeft.minutes}:${timeLeft.seconds}`}
                </span>
            )}
        </>
    );
};

export default memo(CountDown);
