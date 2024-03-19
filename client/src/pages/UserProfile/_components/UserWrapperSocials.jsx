export const UserWrapperSocials = ({ children }) => {
  return (
    <div className='bg-pens bg-cover bg-center min-h-max py-6'>
      <div className='bg-overlay max-w-5xl mx-auto py-6 h-max'>{children}</div>
    </div>
  );
};
