import type { RefObject } from "react";
import type { Major } from "../../majors";
import Icon from "../ui-icon";
import MajorPreview from "../major-preview";
import SkillList from "./skill-list";

export default function MajorPreviewDialog({ dialog, selected, closeDialog }: {
  dialog: RefObject<HTMLDialogElement | null>;
  selected: Major | null;
  closeDialog: () => void;
}) {
  return (
    <dialog ref={dialog} className="preview-dialog major-preview-dialog" aria-labelledby="dialog-title" onCancel={closeDialog} onClose={closeDialog} onClick={event => { if (event.target === event.currentTarget) closeDialog(); }}>
      <button className="dialog-close" aria-label="Close preview" onClick={closeDialog} autoFocus><Icon name="close" /></button>
      {selected ? <div className="dialog-content">
        <h2 id="dialog-title">{selected.name}</h2>
        <span className="major-category">{selected.category}{selected.preview.kind !== "coming-soon" && <> · {selected.minutes} minute preview</>}</span>
        <p>{selected.description}</p>
        <SkillList skills={selected.skills} />
        <MajorPreview key={selected.id} preview={selected.preview} onNavigate={closeDialog} />
      </div> : null}
    </dialog>
  );
}
