import { CheckCircle2 } from "lucide-react";
import { StatusIcon, statusColors } from "./status-icon";
import type { TimelineEvent } from "./types";

export function EventTimeline({ events }: { events: TimelineEvent[] }) {
  if (events.length === 0) return null;

  return (
    <div className="pl-4 sm:pl-6 py-3">
      {events.map((event, i) => (
        <div key={i} className="flex gap-3 text-xs">
          {/* Icon column with connector line */}
          <div className="flex flex-col items-center w-3.5 flex-shrink-0">
            <div className="flex-shrink-0">
              {event.icon
                ? event.icon
                : event.status === "success"
                  ? <CheckCircle2 className="h-3.5 w-3.5 text-muted-foreground/60" />
                  : <StatusIcon status={event.status} />
              }
            </div>
            {/* Line segment below icon — only between items, not after last */}
            {i < events.length - 1 && (
              <div className="w-px bg-border flex-1 my-1" />
            )}
          </div>
          {/* Content */}
          <div className="pb-2">
            <span className={`leading-3.5 ${event.status === "success" ? "font-medium text-muted-foreground" : `font-medium ${statusColors[event.status]}`}`}>
              {event.label}
            </span>
            {event.detail && (
              <p className="text-muted-foreground mt-0.5">{event.detail}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
