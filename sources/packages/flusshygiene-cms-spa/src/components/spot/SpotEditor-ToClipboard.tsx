import React, { useState, useEffect } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import TurndownService from 'turndown';
import * as turndownPluginGfm from 'turndown-plugin-gfm';
const turndownService = new TurndownService();
const gfm = turndownPluginGfm.gfm;
turndownService.use(gfm);

export const SpotEditorToClipboard: React.FC<{
  csvValidationRef: React.RefObject<HTMLTableElement>;
}> = ({ csvValidationRef }) => {
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
          setCopiedToClipboard(true);
          setClipBoardText((_prevState) => {
            return turndownService.turndown(
              `<table>${csvValidationRef!.current!.innerHTML}</table>`,
            );
          });
        }
      }}
    >
      <button className={'button is-small is-light'} type='button'>
        In die Zwischenablage
        {copiedToClipboard === true ? '!' : ''}
      </button>
    </CopyToClipboard>
  );
};
