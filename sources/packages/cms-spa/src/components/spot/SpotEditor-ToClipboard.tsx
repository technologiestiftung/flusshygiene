import React, { useState, useEffect } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import TurndownService from 'turndown';
import * as turndownPluginGfm from 'turndown-plugin-gfm';
const turndownService = new TurndownService();
const gfm = turndownPluginGfm.gfm;
turndownService.use(gfm);

export const SpotEditorToClipboard: React.FC<{
  csvValidationRef: React.RefObject<HTMLTableElement>;
  buttonId: string;
}> = ({ csvValidationRef, buttonId }) => {
  const [clipBoardText, setClipBoardText] = useState('');
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);
  useEffect(() => {
    if (copiedToClipboard === false) return;
    setTimeout(() => {
      setCopiedToClipboard(false);
    }, 3000);
  }, [copiedToClipboard]);
  return (
    <CopyToClipboard
      text={clipBoardText}
      onCopy={() => {
        if (csvValidationRef !== null && csvValidationRef.current !== null) {
          // dirty little hotfix for removing the double click error
          // https://github.com/nkbt/react-copy-to-clipboard/issues/100
          const button = document.getElementById(buttonId);
          button!.click();
          setCopiedToClipboard(true);
          setClipBoardText((_prevState) => {
            return turndownService.turndown(
              `<table>${csvValidationRef!.current!.innerHTML}</table>`,
            );
          });
        }
      }}
    >
      <button
        className={'button is-small is-light'}
        type='button'
        id={buttonId}
      >
        In die Zwischenablage
        {copiedToClipboard === true ? '!' : ''}
      </button>
    </CopyToClipboard>
  );
};
