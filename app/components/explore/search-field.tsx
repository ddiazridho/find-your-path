import Icon from "../ui-icon";

export default function SearchField({ query, onQueryChange }: { query: string; onQueryChange: (query: string) => void }) {
  return (
    <label className="search-field"><Icon name="search" /><span className="sr-only">Search majors or skills</span><input type="search" placeholder="Search majors or skills…" value={query} onChange={event => onQueryChange(event.target.value)} /></label>
  );
}
