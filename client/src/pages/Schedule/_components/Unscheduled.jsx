const dummyData = [
  {
    title: "The Livinglab was optimising the automate documentation.",
    paragraph:
      "In simple terms, a blog is a regularly updated website or web page, and can either be used for personal use or to fulfill a business need. ",
    Date: "2023-09-13 00:00:00",
    image:
      "http://dowellfileuploader.uxlivinglab.online/camera_component_images/pexels-photo-4476376.jpeg",
    source: "https://blog.hubspot.com/marketing/what-is-a-blog",
    PK: "65017fe05f5444004f9c4c8d",
    time: "2023-09-13 09:24:42.868097+00:00",
  },
  {
    title: "The Livinglab did not optimise the automate documentation.",
    paragraph:
      "In 1997, Jorn Barger, blogger for Robot Wisdom, coined the term “weblog”, which was meant to describe his process for “logging the web” as he surfed the internet.  The term “weblog” was shortened to “blog” in 1999, by programmer Peter Merholz. ",
    Date: "2023-09-13 00:00:00",
    image:
      "http://dowellfileuploader.uxlivinglab.online/camera_component_images/pexels-photo-4476376.jpeg",
    source: "https://blog.hubspot.com/marketing/what-is-a-blog",
    PK: "65017fa91a3170e17e215b3a",
    time: "2023-09-13 09:23:47.135038+00:00",
  },
  {
    title: "The Livinglab was optimising the automate documentation.",
    paragraph:
      "When we use the let keyword to create a variable, we're able to change which “thing” that label refers to.",
    Date: "2023-07-19 00:00:00",
    image:
      "https://images.pexels.com/photos/733857/pexels-photo-733857.jpeg?auto=compress&cs=tinysrgb&h=350",
    source: "https://www.joshwcomeau.com/javascript/the-const-deception/",
    PK: "64b7b0af1464c0b74f0baa86",
    time: "2023-07-19 09:45:17.298223+00:00",
  },
  {
    title: "The Livinglab was optimising the automate documentation.",
    paragraph: "For example, we can point our fruits label at a new value",
    Date: "2023-07-19 00:00:00",
    image:
      "https://images.pexels.com/photos/4440200/pexels-photo-4440200.jpeg?auto=compress&cs=tinysrgb&h=350",
    source: "https://www.joshwcomeau.com/javascript/the-const-deception/",
    PK: "64b7afa2f5e003091ae0d674",
    time: "2023-07-19 09:40:47.880485+00:00",
  },
  {
    title: "The Livinglab had optimised the automate documentation.",
    paragraph:
      "When I was first learning to program, I thought that the code was executed from left to right: first we create a fruits variable, like an empty box, and then we assemble our array within that box.",
    Date: "2023-07-19 00:00:00",
    image:
      "https://images.pexels.com/photos/6595785/pexels-photo-6595785.jpeg?auto=compress&cs=tinysrgb&h=350",
    source: "https://www.joshwcomeau.com/javascript/the-const-deception/",
    PK: "64b7b04149a0e154ef745d17",
    time: "2023-07-19 09:43:26.859510+00:00",
  },
];

const UnscheduledPage = () => {
  return (
    <div>
      <ul className='space-y-10'>
        {dummyData.map((item) => (
          <li

            id={item.PK}
            key={item.PK}
            className='flex items-center justify-center gap-x-14'
          >
            <div className='flex flex-col w-4/6 gap-y-7 '>
              <span className='text-base text-[#0000007c]'>{item.source}</span>
              <h3 className='text-2xl font-bold text-customTextBlue'>
                {item.title}
              </h3>
              <p className='text-[#333]'>{item.paragraph}</p>
              <div className='self-end space-x-8'>
                <button
                  type='button'
                  className='w-24 h-10 text-sm text-white rounded-md hover:opacity-95 bg-customBlue'
                >
                  Post Now
                </button>
                <button
                  type='button'
                  className='w-24 h-10 text-sm text-white rounded-md hover:opacity-95 bg-[#5c6388]'
                >
                  Schedule
                </button>
              </div>
            </div>
            <img
              className='w-40 h-40 rounded-lg'
              src={item.image}
              alt='image'
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UnscheduledPage;
