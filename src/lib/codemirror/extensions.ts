import { BlockInfo, EditorView, gutter, GutterMarker } from '@codemirror/view';
import { toggleBlockCommentByLine } from '@codemirror/commands';

function isCommented(view: EditorView, line: BlockInfo) {
  const lineText = view.state.sliceDoc(line.from, line.to).trim();
  return lineText.startsWith('/*') && lineText.endsWith('*/');
}

const gutterMarkerCheckbox = new (class extends GutterMarker {
  checked: boolean;

  constructor() {
    super();
    this.checked = false;
  }

  toDOM() {
    const checkboxEl = document.createElement('input');
    checkboxEl.setAttribute('type', 'checkbox');
    checkboxEl.checked = this.checked;

    return checkboxEl;
  }
})();

const gutterMarkerCheckboxChecked = new (class extends GutterMarker {
  toDOM() {
    const checkboxEl = document.createElement('input');
    checkboxEl.setAttribute('type', 'checkbox');
    checkboxEl.checked = true;

    return checkboxEl;
  }
})();

export const toggleCommentGutter = [
  gutter({
    lineMarker(view, line) {
      const insideComment = isCommented(view, line);
      return insideComment ? gutterMarkerCheckbox : gutterMarkerCheckboxChecked;
    },
    initialSpacer: () => gutterMarkerCheckbox,
    domEventHandlers: {
      click(view, line) {
        view.dispatch({ selection: { anchor: line.to } });
        toggleBlockCommentByLine(view);

        return true;
      },
    },
  }),
];
