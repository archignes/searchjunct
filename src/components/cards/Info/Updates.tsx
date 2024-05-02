// Info_Updates.tsx

import React from 'react';

import {
  Card,
  CardContent,
} from '../../ui/card';
import LastUpdated from '../../LastUpdated';



const UpdatesCard: React.FC = () => {
  return (
    <>
      <Card className='w-9/10 border-none shadow-none mx-auto'>
        <CardContent >
          <a href="https://github.com/archignes/searchjunct/commits/main"
             className="text-blue-500 hover:text-blue-700 transition duration-300 ease-in-out">
            View Recent Commits
          </a>
          <div className='flex justify-center items-center'>
            <LastUpdated />
          </div>
        </CardContent>
      </Card>

    </>
  );
};

  export default UpdatesCard;

