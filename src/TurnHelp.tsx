import { useState } from 'react';

export function TurnHelp() {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="turn-help"
      onPointerEnter={(event) => { if (event.pointerType === 'mouse') setOpen(true); }}
      onPointerLeave={(event) => { if (event.pointerType === 'mouse') setOpen(false); }}
      onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}
      onKeyDown={(event) => { if (event.key === 'Escape') setOpen(false); }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls="turn-guide"
        onFocus={(event) => { if (event.currentTarget.matches(':focus-visible')) setOpen(true); }}
        onClick={(event) => {
          const pointer = event.nativeEvent;
          if (pointer instanceof PointerEvent && pointer.pointerType === 'mouse') setOpen(true);
          else setOpen(!open);
        }}
      >
        How to turn?
      </button>
      <div className="turn-help-content" id="turn-guide" hidden={!open}>
        <p>Look straight at the right face to read the turn direction.</p>
        <p><strong>R</strong> turns it clockwise. <strong>R′</strong> turns it counterclockwise.</p>
        <p>Select a face letter to highlight it. Dashed labels briefly show the opposite angle.</p>
      </div>
    </div>
  );
}
