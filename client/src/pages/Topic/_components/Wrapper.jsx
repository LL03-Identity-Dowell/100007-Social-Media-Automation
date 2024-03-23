import { AutomationForm } from './AutomationForm';
import { Socials } from './Socials';

export const Wrapper = ({ name }) => {
  return (
    <div className='flex flex-col items-center w-full h-full justify-evenly '>
      <Socials name={name} />
      <AutomationForm name={name} />
    </div>
  );
};
