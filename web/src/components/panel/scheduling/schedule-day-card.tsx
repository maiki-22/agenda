import { ScheduleBreaksSection } from "@/components/panel/scheduling/schedule-breaks-section";
import { ScheduleDayRow } from "@/components/panel/scheduling/schedule-day-row";
import type { ScheduleDay } from "@/types/panel";

interface ScheduleDayCardProps {
  day: ScheduleDay;
  dayLabel: string;
  onChange: (nextDay: ScheduleDay) => void;
}

export function ScheduleDayCard({ day, dayLabel, onChange }: ScheduleDayCardProps) {
  return (
    <article className="space-y-3">
      <ScheduleDayRow day={day} dayLabel={dayLabel} onChange={onChange} />

      {day.active ? (
       <ScheduleBreaksSection
          dayLabel={dayLabel}
          breaks={day.breaks}
          onAddBreak={() => {
            onChange({
              ...day,
              breaks: [...day.breaks, { startTime: "13:00", endTime: "14:00" }],
            });
          }}
          onChangeBreak={(index, key, value) => {
            onChange({
              ...day,
              breaks: day.breaks.map((item, breakIndex) =>
                breakIndex === index ? { ...item, [key]: value } : item,
              ),
            });
          }}
          onRemoveBreak={(index) => {
            onChange({
              ...day,
              breaks: day.breaks.filter((_, breakIndex) => breakIndex !== index),
            });
          }}
        />
      ) : null}
    </article>
  );
}