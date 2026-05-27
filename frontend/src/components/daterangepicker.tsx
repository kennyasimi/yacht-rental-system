import React, { useState, useEffect } from 'react';
import { bookingService } from '../services/bookingservice';

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
            const data = await bookingService.checkAvailability(
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
            return date.toDateString() === startDate.toDateString();
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
            } else {
                setEndDate(date);
            }
            onDateSelect(startDate, date);
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
            days.push(<div key={`empty-${i}`} className="h-12"></div>);
        }

        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
            const isBooked = isDateBooked(date);
            const isAvailable = isDateAvailable(date);
            const isSelected = isDateSelected(date);
            const isInRange = isDateInRange(date);
            const isPast = date < today;
            const isHovered = hoverDate && startDate && !endDate && 
                             ((date >= startDate && date <= hoverDate) || 
                              (date <= startDate && date >= hoverDate));
            
            let statusClass = '';
            if (isBooked || isPast) {
                statusClass = 'bg-gray-200 text-gray-400 cursor-not-allowed';
            } else if (isSelected) {
                statusClass = 'bg-blue-600 text-white';
            } else if (isInRange) {
                statusClass = 'bg-blue-200 text-blue-800';
            } else if (isHovered) {
                statusClass = 'bg-blue-100 text-blue-800';
            } else {
                statusClass = 'hover:bg-blue-50 cursor-pointer';
            }

            days.push(
                <div
                    key={day}
                    onClick={() => !isBooked && !isPast && handleDateClick(date)}
                    onMouseEnter={() => !isBooked && !isPast && handleMouseEnter(date)}
                    onMouseLeave={handleMouseLeave}
                    className={`h-12 flex items-center justify-center rounded-lg transition-colors ${statusClass} ${
                        !isBooked && !isPast ? 'cursor-pointer' : ''
                    }`}
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
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-2xl w-full mx-4">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Select Dates</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Selected Dates Display */}
                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm text-gray-600">Start Date</label>
                            <p className="font-semibold text-gray-800">{formatDate(startDate)}</p>
                        </div>
                        <div>
                            <label className="text-sm text-gray-600">End Date</label>
                            <p className="font-semibold text-gray-800">{formatDate(endDate)}</p>
                        </div>
                    </div>
                </div>

                {/* Calendar Navigation */}
                <div className="flex justify-between items-center mb-4">
                    <button
                        onClick={() => changeMonth(-1)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h3 className="text-xl font-semibold">
                        {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </h3>
                    <button
                        onClick={() => changeMonth(1)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                )}

                {/* Calendar Grid */}
                {!loading && (
                    <>
                        <div className="grid grid-cols-7 gap-2 mb-2">
                            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                                <div key={day} className="text-center text-sm font-semibold text-gray-600">
                                    {day}
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 gap-2">
                            {renderCalendar()}
                        </div>
                    </>
                )}

                {/* Legend */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex justify-center space-x-6 text-sm">
                        <div className="flex items-center">
                            <div className="w-4 h-4 bg-blue-600 rounded mr-2"></div>
                            <span>Selected</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-4 h-4 bg-blue-200 rounded mr-2"></div>
                            <span>In Range</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-4 h-4 bg-gray-200 rounded mr-2"></div>
                            <span>Booked</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-4 h-4 bg-white border border-gray-300 rounded mr-2"></div>
                            <span>Available</span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex space-x-3">
                    <button
                        onClick={() => {
                            setStartDate(null);
                            setEndDate(null);
                            onDateSelect(null, null);
                        }}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Clear
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DateRangePicker;