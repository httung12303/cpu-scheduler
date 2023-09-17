export function scheduleStats(sortedProcesses, timeSlots) {
  const rawStats = {};
  timeSlots.forEach(({ index, start, end }) => {
    if (index === -1) {
      return;
    }
    if (!(index in rawStats)) {
      const { arrivalTime, id } = sortedProcesses.find(
        (process) => process.index === index
      );
      rawStats[index] = {
        id,
        arrivalTime,
        completeTime: end,
        wait: start - arrivalTime,
        response: start - arrivalTime,
      };
    } else {
      rawStats[index].wait += start - rawStats[index].completeTime;
      rawStats[index].completeTime = end;
    }
  });
  const stats = {};
  Object.keys(rawStats).forEach((index) => {
    const { id, arrivalTime, completeTime, wait, response } = rawStats[index];
    stats[index] = { id, wait, response, complete: completeTime - arrivalTime };
  });
  return stats;
}
