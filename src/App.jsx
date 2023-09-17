import Form from './components/Form';
import { useState } from 'react';
import AlgoResult from './components/AlgoResult';
import { v4 as uuid } from 'uuid';
import * as algo from './algorithms';

function App() {
  const sampleProcesses = [
    { id: uuid(), burstTime: 2, arrivalTime: 0, priority: 2 },
    { id: uuid(), burstTime: 1, arrivalTime: 1, priority: 1 },
    { id: uuid(), burstTime: 8, arrivalTime: 3, priority: 5 },
    { id: uuid(), burstTime: 4, arrivalTime: 4, priority: 3 },
    { id: uuid(), burstTime: 5, arrivalTime: 5, priority: 4 },
  ];
  const [processes, setProcesses] = useState(sampleProcesses);
  const [timeQuantum, setTimeQuantum] = useState(1);
  const [priorityOrder, setPriorityOrder] = useState(true);

  function onApply(processes, timeQuantum, priorityOrder) {
    setProcesses(processes);
    setTimeQuantum(timeQuantum);
    setPriorityOrder(priorityOrder);
  }

  return (
    <>
      <h1>CPU Scheduling</h1>
      <Form
        processes={processes}
        timeQuantum={timeQuantum}
        priorityOrder={priorityOrder}
        onApply={onApply}
      ></Form>
      <AlgoResult
        {...algo.FCFS(processes)}
        title="First Come First Serve"
      ></AlgoResult>
      <AlgoResult
        {...algo.nonPreempSJF(processes)}
        title="Non-Preemptive Shortest Job First"
      ></AlgoResult>
      <AlgoResult
        {...algo.preempSJF(processes)}
        title="Preemptive Shortest Job First"
      ></AlgoResult>
      <AlgoResult
        {...algo.nonPreempPS(processes, priorityOrder)}
        title="Non-Preemptive Priority Scheduling"
      ></AlgoResult>
      <AlgoResult
        {...algo.preempPS(processes, priorityOrder)}
        title="Preemptive Priority Scheduling"
      ></AlgoResult>
      <AlgoResult
        {...algo.roundRobin(processes, timeQuantum)}
        title="Round Robin"
      ></AlgoResult>
    </>
  );
}

export default App;
