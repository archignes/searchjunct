import React from 'react';
import { Button } from './shadcn-ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from './shadcn-ui/card';


interface IntroModalProps {
  handleCloseModal: () => void;
}

const IntroModal: React.FC<IntroModalProps> = ({ handleCloseModal }) => {

  return (
      <>
        <div className="w-9/10">
          <Card>
            <CardHeader>
              <CardTitle>Welcome to Searchjunct!</CardTitle>
            </CardHeader>
            <CardContent>
              <><p>This is your starting point for exploring multiple search engines and routing your queries.</p>
              <div className="flex justify-center">
                <Button variant="outline" className="m-2 min-h-20 font-bold text-2xl hover:bg-blue-100" onClick={handleCloseModal}>Click here to start searching.</Button>
              </div>
              </>
            <hr></hr><div className="walkthrough">
              <h1 className="text-center py-5 text-3xl">Searchjunct Walkthrough</h1>
              <ol>
                  <li className="py-2">
                  <strong>Search Bar</strong>
                  <ul className="pl-3">
                    <li>Type your search query into the text area.</li>
                    <li>Press Enter or click the search button to initiate a search with the next available search system.</li>
                  </ul>
                </li>
                  <li className="py-2">
                  <strong>Toolbar</strong>
                    <ul className="pl-3">
                    <li>Shuffle Button: Randomly reorders the search system buttons.</li>
                    <li>Expand/Collapse Button: Expands or collapses all search system cards.</li>
                    <li>Custom Sort Button: Applies your custom sort order (if defined).</li>
                    <li>Reload Button: Refreshes the search systems list.</li>
                    <li>Info Button: Opens the information modal.</li>
                    <li>Settings Button: Opens the settings modal.</li>
                    <li>Share Button: Copies the current URL with the search query to the clipboard.</li>
                  </ul>
                </li>
                  <li className="py-2">
                    <strong>Search System Buttons</strong>
                    <ul className="pl-3">
                    <li>Click a search system button to initiate a search with that system.</li>
                    <li>Drag the handle to rearrange the order of buttons.</li>
                    <li>Click the chevron to expand/collapse an individual system card.</li>
                  </ul>
                </li>
                  <li className="py-2">
                  <strong>Search System Cards</strong>
                    <ul className="pl-3">
                    <li>Displays information about the search system.</li>
                    <li>Includes links to the system's Wikipedia, Twitter, GitHub, Discord, or LinkedIn pages.</li>
                    <li>Disable Button: Disables the search system, removing it from active searches.</li>
                    <li>Delete Button: Removes the search system from the list (can be restored in Settings).</li>
                  </ul>
                </li>
                  <li className="py-2">
                  <strong>Settings</strong>
                    <ul className="pl-3">
                    <li>Default to Custom Mode: Loads your custom sort order on page load.</li>
                    <li>Immediately Initiate URL-Driven Search: Automatically starts a search when a query is provided in the URL.</li>
                    <li>Reset Local Storage: Clears all stored preferences and reverts to default settings.</li>
                    <li>Custom Sort Order: Drag and drop search systems to create a custom order.</li>
                  </ul>
                </li>
              </ol>
              <p>Note: Some search systems may require manual query pasting as they don't support search-by-URL. The query will be copied to your clipboard when clicking the search button for these systems.</p>
                <p className="py-2">That's it! You're now ready to use Searchjunct to streamline your multi-engine search process. If you have any questions or feedback, please don't hesitate to reach out.</p>
            </div>
              <div className="flex justify-center">
                <Button variant="outline" className="m-2 min-h-20 font-bold text-2xl hover:bg-blue-100" onClick={handleCloseModal}>Click here to start searching.</Button>
              </div>
            </CardContent>
          </Card>
        </div>
    </>
  );
};

export default IntroModal;

