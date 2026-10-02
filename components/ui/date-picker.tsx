"use client";

import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
    value?: Date;
    onChange?: (date: Date | undefined) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
}

export function DatePicker({
    value,
    onChange,
    placeholder = "Select date",
    disabled = false,
    className,
}: DatePickerProps) {
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
                            !value && "text-slate-400",
                            className
                        )}
                    />
                }
            >
                <CalendarIcon className="mr-2 h-4 w-4 text-slate-500" />

                {value
                    ? format(value, "MMMM d, yyyy")
                    : placeholder}
            </PopoverTrigger>

            <PopoverContent
                className="w-auto p-0"
                align="start"
            >
                <Calendar
                    mode="single"
                    selected={value}
                    onSelect={onChange}
                />
            </PopoverContent>
        </Popover>
    );
}