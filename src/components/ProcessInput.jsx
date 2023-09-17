export default function ProcessInput({
  index,
  id,
  burstTime,
  arrivalTime,
  priority,
  onChange,
  onDelBtnClick,
}) {
  function handleChange(e, attribute) {
    const value = e.currentTarget.value;
    const newProcess = { id, burstTime, arrivalTime, priority };
    newProcess[attribute] = value === '' ? '' : parseInt(value);
    onChange(newProcess);
  }

  return (
    <fieldset className='process-input'>
      <legend>P{index + 1}</legend>
      <label>
        Burst time
        <input
          type="number"
          value={burstTime}
          onChange={(e) => handleChange(e, 'burstTime')}
          min="0"
        />
      </label>
      <label>
        Arrival time
        <input
          type="number"
          value={arrivalTime}
          onChange={(e) => handleChange(e, 'arrivalTime')}
          min="0"
        />
      </label>
      <label>
        Priority
        <input
          type="number"
          value={priority}
          onChange={(e) => handleChange(e, 'priority')}
          min="0"
        />
      </label>
      <button className='delete' type="button" onClick={() => onDelBtnClick(id)}>
        X
      </button>
    </fieldset>
  );
}
