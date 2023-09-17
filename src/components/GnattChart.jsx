import {v4 as uuid} from 'uuid';

export default function GnattChart({ timeSlots }) {
  if (timeSlots.length === 0) {
    return null;
  }
  const length = timeSlots[timeSlots.length - 1].end;
  return (
    <>
      <div className="gnatt-chart">
        {timeSlots.map(({ id, index, start, end }) => {
          return (
            <div
              className="time-slot"
              key={id}
              style={{ width: `${(end - start) / length * 100}%` }}
            >
              <span className="process-name">
                {index !== -1 ? 'P' + (index === -1 ? 0 : index) : 'Free'}
              </span>
              <span className="slot-end">{end}</span>
            </div>
          );
        })}
      </div>
    </>
  );
}
