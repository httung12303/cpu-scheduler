import { useState } from 'react';
import ProcessInput from './ProcessInput';
import { v4 as uuid } from 'uuid';

function isNumeric(num) {
  if (num === '' || num === null) {
    return false;
  }
  return !isNaN(num);
}

export default function Form(props) {
  const [processes, setProcesses] = useState(props.processes);
  const [timeQuantum, setTimeQuantum] = useState(props.timeQuantum);
  const [priorityOrder, setPriorityOrder] = useState(props.priorityOrder);

  console.log(priorityOrder);
  const valid = processes.every(
    (process) =>
      isNumeric(process.burstTime) &&
      isNumeric(process.arrivalTime) &&
      isNumeric(process.priority)
  );

  function onProcessChange(newProcess) {
    const index = processes.findIndex(
      (process) => process.id === newProcess.id
    );
    const newProcesses =
      processes.length === 1
        ? [newProcess]
        : [
            ...processes.slice(0, index),
            newProcess,
            ...processes.slice(index + 1),
          ];
    setProcesses(newProcesses);
  }

  function onAddBtnClick() {
    const newProcess = {
      id: uuid(),
      burstTime: 0,
      arrivalTime: 0,
      priority: 0,
    };
    setProcesses([...processes, newProcess]);
  }

  function onDelBtnClick(id) {
    setProcesses(processes.filter((process) => process.id !== id));
  }

  function onApplyBtnClick() {
    console.log(valid);
    console.log(processes);
    console.log(timeQuantum);
    console.log(typeof priorityOrder, priorityOrder);
    if (valid) {
      props.onApply(processes, timeQuantum, priorityOrder);
    }
  }

  return (
    <section>
      <h2>Input</h2>
      <form action="">
        <fieldset className="parameters">
          <legend>Parameters</legend>
          <label>
            <input
              type="checkbox"
              onChange={(e) => {
                console.log(e.target);
                console.log(e.target.checked);
                setPriorityOrder(e.target.checked);
              }}
              checked={priorityOrder}
            />
            Low priority first
          </label>
          <label>
            Time quantum
            <input
              type="number"
              min="1"
              value={timeQuantum}
              onChange={(e) => {
                const value = e.currentTarget.value;
                setTimeQuantum(value === '' ? '' : parseInt(value));
              }}
            />
          </label>
        </fieldset>
        {processes.map((process, index) => {
          const props = {
            ...process,
            index,
            onChange: onProcessChange,
            onDelBtnClick,
          };
          return <ProcessInput {...props} key={process.id}></ProcessInput>;
        })}
        <button type="button" onClick={onAddBtnClick} className="add">
          Add
        </button>
        <button
          type="button"
          onClick={onApplyBtnClick}
          className={valid ? 'apply' : 'apply disabled'}
        >
          Apply
        </button>
      </form>
    </section>
  );
}
