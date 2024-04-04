// Info_Hotkey.tsx

import React from 'react';

import {
  Card,
  CardContent,
} from '../../shadcn-ui/card';


const HotkeyInstructionsCard: React.FC = () => {
  return (
    <>
      <Card className='w-9/10 border-none shadow-none mx-auto'>
        <CardContent >
          <div className="space-y-4">
            <p>
              To enhance your navigation and search experience, Searchjunct supports several hotkeys:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <kbd>Cmd (Mac)</kbd> / <kbd>Ctrl (Windows/Linux)</kbd> + <kbd>Enter</kbd>: Opens the new tabs in the background.
              </li>
              <li>
                <kbd>Alt/Option</kbd> + <kbd>Enter</kbd>: Skips over the next system (marking in yellow) without initiating a search.
              </li>
              <li>
                <kbd>Shift</kbd> + <kbd>Alt/Option</kbd>: Initiates a search in the most recently skipped system (if trigged outside of the search bar).
              </li>
            </ul>
            <p>
              You can use <kbd>Tab</kbd> and <kbd>Enter</kbd> to jump to the next toolbar buttons and search system buttons and interact with them. Using this tool may require switching often between tabs (as the links open in new tabs by default). You can switch between tabs with <kbd>Cmd</kbd>+<kbd>Option</kbd> and left/right arrows. Or you can use <kbd>Cmd</kbd>+<kbd>Shift</kbd>+<kbd>A</kbd> and your up/down arrows.
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default HotkeyInstructionsCard;

