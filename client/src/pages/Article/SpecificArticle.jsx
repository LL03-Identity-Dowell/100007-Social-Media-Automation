import { useEffect } from "react";
import { teacherImg } from "../../assets";
import ExtraSmallBtn from "../../components/ExtraSmallBtn/ExtraSmallBtn";

function SpecificArticle({ show }) {
  useEffect(() => {
    show();
  }, []);
  return (
    <div>
      <div>
        <div className='px-6 py-3 '>
          <div>
            <p>The consumer Behaviour was aning an citicent education</p>
            <br />
            <p>
              The Consumer Behaviour was aning an Efficient education has become
              an important part of the industry. With the advancement of
              technology, it has become easier for consumers to access
              information and make decisions. As a result, it is essential for
              businesses to understand consumer behaviour and use it to their
              advantage. By understanding the behaviour of their customers,
              businesses can create better products and services and increase
              their profits. In order to effectively use consumer behaviour in
              the industry, businesses must first understand the different types
              of consumer behaviour. They must also consider the different
              factors that influence consumer behaviour such as age, gender,
              socio-economic status, and culture. By understanding these
              factors, businesses can better target their products and services
              to the right consumers. Additionally, businesses can use consumer
              behaviour to better understand customer needs and preferences.
              This can help them create products and services that are tailored
              to their customers needs. In conclusion, consumer behaviour is an
              important tool for businesses in the industry. By understanding
              consumer behaviour, businesses can create better products and
              services and increase their profits. Additionally, businesses can
              use consumer behaviour to better understand customer needs and
              preferences. This can help them create products and services that
              are tailored to their customers needs. This article was written to
              provide an overview of how businesses can use consumer behaviour
              to their advantage in the industry. It is important for businesses
              to understand the different types of consumer behaviour and the
              factors that influence it. Additionally, businesses must consider
              customer needs and preferences when creating products and
              services. By doing so, businesses can ensure that their products
              and services are tailored to their customers needs. Keywords:
              consumer behaviour, industry, age, gender, socio-economic status,
              culture, customer needs, preferences.
            </p>
            <br />
            <p>No sources</p>
            <br />
          </div>

          <div>
            <div className='md:flex'>
              <div className='w-1/2 p-4'>
                <img
                  src={teacherImg}
                  alt='teacher image'
                  className='w-[200px] md:w-[300px] xl:w-[500px] xl:mt-6'
                />
              </div>
              <div className='w-1/2 md:p-4 md:mt-20 '>
                <div>
                  <label>
                    <b>Qualitative: </b>
                  </label>
                  <select className='p-1 text-xs '></select>
                </div>
                <br />

                <div>
                  <label>
                    <b>Targeted for: </b>
                  </label>
                  <select className='p-1 text-xs '>
                    <option>Apple-Technology</option>
                  </select>
                </div>
                <br />

                <div>
                  <label>
                    <b>Designed for: </b>
                  </label>
                  <select className='p-1 text-xs '>
                    <option>Twitter-uxlivinglab</option>
                  </select>
                </div>
                <br />

                <div>
                  <label>
                    <b>Targeted category: </b>
                  </label>
                  <select className='p-1 text-xs '>
                    <option>Brand</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className='border border-t border-black'></div>

          <div className='flex items-center justify-center '>
            <div className='sm:w-1/2'>
              <div className='flex w-full text-sm text-left text-gray-500 dark:text-gray-400'>
                <div className='flex-1 p-4 m-2'>298 Word(s)</div>
                <div className='flex-1 p-4 m-2'>2072 Character(s)</div>
                <div className='flex-1 p-4 m-2'>0 Hashtag(s)</div>
              </div>
            </div>
          </div>

          <div className='flex items-center justify-center '>
            <div className='md:w-1/3 '>
              <div className='flex '>
                <div className='flex-1 md:w-1/3 '>
                  <div className='lg:w-[350px]'>
                    <ExtraSmallBtn title={"Back"} />
                  </div>
                </div>

                <div className='flex-1 md:w-1/2 '>
                  <div className='lg:w-[350px]'>
                    <ExtraSmallBtn title={"Next"} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default SpecificArticle;
