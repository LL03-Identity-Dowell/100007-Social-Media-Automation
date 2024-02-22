import { useState } from "react";
const social = [
  {
    name: "Twitter",
    value: "twitter",
  },
  {
    name: "Facebook",
    value: "facebook",
  },
  {
    name: "Linkedin",
    value: "linkedin",
  },
  {
    name: "Youtube",
    value: "youtube",
  },
  {
    name: "Instagram",
    value: "instagram",
  },
];

const SocialArray = ({ channels }) => {
  const [selectedChannels, setSelectedChannels] = useState(channels || []);

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedChannels((prevChannels) => [...prevChannels, value]);
    } else {
      setSelectedChannels((prevChannels) =>
        prevChannels.filter((channel) => channel !== value)
      );
    }
  };

  return (
    <ul className='flex gap-x-4'>
      {social.map((each) => {
        return (
          <li key={each.value}>
            <label className='space-x-2 select-none'>
              <input
                type='checkbox'
                checked={selectedChannels.includes(each.value)}
                value={each.value}
                onChange={handleCheckboxChange}
              />
              <span>{each.name}</span>
            </label>
          </li>
        );
      })}
    </ul>
  );
};

export default SocialArray;
