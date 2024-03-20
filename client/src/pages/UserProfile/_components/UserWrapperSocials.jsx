export const UserWrapperSocials = ({ children }) => {
  return (
    <div className='bg-pens bg-cover bg-center min-h-[90vh] py-6 h-max'>
      <div className='bg-overlay max-w-5xl mx-auto py-6 min-h-[85vh] h-max'>
        {children}
      </div>
    </div>
  );
};
