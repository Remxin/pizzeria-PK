interface CanvasControlsProps {
  onClear: () => void;
  onUndo: () => void;
  canUndo: boolean;
}

export const CanvasControls = ({
  onClear,
  onUndo,
  canUndo,
}: CanvasControlsProps) => {
  return (
    <div className="canvas-controls">
      <button
        className="control-btn undo-btn"
        onClick={onUndo}
        disabled={!canUndo}
        title="Cofnij ostatni składnik"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8 5L3 10L8 15"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M3 10H13C15.2091 10 17 11.7909 17 14C17 16.2091 15.2091 18 13 18H11"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Cofnij
      </button>

      <button
        className="control-btn clear-btn"
        onClick={onClear}
        disabled={!canUndo}
        title="Wyczyść wszystko"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 6H17"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8 3H12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16 6L15 17C15 17.5304 14.7893 18.0391 14.4142 18.4142C14.0391 18.7893 13.5304 19 13 19H7C6.46957 19 5.96086 18.7893 5.58579 18.4142C5.21071 18.0391 5 17.5304 5 17L4 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Wyczyść
      </button>
    </div>
  );
};
