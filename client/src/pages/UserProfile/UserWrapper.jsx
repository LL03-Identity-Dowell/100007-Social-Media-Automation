const UserWrapper = ({ children }) => {
  return (
    <div className='bg-pens bg-cover bg-center min-h-[90vh]'>
      <div className='bg-overlay max-w-5xl mx-auto my-6 min-h-[85vh] flex flex-col justify-center'>
        {children}
      </div>
    </div>
  );
};

export default UserWrapper;
