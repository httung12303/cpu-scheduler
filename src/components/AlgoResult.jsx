import StatsTable from './StatsTable';
import GnattChart from './GnattChart';

export default function AlgoResult({ timeSlots, stats, title }) {
  return (
    <section>
      <h2>{title}</h2>
      <GnattChart timeSlots={timeSlots}></GnattChart>
      <StatsTable stats={stats}> </StatsTable>
    </section>
  );
}
