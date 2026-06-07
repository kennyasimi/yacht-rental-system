import React, { useState, useEffect } from 'react';
import { checkAvailability } from '../services/bookingservice';

interface DateRangePickerProps {
    boatId: number;
    onDateSelect: (startDate: Date | null, endDate: Date | null) => void;
    onClose: () => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ boatId, onDateSelect, onClose }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [bookedDates, setBookedDates] = useState<string[]>([]);
    const [availableDates, setAvailableDates] = useState<string[]>([]);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [loading, setLoading] = useState(true);
    const [hoverDate, setHoverDate] = useState<Date | null>(null);

    useEffect(() => {
        fetchAvailability();
    }, [currentMonth, boatId]);

    const fetchAvailability = async () => {
        setLoading(true);
        try {
            const data = await checkAvailability(
                boatId,
                currentMonth.getMonth() + 1,
                currentMonth.getFullYear()
            );
            setBookedDates(data.bookedDates);
            setAvailableDates(data.availableDates);
        } catch (error) {
            console.error('Error fetching availability:', error);
        } finally {
            setLoading(false);
        }
    };

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();
        
        return { daysInMonth, startingDayOfWeek };
    };

    const isDateBooked = (date: Date): boolean => {
        const dateString = date.toISOString().split('T')[0];
        return bookedDates.includes(dateString);
    };

    // FIXED: Now using isAvailable in render logic
    const isDateAvailable = (date: Date): boolean => {
        const dateString = date.toISOString().split('T')[0];
        return availableDates.includes(dateString);
    };

    const isDateInRange = (date: Date): boolean => {
        if (!startDate || !endDate) return false;
        return date >= startDate && date <= endDate;
    };

    const isDateSelected = (date: Date): boolean => {
        if (!startDate) return false;
        if (startDate && !endDate) {
            return date.toISOString() === startDate.toISOString();
        }
        if (startDate && endDate) {
            return date >= startDate && date <= endDate;
        }
        return false;
    };

    const handleDateClick = (date: Date) => {
        if (isDateBooked(date)) return;
        
        if (!startDate || (startDate && endDate)) {
            // Start new selection
            setStartDate(date);
            setEndDate(null);
        } else {
            // Complete selection
            if (date < startDate) {
                setStartDate(date);
                setEndDate(startDate);
                onDateSelect(date, startDate);
            } else {
                setEndDate(date);
                onDateSelect(startDate, date);
            }
        }
    };

    const handleMouseEnter = (date: Date) => {
        if (startDate && !endDate && !isDateBooked(date)) {
            setHoverDate(date);
        }
    };

    const handleMouseLeave = () => {
        setHoverDate(null);
    };

    const renderCalendar = () => {
        const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
        const days = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Add empty cells for days before month starts
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(<div key={`empty-${i}`} className="calendar-day calendar-day--empty"></div>);
        }

        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
            const isBooked = isDateBooked(date);
            const isAvailable = isDateAvailable(date); // Now used!
            const isSelected = isDateSelected(date);
            const isInRange = isDateInRange(date);
            const isPast = date < today;
            const isHovered = hoverDate && startDate && !endDate && 
                             ((date >= startDate && date <= hoverDate) || 
                              (date <= startDate && date >= hoverDate));
            
            // FIXED: Now using isAvailable to determine available dates
            let statusClass = 'calendar-day';
            
            if (isBooked || isPast) {
                statusClass += ' calendar-day--booked';
            } else if (isSelected) {
                statusClass += ' calendar-day--selected';
            } else if (isInRange) {
                statusClass += ' calendar-day--in-range';
            } else if (isHovered) {
                statusClass += ' calendar-day--hover';
            } else if (isAvailable) {
                statusClass += ' calendar-day--available';
            } else {
                statusClass += ' calendar-day--unavailable';
            }

            days.push(
                <div
                    key={day}
                    onClick={() => !isBooked && !isPast && handleDateClick(date)}
                    onMouseEnter={() => !isBooked && !isPast && handleMouseEnter(date)}
                    onMouseLeave={handleMouseLeave}
                    className={statusClass}
                >
                    {day}
                </div>
            );
        }

        return days;
    };

    const changeMonth = (increment: number) => {
        const newDate = new Date(currentMonth);
        newDate.setMonth(currentMonth.getMonth() + increment);
        setCurrentMonth(newDate);
        setStartDate(null);
        setEndDate(null);
    };

    const formatDate = (date: Date | null): string => {
        if (!date) return 'Not selected';
        return date.toString()
    };

    return (
        <div className="date-picker-overlay">
            <div className="date-picker">
                {/* Header */}
                <div className="date-picker__header">
                    <h2 className="date-picker__title">Select Dates</h2>
                    <button
                        onClick={onClose}
                        className="date-picker__close-btn"
                        aria-label="Close date picker"
                    >
                        <svg className="date-picker__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Selected Dates Display */}
                <div className="date-picker__selected-dates">
                    <div className="date-picker__dates-grid">
                        <div>
                            <label className="date-picker__label">Start Date</label>
                            <p className="date-picker__date-value">{formatDate(startDate)}</p>
                        </div>
                        <div>
                            <label className="date-picker__label">End Date</label>
                            <p className="date-picker__date-value">{formatDate(endDate)}</p>
                        </div>
                    </div>
                </div>

                {/* Calendar Navigation */}
                <div className="calendar-nav">
                    <button
                        onClick={() => changeMonth(-1)}
                        className="calendar-nav__btn"
                        aria-label="Previous month"
                    >
                        <svg className="calendar-nav__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h3 className="text-xl font-semibold">
                        {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </h3>
                    <button
                        onClick={() => changeMonth(1)}
                        className="calendar-nav__btn"
                        aria-label="Next month"
                    >
                        <svg className="calendar-nav__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="calendar-loading">
                        <div className="calendar-loading__spinner"></div>
                    </div>
                )}

                {/* Calendar Grid */}
                {!loading && (
                    <>
                        <div className="calendar-weekdays">
                            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                                <div key={day} className="calendar-weekdays__day">
                                    {day}
                                </div>
                            ))}
                        </div>
                        <div className="calendar-grid">
                            {renderCalendar()}
                        </div>
                    </>
                )}

                {/* Legend */}
                <div className="calendar-legend">
                    <div className="calendar-legend__item">
                        <div className="calendar-legend__color calendar-legend__color--selected"></div>
                        <span>Selected</span>
                    </div>
                    <div className="calendar-legend__item">
                        <div className="calendar-legend__color calendar-legend__color--in-range"></div>
                        <span>In Range</span>
                    </div>
                    <div className="calendar-legend__item">
                        <div className="calendar-legend__color calendar-legend__color--booked"></div>
                        <span>Booked</span>
                    </div>
                    <div className="calendar-legend__item">
                        <div className="calendar-legend__color calendar-legend__color--available"></div>
                        <span>Available</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="date-picker__actions">
                    <button
                        onClick={() => {
                            setStartDate(null);
                            setEndDate(null);
                            onDateSelect(null, null);
                        }}
                        className="date-picker__btn date-picker__btn--clear"
                    >
                        Clear
                    </button>
                    <button
                        onClick={onClose}
                        className="date-picker__btn date-picker__btn--done"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DateRangePicker;