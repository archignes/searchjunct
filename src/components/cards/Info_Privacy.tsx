// Info_PrivacyInstructions.tsx

import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "../shadcn-ui/alert"

import {
  Card,
  CardContent,
} from '../shadcn-ui/card';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';


const PrivacyInstructionsCard: React.FC = () => {
  return (
    <>
      <Card className='w-9/10" border-none shadow-none mx-auto'>
        <CardContent >
          <div className="space-y-4">
            <Alert>
              <ExclamationTriangleIcon className="h-4 w-4" />
              <AlertTitle>Under Active Development!</AlertTitle>
              <AlertDescription>
                This application is under active development and the guidance provided here is subject to change.
              </AlertDescription>
            </Alert>
            <p>
              Searchjunct runs locally on your browser and sends queries to the selected search engines when a search is initiated.
            </p>
            <p><strong>Note:</strong> If you use URL-based queries, Searchjunct does not currently have a system or process to automatically delete the URLs visited.</p>
            <p>Data Collection: Searchjunct collects data locally in your browser. Data is saved to your browser's session storage and local storage. You can inspect this through your browser's developer tools or in the code. The code that handles storage can be found in the <a href="https://github.com/danielsgriffin/searchjunct/blob/main/src/components/StorageContext.tsx" target="_blank" rel="noopener noreferrer">StorageContext.tsx</a> file in the open source code.</p>
            <h3>Data Usage</h3>
            <p className="pl-4">
              The collected data is used locally to enhance your user experience, enabling custom sorting of the search systems, and disabling or deleting systems.</p>
            <h3>Data Sharing</h3>
            <p className="pl-4">

              Your data is stored locally on your device and is not shared with any third parties outside of actions you take. When you initiate a search, your query is sent to the selected search engine, but no other information is shared.</p>
            <h3>Cookies</h3>
            <p className="pl-4">

              Searchjunct currently does not use cookies.</p>
            <h3>User Control</h3>
            <p className="pl-4">

              You have full control over your data (outside of URL-based visits). You can view, delete, or export your search history at any time through the website or through your browser's developer tools.</p>
            <h3>Policy Updates</h3>
            <p className="pl-4">
              We will notify you here of any significant changes to this privacy policy. Please check this section regularly for updates.</p>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default PrivacyInstructionsCard;