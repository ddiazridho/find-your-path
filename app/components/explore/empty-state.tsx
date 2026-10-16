import Icon from "../ui-icon";

export default function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="empty-state"><Icon name="search" /><h3>No majors found yet</h3><p>Try a different keyword or explore all the fields.</p><button className="button button-primary" onClick={onReset}>Show all majors<Icon name="arrow" /></button></div>
  );
}
