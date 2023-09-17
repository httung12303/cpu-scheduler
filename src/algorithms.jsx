import { scheduleStats } from './utils';
import { v4 as uuid } from 'uuid';

export { FCFS, nonPreempPS, nonPreempSJF, preempPS, preempSJF, roundRobin };

function FCFS(processes) {
  const indexedProcesses = processes.map((process, index) => {
    return { ...process, index: index + 1 };
  });
  const sortedProcesses = indexedProcesses.toSorted(
    (processA, processB) => processA.arrivalTime - processB.arrivalTime
  );
  const timeSlots = [];
  for (const process of sortedProcesses) {
    const { index, arrivalTime, burstTime } = process;
    if (burstTime === 0) {
      continue;
    }
    const start =
      timeSlots.length > 0 ? timeSlots[timeSlots.length - 1].end : 0;
    const timeSlot = { id: uuid(), index };
    if (arrivalTime > start) {
      const emptyTimeSlot = {
        id: uuid(),
        index: -1,
        start,
        end: arrivalTime,
      };
      timeSlots.push(emptyTimeSlot);
      timeSlot.start = arrivalTime;
      timeSlot.end = arrivalTime + burstTime;
    } else {
      timeSlot.start = start;
      timeSlot.end = start + burstTime;
    }
    timeSlots.push(timeSlot);
  }
  const stats = scheduleStats(sortedProcesses, timeSlots);
  return { timeSlots, stats };
}

function nonPreempPS(processes, ascending) {
  const indexedProcesses = processes.map((process, index) => {
    return { ...process, index: index + 1 };
  });
  const sortedProcesses = indexedProcesses.toSorted(
    (processA, processB) => processA.arrivalTime - processB.arrivalTime
  );
  const timeSlots = [];
  let activeProcess = null;
  const queue = [];
  for (let i = 0; ; i++) {
    let flag = false;
    sortedProcesses.forEach((process) => {
      if (process.arrivalTime === i && process.burstTime > 0) {
        flag = true;
        queue.push(process);
      }
    });

    // The running process terminates
    let start = timeSlots.length > 0 ? timeSlots[timeSlots.length - 1].end : 0;
    if (activeProcess !== null && i === activeProcess.burstTime + start) {
      const { index } = activeProcess;

      // Add time slot
      const timeSlot = { id: uuid(), index, start, end: i };
      timeSlots.push(timeSlot);

      // Terminate process
      activeProcess = null;

      // Run the highest priority process
      if (queue.length > 0) {
        queue.sort(
          (a, b) =>
            (ascending ? 1 : -1) * (a.priority - b.priority) ||
            a.arrivalTime - b.arrivalTime
        );
        activeProcess = { ...queue.splice(0, 1)[0] };
      }
      continue;
    }

    // No running process, run one from queue
    if (activeProcess === null && queue.length > 0) {
      // Add empty  time slot
      start = timeSlots.length > 0 ? timeSlots[timeSlots.length - 1].end : 0;
      if (start !== i) {
        timeSlots.push({ id: uuid(), index: -1, start, end: i });
      }

      // Run the highest priority process
      queue.sort(
        (a, b) =>
          (ascending ? 1 : -1) * (a.priority - b.priority) ||
          a.arrivalTime - b.arrivalTime
      );
      activeProcess = { ...queue[0] };
      queue.splice(0, 1);
      continue;
    }

    // Terminate loop
    if (
      activeProcess === null &&
      i > sortedProcesses[sortedProcesses.length - 1].arrivalTime &&
      queue.length === 0
    ) {
      break;
    }
  }
  const stats = scheduleStats(sortedProcesses, timeSlots);
  return { timeSlots, stats };
}

function nonPreempSJF(processes) {
  const indexedProcesses = processes.map((process, index) => {
    return { ...process, index: index + 1 };
  });
  const sortedProcesses = indexedProcesses.toSorted(
    (processA, processB) =>
      processA.arrivalTime - processB.arrivalTime ||
      processA.burstTime - processB.burstTime
  );
  const timeSlots = [];
  let activeProcess = null;
  const queue = [];
  for (let i = 0; ; i++) {
    // Check and add new processes
    sortedProcesses.forEach((process) => {
      if (process.arrivalTime === i && process.burstTime > 0) {
        queue.push(process);
      }
    });

    // Running process terminates
    let start =
      timeSlots.length === 0 ? 0 : timeSlots[timeSlots.length - 1].end;
    if (activeProcess !== null && i === start + activeProcess.burstTime) {
      const { index } = activeProcess;

      // Add the process time slot
      const timeSlot = {
        id: uuid(),
        index,
        start,
        end: i,
      };
      timeSlots.push(timeSlot);

      // Terminate process
      activeProcess = null;

      // Run a process from queue
      if (queue.length > 0) {
        queue.sort(
          (a, b) => a.burstTime - b.burstTime || a.arrivalTime - b.arrivalTime
        );
        activeProcess = { ...queue[0] };
        queue.splice(0, 1);
      }
      continue;
    }

    // There is no running process and the queue is not empty
    start = timeSlots.length === 0 ? 0 : timeSlots[timeSlots.length - 1].end;
    if (activeProcess === null && queue.length > 0) {
      // Add an empty time slot
      if (i !== start) {
        const timeSlot = {
          id: uuid(),
          index: -1,
          start,
          end: i,
        };
        timeSlots.push(timeSlot);
      }

      // Run the shortest process in the waiting queue
      queue.sort(
        (a, b) => a.burstTime - b.burstTime || a.arrivalTime - b.arrivalTime
      );
      activeProcess = { ...queue[0] };
      queue.splice(0, 1);
      continue;
    }

    // Exit loop
    if (
      activeProcess === null &&
      queue.length === 0 &&
      i > sortedProcesses[sortedProcesses.length - 1].arrivalTime
    ) {
      break;
    }
  }
  const stats = scheduleStats(sortedProcesses, timeSlots);
  return { timeSlots, stats };
}

function preempPS(processes, ascending) {
  const indexedProcesses = processes.map((process, index) => {
    return { ...process, index: index + 1 };
  });
  const sortedProcesses = indexedProcesses.toSorted(
    (processA, processB) => processA.arrivalTime - processB.arrivalTime
  );
  const timeSlots = [];
  let activeProcess = null;
  const queue = [];
  for (let i = 0; ; i++) {
    let flag = false;
    sortedProcesses.forEach((process) => {
      if (process.arrivalTime === i && process.burstTime > 0) {
        flag = true;
        queue.push(process);
      }
    });

    // The running process terminates
    let start = timeSlots.length > 0 ? timeSlots[timeSlots.length - 1].end : 0;
    if (activeProcess !== null && i === activeProcess.burstTime + start) {
      const { index } = activeProcess;

      // Add time slot
      const timeSlot = { id: uuid(), index, start, end: i };
      timeSlots.push(timeSlot);

      // Terminate process
      activeProcess = null;

      // Run the highest priority process
      if (queue.length > 0) {
        queue.sort(
          (a, b) =>
            (ascending ? 1 : -1) * (a.priority - b.priority) ||
            a.arrivalTime - b.arrivalTime
        );
        activeProcess = { ...queue.splice(0, 1)[0] };
      }
      continue;
    }

    // No running process, run one from queue
    if (activeProcess === null && queue.length > 0) {
      // Add empty  time slot
      start = timeSlots.length > 0 ? timeSlots[timeSlots.length - 1].end : 0;
      if (start !== i) {
        timeSlots.push({ id: uuid(), index: -1, start, end: i });
      }

      // Run the highest priority process
      queue.sort(
        (a, b) =>
          (ascending ? 1 : -1) * (a.priority - b.priority) ||
          a.arrivalTime - b.arrivalTime
      );
      activeProcess = { ...queue[0] };
      queue.splice(0, 1);
      continue;
    }

    // A process is running and new process arrive
    if (activeProcess !== null && flag === true) {
      queue.sort(
        (a, b) =>
          (ascending ? 1 : -1) * (a.priority - b.priority) ||
          a.arrivalTime - b.arrivalTime
      );
      const priorityCheck = ascending
        ? activeProcess.priority < queue[0].priority
        : activeProcess.priority > queue[0].priority;
      if (!priorityCheck) {
        start = timeSlots.length > 0 ? timeSlots[timeSlots.length - 1].end : 0;

        // Add time slot
        const timeSlot = {
          id: uuid(),
          index: activeProcess.index,
          start,
          end: i,
        };
        timeSlots.push(timeSlot);

        // Push the active process to queue
        const process = { ...activeProcess };
        process.burstTime = activeProcess.burstTime - (i - start);
        queue.push(process);

        // Run the highest priority process
        activeProcess = { ...queue[0] };
        queue.splice(0, 1);
      }
      continue;
    }

    // Terminate loop
    if (
      activeProcess === null &&
      i > sortedProcesses[sortedProcesses.length - 1].arrivalTime &&
      queue.length === 0
    ) {
      break;
    }
  }
  const stats = scheduleStats(sortedProcesses, timeSlots);
  return { timeSlots, stats };
}

function preempSJF(processes) {
  const indexedProcesses = processes.map((process, index) => {
    return { ...process, index: index + 1 };
  });
  const sortedProcesses = indexedProcesses.toSorted(
    (processA, processB) => processA.arrivalTime - processB.arrivalTime
  );
  const timeSlots = [];
  let start = 0;
  let activeProcess = null;
  const queue = [];
  for (let i = 0; ; i++) {
    let flag = false;
    // Check and add new process
    sortedProcesses.forEach((process) => {
      if (process.arrivalTime === i && process.burstTime > 0) {
        queue.push(process);
        flag = true;
      }
    });

    // Add empty time slot if no process is running and new ones arrive
    if (activeProcess === null && flag) {
      if (i > start) {
        timeSlots.push({ id: uuid(), index: -1, start, end: i });
      }
      queue.sort(
        (a, b) => a.burstTime - b.burstTime || a.arrivalTime - b.arrivalTime
      );
      activeProcess = { ...queue[0] };
      queue.splice(0, 1);
      start = i;
      continue;
    }

    // Check if the current running process terminates
    if (activeProcess !== null && i == activeProcess.burstTime + start) {
      // Terminate the running process and add a time slot
      const timeSlot = {
        id: uuid(),
        index: activeProcess.index,
        start,
        end: i,
      };
      timeSlots.push(timeSlot);
      activeProcess = null;
      // Run a process from queue
      if (queue.length > 0) {
        queue.sort(
          (a, b) => a.burstTime - b.burstTime || a.arrivalTime - b.arrivalTime
        );
        activeProcess = { ...queue[0] };
        queue.splice(0, 1);
      }
      start = i;
      continue;
    }

    // A process is running and new processes arrive
    if (activeProcess !== null && flag) {
      // Run a new process if shorter
      queue.sort(
        (a, b) => a.burstTime - b.burstTime || a.arrivalTime - b.arrivalTime
      );
      const remaining = activeProcess.burstTime - (i - start);
      if (queue[0].burstTime < remaining) {
        const timeSlot = {
          id: uuid(),
          index: activeProcess.index,
          start,
          end: i,
        };
        timeSlots.push(timeSlot);
        // Push remaining part of active process into queue
        queue.push({ ...activeProcess, burstTime: remaining });
        // Update running process
        activeProcess = { ...queue[0] };
        // Pop the queue head
        queue.splice(0, 1);
        start = i;
      }
      continue;
    }

    // Exit loop when there's no process running, all original processes
    // pushed into queue and queue is empty
    if (
      activeProcess === null &&
      i > sortedProcesses[sortedProcesses.length - 1].arrivalTime &&
      queue.length === 0
    ) {
      break;
    }
  }
  const stats = scheduleStats(sortedProcesses, timeSlots);
  return { timeSlots, stats };
}

function roundRobin(processes, timeQuantum) {
  console.log(timeQuantum)
  const indexedProcesses = processes.map((process, index) => {
    return { ...process, index: index + 1 };
  });
  const sortedProcesses = indexedProcesses.toSorted(
    (processA, processB) => processA.arrivalTime - processB.arrivalTime
  );
  const timeSlots = [];
  const queue = [];
  let activeProcess = null;
  let start;
  for (let i = 0; ; i++) {
    if (i === 30) break;
    sortedProcesses.forEach((process) => {
      if (process.arrivalTime === i && process.burstTime > 0) {
        queue.push(process);
      }
    });

    // The running process terminates
    start = timeSlots.length > 0 ? timeSlots[timeSlots.length - 1].end : 0;
    if (
      activeProcess !== null &&
      (i === start + timeQuantum || i === start + activeProcess.burstTime)
    ) {
      const { index, burstTime } = activeProcess;

      // Add time slot
      const timeSlot = { id: uuid(), index, start, end: i };
      timeSlots.push(timeSlot);

      // Push active process to queue
      if (timeQuantum < burstTime) {
        const process = { ...activeProcess };
        process.burstTime = burstTime - timeQuantum;
        queue.push(process);
      }

      // Terminate active process
      activeProcess = null;

      // Run a process from queue
      if (queue.length > 0) {
        activeProcess = { ...queue.splice(0, 1)[0] };
      }
      continue;
    }

    // No process running, run one from queue
    if (activeProcess === null && queue.length > 0) {
      // Add empty time slot
      start = timeSlots.length > 0 ? timeSlots[timeSlots.length - 1].end : 0;
      if (start != i) {
        timeSlots.push({ id: uuid(), index: -1, start, end: i });
      }

      // Run a process from queue
      activeProcess = { ...queue.splice(0, 1)[0] };
      continue;
    }

    // Exit loop
    if (
      activeProcess === null &&
      queue.length === 0 &&
      i > sortedProcesses[sortedProcesses.length - 1].arrivalTime
    ) {
      break;
    }
  }
  const stats = scheduleStats(sortedProcesses, timeSlots);
  return { timeSlots, stats };
}
