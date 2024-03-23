import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaPinterest,
  FaTwitter,
  FaYoutube,
} from 'react-icons/fa';

export const Socials = ({ name }) => {
  const lowerCase = name.toLowerCase();
  const icons = [
    {
      name: 'instagram',
      Icon: FaInstagram,
      className: 'text-3xl text-pink-600 md:text-5xl',
    },
    {
      name: 'twitter',
      Icon: FaTwitter,
      className: 'text-3xl text-blue-500 md:text-5xl',
    },
    {
      name: 'pinterest',
      Icon: FaPinterest,
      className: 'text-3xl text-red-600 md:text-5xl',
    },
    {
      name: 'facebook',
      Icon: FaFacebook,
      className: 'text-3xl text-blue-700 md:text-5xl',
    },
    {
      name: 'linkedin',
      Icon: FaLinkedin,
      className: 'text-3xl text-blue-800 md:text-5xl',
    },
    {
      name: 'youtube',
      Icon: FaYoutube,
      className: 'text-3xl text-red-700 md:text-5xl',
    },
  ];
  return icons.map(
    (icon) =>
      icon.name === lowerCase && (
        <icon.Icon className={icon.className} key={name.name} />
      )
  );
};
