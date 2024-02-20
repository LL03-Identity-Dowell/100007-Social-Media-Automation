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

const SocialArray = () => {
  return (
    <ul className='flex gap-x-4'>
      {social.map((each) => {
        return (
          <li key={each.value}>
            <label className='space-x-2 select-none'>
              <input type='checkbox' value={each.value} />
              <span>{each.name}</span>
            </label>
          </li>
        );
      })}
    </ul>
  );
};

export default SocialArray;
