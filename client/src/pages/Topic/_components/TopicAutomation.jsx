import { useEffect } from 'react';

import { TopicModal } from './TopicModal';

const socialChannels = [
  { id: 1, name: 'Facebook' },
  { id: 2, name: 'Twitter' },
  { id: 3, name: 'Instagram' },
  { id: 4, name: 'LinkedIn' },
  { id: 5, name: 'YouTube' },
  { id: 6, name: 'Pinterest' },
];

const TopicAutomation = ({ show }) => {
  useEffect(() => {
    show();
  }, []);
  return (
    <div className='w-full flex flex-col items-center'>
      <div className='mr-16'>
        <h1 className='text-3xl text-customBlue font-bold w-full mb-6 text-center'>
          Automation for Topics
        </h1>
        <ul className='w-full'>
          {socialChannels.map((channel) => (
            <li
              className='w-2/3 min-w-[60vw] h-20 bg-slate-100/60 mt-1 flex items-center justify-between px-10'
              key={channel.id}>
              <h3 className='text-xl font-semibold  text-customTextBlue'>
                Automation for {channel.name}
              </h3>
              <TopicModal name={channel.name} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TopicAutomation;
