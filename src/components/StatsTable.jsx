import { v4 as uuid } from 'uuid';

export default function StatsTable({ stats }) {
  const avg = Object.keys(stats).reduce(
    ({ wait, response, complete }, key) => {
      return {
        wait: wait + stats[key].wait,
        response: response + stats[key].response,
        complete: complete + stats[key].complete,
      };
    },
    { wait: 0, response: 0, complete: 0 }
  );
  if (Object.keys(stats).length > 0) {
    const len = Object.keys(stats).length;
    avg.wait /= len;
    avg.response /= len;
    avg.complete /= len;
  } else {
    avg.wait = 0;
    avg.response = 0;
    avg.complete = 0;
  }
  return (
    <table>
      <thead>
        <tr>
          <th>Process</th>
          <th>Response time</th>
          <th>Waiting time</th>
          <th>Turnaround time</th>
        </tr>
      </thead>
      <tbody>
        {Object.keys(stats)
          .toSorted((a, b) => a - b)
          .map((key) => {
            const { id, response, wait, complete } = stats[key];
            return (
              <tr key={id}>
                <td>{'P' + key}</td>
                <td>{response}</td>
                <td>{wait}</td>
                <td>{complete}</td>
              </tr>
            );
          })}
        <tr className="average">
          <td>Average</td>
          <td>{avg.response.toFixed(2)}</td>
          <td>{avg.wait.toFixed(2)}</td>
          <td>{avg.complete.toFixed(2)}</td>
        </tr>
      </tbody>
    </table>
  );
}
