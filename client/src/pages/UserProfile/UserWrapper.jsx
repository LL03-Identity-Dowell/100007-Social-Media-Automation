const UserWrapper = ({ children }) => {
  return (
    <div className='bg-pens bg-cover bg-center h-[90vh]'>
      <div className='bg-overlay max-w-5xl mx-auto my-6 h-[85vh] shadow-lg shadow-gray-400'>
        {children}
      </div>
    </div>
  );
};

export default UserWrapper;
