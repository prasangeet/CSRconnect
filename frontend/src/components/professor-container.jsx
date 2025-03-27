import React from 'react';

function ProfessorContainer() {
  return (
    <div className='bg-white rounded-2xl w-1/4 p-4 flex flex-col items-center justify-center text-center'>
      <h2 className='text-xl font-bold mb-2'>Professors from IITJ</h2>
      <div className='h-10 flex items-center justify-center text-gray-500 text-sm w-full'>
        Not Available Right Now
      </div>
    </div>
  );
}

export default ProfessorContainer;
