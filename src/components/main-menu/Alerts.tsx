// Alerts.tsx

import React, { memo } from 'react';
import {
    Card,
    CardContent,
    CardTitle,
} from '../ui/card';

const AlertsCard: React.FC = () => {

    return (
        <Card className='rounded-md bg-white shadow-none mx-auto'>
            <CardTitle className='text-left pl-2 py-1 mb-2'>Alerts</CardTitle>
            <CardContent className="p-0 flex justify-center items-center flex-col">
                <p className="text-sm p-2">Major redesign shipped on 2024-04-10, please <a href="https://github.com/archignes/searchjunct/issues/new" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 underline">share feedback</a> if you identify any issues or concerns.</p>
                <hr></hr>
                <p className="text-sm text-gray-500 p-2">There are no alerts at this time.</p>

                {/* Template: clean up <a href="https://github.com/archignes/searchjunct/issues/68" target="_blank" rel="noopener noreferrer"
    className="text-red-500 bg-orange-100 underline"><p className="text-sm text-red-500 p-2">
        <span className="font-bold">#68</span> Custom Sort is not currently working.
    </p></a> */}
            </CardContent>
        </Card>
    );
};

export default memo(AlertsCard);

