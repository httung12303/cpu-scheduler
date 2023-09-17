import {v4 as uuid} from 'uuid';

export default function StatsTable({ stats }) {
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
      </tbody>
    </table>
  );
}
