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
          onAddBreak={({ startTime, endTime }) => {
            onChange({
              ...day,
              breaks: [...day.breaks, { startTime, endTime }],
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