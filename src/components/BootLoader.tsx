export default function BootLoader() {
  return (
    <div className="boot-backdrop" role="status" aria-label="Загрузка…">
      <div className="boot-ring" />
      <div className="boot-label">CRUSTA&nbsp;MIA</div>
    </div>
  );
}
