"use client";

import { CalendarIcon, Clock3 } from "lucide-react";
import { format } from "date-fns";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

interface DateTimePickerProps {
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
}

function parseDateTime(value?: string): Date | undefined {
    if (!value) {
        return undefined;
    }

    const date = new Date(value);

    return Number.isNaN(date.getTime())
        ? undefined
        : date;
}

function formatDateTimeForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(
        date.getMonth() + 1
    ).padStart(2, "0");
    const day = String(
        date.getDate()
    ).padStart(2, "0");
    const hours = String(
        date.getHours()
    ).padStart(2, "0");
    const minutes = String(
        date.getMinutes()
    ).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function DateTimePicker({
    value,
    onChange,
    placeholder = "Select date and time",
    disabled = false,
    className,
}: DateTimePickerProps) {
    const selectedDate = parseDateTime(value);

    const handleDateChange = (
        date: Date | undefined
    ) => {
        if (!date) {
            return;
        }

        const currentDate =
            selectedDate ?? new Date();

        date.setHours(
            currentDate.getHours(),
            currentDate.getMinutes(),
            0,
            0
        );

        onChange?.(
            formatDateTimeForInput(date)
        );
    };

    const handleTimeChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const time = event.target.value;

        if (!time) {
            return;
        }

        const [hours, minutes] =
            time.split(":").map(Number);

        const date =
            selectedDate ?? new Date();

        date.setHours(
            hours,
            minutes,
            0,
            0
        );

        onChange?.(
            formatDateTimeForInput(date)
        );
    };

    return (
        <Popover>
            <PopoverTrigger
                render={
                    <Button
                        type="button"
                        variant="outline"
                        disabled={disabled}
                        className={cn(
                            "w-full justify-start border-slate-200 bg-white text-left font-normal text-slate-700 hover:bg-slate-50",
                            !selectedDate &&
                                "text-slate-400",
                            className
                        )}
                    />
                }
            >
                <CalendarIcon className="mr-2 h-4 w-4 shrink-0 text-slate-500" />

                {selectedDate
                    ? format(
                          selectedDate,
                          "MMMM d, yyyy h:mm a"
                      )
                    : placeholder}
            </PopoverTrigger>

            <PopoverContent
                className="w-auto p-0"
                align="start"
            >
                <div className="p-3">
                    <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={
                            handleDateChange
                        }
                    />

                    <div className="border-t border-slate-200 pt-3">
                        <div className="flex items-center gap-2">
                            <Clock3 className="h-4 w-4 text-slate-500" />

                            <Input
                                type="time"
                                value={
                                    selectedDate
                                        ? format(
                                              selectedDate,
                                              "HH:mm"
                                          )
                                        : ""
                                }
                                onChange={
                                    handleTimeChange
                                }
                                disabled={
                                    disabled
                                }
                                className="border-slate-200 bg-white text-slate-900"
                            />
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}