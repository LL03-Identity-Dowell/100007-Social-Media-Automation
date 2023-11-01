import { useState, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import { Menu, Transition } from "@headlessui/react";
import axios from "axios";

import { UnstyledButton } from "../../../components/UnstyledBtn";
import Loading from "../../../components/Loading";
import { ErrorMessages, SuccessMessages } from "../../../components/Messages";

import { useLocation, useNavigate } from 'react-router-dom';

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

function PostDetail({ show }) {
    const [editing, setEditing] = useState(false);
    const [wordCount, setwordCount] = useState(0);
    const [characCount, setCharacCount] = useState(0);
    const [hashCount, setHashCount] = useState(0);
    const [postDetailData, setPostDetailData] = useState();
    const [newParagraphs, setNewParagraphs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);

    const [inputs, setInputs] = useState({
        qualitative_categorization: "Category",
        targeted_for: "Apple-Technology",
        designed_for: "Twitter-uxlivinglab",
        targeted_category: "Brand",
    });

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        show();

        fetch();
    }, []);


    // handle input change
    const handelChange = (e) => {
        const { name, value } = e.target;

        setInputs({
            ...inputs,
            [name]: value,
        });
    };


    //handle next button
    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        const data = {
            qualitative_categorization: inputs.qualitative_categorization,
            targeted_for: inputs.targeted_for,
            designed_for: inputs.designed_for,
            targeted_category: inputs.targeted_category,
            title: postDetailData ? postDetailData.post.title : "",
            paragraphs: newParagraphs ? newParagraphs : [],
            source: postDetailData ? postDetailData.post.source : "",
            image: postDetailData ? postDetailData.images : "",
        };
        console.log(data);
        // Make a POST request to the API endpoint with the session_id
        axios
            .post(`http://127.0.0.1:8000/api/v1/save_post/`, data, {
                withCredentials: true,
            })
            .then((response) => {
                setError(null);
                setLoading(false);
                let resData = response.data;
                console.log(resData.message);
                setSuccess(resData.message)
                setTimeout(() => {
                    navigate("/unscheduled");
                }, 2000);

            })
            .catch((error) => {
                setLoading(false);
                setError("Server error, Please try again later");
                console.error("Error fetching article:", error);
            });
    }

    const handleCharacCount = () => {
        const postParagraphsDiv = document.getElementById('post-paragraphs');

        if (postParagraphsDiv) {
            // const text = postParagraphsDiv.innerText;
            const text = postParagraphsDiv.innerText.replace(/\n/g, '');
            // console.log(text) // Get the text content of the div

            const words = text.split(/\s+/);
            const hashtags = text.match(/#[\w]+/g);

            const wordCount = words.filter(word => word.length > 0).length;
            const characterCount = text.length;
            const hashtagCount = hashtags ? hashtags.length : 0;

            setwordCount(wordCount);
            setCharacCount(characterCount);
            setHashCount(hashtagCount);
        }
    }



    // console.log(wordCount)

    const fetch = () => {
        setLoading(true);

        const { post_id, title, paragraph, source } = location.state.data;

        // console.log(postDetailRecieved);

        let payload = {
            post_id: post_id,
            title: title,
            paragraph: paragraph,
            source: source
        }

        // Make a POST request to the API endpoint with the session_id
        axios
            .post(`http://127.0.0.1:8000/api/v1/post-detail/`, payload, {
                withCredentials: true,
            })
            .then((response) => {
                setError(null);
                setLoading(false);
                let data = response.data;
                // console.log(data);
                setPostDetailData(data);
                let paragraph = data.post.paragraph[0]
                // console.log(paragraph)
                paragraph = paragraph.split("\n\n");
                setNewParagraphs(paragraph)
                handleCharacCount();
                // console.log(paragraph)
                window.scrollTo(0, 0);
            })
            .catch((error) => {
                setLoading(false);
                setError("Server error, Please try again later");
                console.error("Error fetching article:", error);
            });
    };





    const editPost = () => {
        setEditing(true);
    };

    const savePost = () => {
        setEditing(false);
    };

    const imgOverlayClassName = `img-overlay ${editing ? "show-overlay" : ""}`;

    // Initialize Flickity carousel
    const handleFlickity = () => {
        var myFlickity = new Flickity(document.getElementById("myflickity"), {
            contain: true,
            wrapAround: true,
            cellAlign: "left",
            groupCells: true,
            draggable: false,
            pageDots: false,
            initialIndex: 1,
        });

        // Resize the existing Flickity carousel
        myFlickity.resize();
    };



    return (
        <div className='m-4 lg:m-8'>
            {loading && <Loading />}
            {error && <ErrorMessages>{error}</ErrorMessages>}
            {success && <SuccessMessages>{success}</SuccessMessages>}
            <div className='flex flex-row-reverse'>
                {/* Dropdown menu */}
                <Menu as='div' className='relative inline-block text-left'>
                    <div>
                        <Menu.Button
                            id='dropdownDefaultButton'
                            data-dropdown-toggle='dropdown'
                            className='text-white bg-transparent hover:bg-blue-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
                            type='button'
                        >
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                width='30'
                                height='30'
                                fill='#1B3474'
                                className='bi bi-three-dots-vertical'
                                viewBox='0 0 16 16'
                            >
                                <path d='M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z' />
                            </svg>
                        </Menu.Button>
                    </div>

                    <Transition
                        as={Fragment}
                        enter='transition ease-out duration-100'
                        enterFrom='transform opacity-0 scale-95'
                        enterTo='transform opacity-100 scale-100'
                        leave='transition ease-in duration-75'
                        leaveFrom='transform opacity-100 scale-100'
                        leaveTo='transform opacity-0 scale-95'
                    >
                        <Menu.Items className='absolute right-0 z-10 w-56 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                            <div className='py-1'>
                                <Menu.Item>
                                    {({ active }) => (
                                        <a
                                            href='#'
                                            className={classNames(
                                                active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                                                "block px-4 py-2 text-sm"
                                            )}
                                            onClick={editPost}
                                        >
                                            Edit Post
                                        </a>
                                    )}
                                </Menu.Item>
                                <Menu.Item>
                                    {({ active }) => (
                                        <a
                                            href='#'
                                            className={classNames(
                                                active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                                                "block px-4 py-2 text-sm"
                                            )}
                                            onClick={savePost}
                                        >
                                            Save Post
                                        </a>
                                    )}
                                </Menu.Item>
                                <Menu.Item>
                                    {({ active }) => (
                                        <a
                                            href='#'
                                            className={classNames(
                                                active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                                                "block px-4 py-2 text-sm"
                                            )}
                                        >
                                            Delete Post
                                        </a>
                                    )}
                                </Menu.Item>

                                <Menu.Item>
                                    {({ active }) => (
                                        <button
                                            type='submit'
                                            className={classNames(
                                                active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                                                "block w-full px-4 py-2 text-left text-sm"
                                            )}
                                        >
                                            Copy Post
                                        </button>
                                    )}
                                </Menu.Item>
                            </div>
                        </Menu.Items>
                    </Transition>
                </Menu>
            </div>


            <div id='post-title' className='mb-2 text-lg font-bold md:mb-0'>
                {postDetailData && postDetailData.post.title}
            </div>

            <hr className='my-4' />

            <div id='post-paragraphs' className='mt-4 md:mt-8'>
                {
                    postDetailData && newParagraphs.map((paragraph, index) => (
                        <div className='text-base post-paragraph' key={index}>
                            {index > 0 && paragraph}
                        </div>
                    ))
                }
            </div>

            <hr className='my-4' />

            <div id='post-sources' className='mt-4 md:mt-8'>
                <Link
                    to='https://openai.com'
                    className='text-blue-500 post-source hover:underline'
                >
                    {postDetailData && postDetailData.post.source}
                </Link>
            </div>

            <hr className='my-4' />

            <div className='flex flex-col lg:flex-row md:flex-row md:gap-20 lg:gap-24'>
                <div className='relative m-3 image-container'>
                    <div className={imgOverlayClassName}>
                        <button
                            type='button'
                            className='absolute top-0 right-0 open_search glass-button'
                            data-modal-target='defaultModal'
                            data-modal-toggle='defaultModal'
                            onClick={handleFlickity}
                        >
                            <a className='no-underline'>Edit Photo</a>
                        </button>
                    </div>
                    <img
                        src={postDetailData && postDetailData.images}
                        alt='Random image'
                        className='img-fluid post-img'
                    />
                </div>

                <div className='flex flex-col gap-6 mt-5 post-options'>
                    <div className='flex flex-col lg:flex-row lg:gap-8'>
                        <label
                            htmlFor='content'
                            className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                        >
                            <strong>Qualitative categorization:</strong>
                        </label>
                        <select
                            value={inputs.qualitative_categorization}
                            name='qualitative_categorization'
                            onChange={handelChange}
                            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                        >
                            <option value='Category'>Category</option>
                        </select>
                    </div>

                    <div className='flex flex-col lg:flex-row lg:gap-8'>
                        <label
                            htmlFor='brand'
                            className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                        >
                            <strong>Targeted for:</strong>
                        </label>
                        <select
                            value={inputs.targeted_for}
                            id='brand'
                            onChange={handelChange}
                            name='targeted_for'
                            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                        >
                            <option value='Apple-Technology'>Apple-Technology</option>
                            <option value="Google-Technology">Google-Technology</option>
                            <option value="Microsoft-Technology">Microsoft-Technology</option>
                            <option value="Amazon-Technology">Amazon-Technology</option>
                            <option value="Facebook-Technology">Facebook-Technology</option>
                            <option value="Coca-Cola-Beverages">Coca-Cola-Beverages</option>
                            <option value="Disney-Leisure">Disney-Leisure</option>
                            <option value="Samsung-Technology">Samsung-Technology</option>
                            <option value="Louis Vuitton-Luxury">Louis Vuitton-Luxury</option>
                            <option value="McDonald's-Restaurants">McDonald's-Restaurants</option>
                            <option value="Toyota-Automotive">Toyota-Automotive</option>
                            <option value="Intel-Technology">Intel-Technology</option>
                            <option value="NIKE-Apparel">NIKE-Apparel</option>
                            <option value="AT&T-Telecom">AT&T-Telecom</option>
                            <option value="Cisco-Technology">Cisco-Technology</option>
                            <option value="Oracle-Technology">Oracle-Technology</option>
                            <option value="Verizon-Telecom">Verizon-Telecom</option>
                            <option value="Visa-Financial Services">Visa-Financial Services</option>
                            <option value="Walmart-Retail">Walmart-Retail</option>
                            <option value="GE-Diversified">GE-Diversified</option>
                            <option value="Budweiser-Alcohol">Budweiser-Alcohol</option>
                            <option value="SAP-Technology">SAP-Technology</option>
                            <option value="Mercedes-Benz-Automotive">Mercedes-Benz-Automotive</option>
                            <option value="IBM-Technology">IBM-Technology</option>
                            <option value="Marlboro-Tobacco">Marlboro-Tobacco</option>
                            <option value="Netflix-Technology">Netflix-Technology</option>
                            <option value="BMW-Automotive">BMW-Automotive</option>
                            <option value="American Express-Financial Services">American Express-Financial Services</option>
                            <option value="Honda-Automotive">Honda-Automotive</option>
                            <option value="LOreal-Consumer Packaged Goods">LOreal-Consumer Packaged Goods</option>
                            <option value="Gucci-Luxury">Gucci-Luxury</option>
                            <option value="Hermes-Luxury">Hermes-Luxury</option>
                            <option value="Nescafe-Beverages">Nescafe-Beverages</option>
                            <option value="Home Depot-Retail">Home Depot-Retail</option>
                            <option value="Accenture-Business Services">Accenture-Business Services</option>
                            <option value="Pepsi-Beverages">Pepsi-Beverages</option>
                            <option value="Starbucks-Restaurants">Starbucks-Restaurants</option>
                            <option value="Mastercard-Financial Services">Mastercard-Financial Services</option>
                            <option value="Frito-Lay-Consummer Packaged Goods">Frito-Lay-Consummer Packaged Goods</option>
                            <option value="IKEA-Retail">IKEA-Retail</option>
                            <option value="Zara-Retail">Zara-Retail</option>
                            <option value="Gillette-Consumer Packaged Goods">Gillette-Consumer Packaged Goods</option>
                            <option value="HSBC-Financial Services">HSBC-Financial Services</option>
                            <option value="Audi-Automotive">Audi-Automotive</option>
                            <option value="J.P.Morgan-Financial Services">J.P.Morgan-Financial Services</option>
                            <option value="Deloitte-Business Services">Deloitte-Business Services</option>
                            <option value="Sony-Technology">Sony-Technology</option>
                            <option value="UPS-Transportation">UPS-Transportation</option>
                            <option value="Bank of America-Financial Services">Bank of America-Financial Services</option>
                            <option value="Chase-Financial Services">Chase-Financial Services</option>
                            <option value="Adidas-Apparel">Adidas-Apparel</option>
                            <option value="Channel-Luxuey">Channel-Luxuey</option>
                            <option value="Siemens-Diversified">Siemens-Diversified</option>
                            <option value="Nestle-Consumer Packaged Goods">Nestle-Consumer Packaged Goods</option>
                            <option value="CVS-Retail">CVS-Retail</option>
                            <option value="Cartier-Luxury">Cartier-Luxury</option>
                            <option value="Porsche-Automotive">Porsche-Automotive</option>
                            <option value="ESPN-Media">ESPN-Media</option>
                            <option value="Citi-Financial Services">Citi-Financial Services</option>
                            <option value="Wells Fargo -Financial Servies">Wells Fargo -Financial Servies</option>
                            <option value="Adobe-Technology">Adobe-Technology</option>
                            <option value="Pampers-Consumer Packaged Goods">Pampers-Consumer Packaged Goods</option>
                            <option value="Corona-Alchol">Corona-Alchol</option>
                            <option value="T-Mobile-Telecom">T-Mobile-Telecom</option>
                            <option value="Ebay-Technology">Ebay-Technology</option>
                            <option value="Chevrolet-Automotive">Chevrolet-Automotive</option>
                            <option value="PayPal-Financial Services">PayPal-Financial Services</option>
                            <option value="Ford-Automotive">Ford-Automotive</option>
                            <option value="Red Bull-Beveragese">Red Bull-Beverages</option>
                            <option value="PwC-Business Services">PwC-Business Services</option>
                            <option value="HP-Technology">HP-Technology</option>
                            <option value="Colgate-Consumer Packaged Goods">Colgate-Consumer Packaged Goods</option>
                            <option value="Fox-Media">Fox-Media</option>
                            <option value="Lowe's-Retail">Lowe's-Retail</option>
                            <option value="Lancome-Consumer Packaged Goods">Lancome-Consumer Packaged Goods</option>
                            <option value="H&M-Retail">H&M-Retail</option>
                            <option value="Lexus-Automotive">Lexus-Automotive</option>
                            <option value="Santander-Financial Services">Santander-Financial Services</option>
                            <option value="Cosotco-Retail">Cosotco-Retail</option>
                            <option value="Hyundai-Automotive">Hyundai-Automotive</option>
                            <option value="Danone-Consumer Packaged Goods">Danone-Consumer Packaged Goods</option>
                            <option value="Heinenken-Alcohol">Heineken-Alcohol</option>
                            <option value="Uniqlo-Apparel">Uniqlo-Apparel</option>
                            <option value="Goldman Sachs-Financial Services">Goldman Sachs-Financial Services</option>
                            <option value="Hennessy-Alcohol">Hennessy-Alcohol</option>
                            <option value="Nintendo-Technology">Nintendo-Technology</option>
                            <option value="AXA-Financial Services">AXA-Financial Services</option>
                            <option value="Allianz-Financial Services">Allianz-Financial Services</option>
                            <option value="Dell-Technology">Dell-Technology</option>
                            <option value="Caterpillar-Heavy Equipment">Caterpillar-Heavy Equipment</option>
                            <option value="LEGO-Leisure">LEGO-Leisure</option>
                            <option value="Huawai-Technology">Huawai-Technology</option>
                            <option value="John Deere-Heavy Equipment">John Deere-Heavy Equipment</option>
                            <option value="UBS-Financial Services">UBS-Financial Services</option>
                            <option value="KFC-Restaurants">KFC-Restaurants</option>
                            <option value="Burger King-Restaurants">Burger King-Restaurants</option>
                            <option value="EY-Business Services">EY-Business Services</option>
                            <option value="FedEx-Transportation">FedEx-Transportation</option>
                            <option value="Volkswagen-Automotive">Volkswagen-Automotive</option>
                        </select>
                    </div>

                    <div className='flex flex-col lg:flex-row lg:gap-8'>
                        <label
                            htmlFor='channel'
                            className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                        >
                            <strong>Designed for:</strong>
                        </label>
                        <select
                            value={inputs.designed_for}
                            id='channel'
                            onChange={handelChange}
                            name='designed_for'
                            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                        >
                            <option value='Twitter-uxlivinglab'>Twitter-uxlivinglab</option>
                            <option value="Linkdin-uxliving">Linkdin-uxliving</option>
                            <option value="Facebook-Customer stories">Facebook-Customer stories</option>
                            <option value="Instagram-Livinglabstories">Instagram-Livinglabstories</option>
                            <option value="Youtube-Dowell True Moments UX Living Lab">Youtube-Dowell True Moments UX Living Lab</option>
                            <option value="Tiktok">Tiktok</option>
                            <option value="Vimeo-(Brand)">Vimeo-(Brand)</option>
                            <option value="Spotify podcast">Spotify podcast</option>
                            <option value="Second life">Second life</option>
                            <option value="Twitter-dowellresearch">Twitter-dowellresearch</option>
                            <option value="Linkdin-dowellresearch">Linkedin-dowellresearch</option>
                            <option value="Linkdin-Company page-Germany">Linkedin-Company page-Germany</option>
                            <option value="Linkdin-Company page-Singapore">Linkedin-Company page-Singapore</option>
                            <option value="Linkedin-Company page-UK">Linkedin-Company page-UK</option>
                            <option value="Linkedin-Company page-Scandinavia">Linkedin-Company page-Scandinavia</option>
                            <option value="Facebook-DoWell Research">Facebook-DoWell Research</option>
                            <option value="Youtube-Dowell Research">Youtube-Dowell Research</option>
                            <option value="Twitter-seeuser">Twitter-seeuser</option>
                            <option value="Linkedin-Intership">Linkedin-Intership</option>
                            <option value="Facebook-uxlivinglab team">Facebook-uxlivinglab team</option>
                            <option value="Instagram-uxlivinglab team">Instagram-uxlivinglab team</option>
                            <option value="Youtube-Team playlist">Youtube-Team playlist</option>
                            <option value="Twitter-unpacandwin">Twitter-unpacandwin</option>
                            <option value="Linkedin-unpacandwin">Linkedin-unpacandwin</option>
                            <option value="Facebook-unpacandwin">Facebook-unpacandwin</option>
                            <option value="Instagram-unpacandwin">Instagram-unpacandwin</option>
                            <option value="Youtube-unpacandwin">Youtube-unpacandwin</option>
                        </select>
                    </div>

                    <div className='flex flex-col lg:flex-row lg:gap-8'>
                        <label
                            htmlFor='countries'
                            className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                        >
                            <strong>Targeted category:</strong>
                        </label>
                        <select
                            id='channelbrand'
                            value={inputs.targeted_category}
                            onChange={handelChange}
                            name='targeted_category'
                            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                        >
                            <option value='Brand'>Brand</option>
                            <option value="Corporate">Corporate</option>
                            <option value="Team building">Team building</option>
                            <option value="Consumer contest">Consumer contest</option>
                        </select>
                    </div>
                </div>
            </div>

            <hr className='my-4' />

            <div className='flex flex-col justify-around gap-4 md:flex-row lg:flex-row '>
                <span className='bg-gray-100 text-gray-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded mr-2 dark:bg-gray-700 dark:text-gray-400 border border-gray-500'>
                    <svg
                        className='w-2.5 h-2.5 mr-1.5'
                        aria-hidden='true'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                    >
                        <path d='M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm3.982 13.982a1 1 0 0 1-1.414 0l-3.274-3.274A1.012 1.012 0 0 1 9 10V6a1 1 0 0 1 2 0v3.586l2.982 2.982a1 1 0 0 1 0 1.414Z' />
                    </svg>
                    {wordCount} Word(s)
                </span>
                <span className='bg-gray-100 text-gray-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded mr-2 dark:bg-gray-700 dark:text-gray-400 border border-gray-500'>
                    <svg
                        className='w-2.5 h-2.5 mr-1.5'
                        aria-hidden='true'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                    >
                        <path d='M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm3.982 13.982a1 1 0 0 1-1.414 0l-3.274-3.274A1.012 1.012 0 0 1 9 10V6a1 1 0 0 1 2 0v3.586l2.982 2.982a1 1 0 0 1 0 1.414Z' />
                    </svg>
                    {characCount} Character(s)
                </span>
                <span className='bg-gray-100 text-gray-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded mr-2 dark:bg-gray-700 dark:text-gray-400 border border-gray-500'>
                    <svg
                        className='w-2.5 h-2.5 mr-1.5'
                        aria-hidden='true'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                    >
                        <path d='M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm3.982 13.982a1 1 0 0 1-1.414 0l-3.274-3.274A1.012 1.012 0 0 1 9 10V6a1 1 0 0 1 2 0v3.586l2.982 2.982a1 1 0 0 1 0 1.414Z' />
                    </svg>
                    {hashCount} Hashtag(s)
                </span>
            </div>

            <div className='flex justify-center gap-12 mt-8'>
                <UnstyledButton
                    text={"Back"}
                    className='text-base font-semibold bg-customBlue w-[128px] hover:bg-blue-800'
                />
                <UnstyledButton
                    text={"Next"}
                    className='text-base font-semibold bg-customBlue w-[128px] hover:bg-blue-800' onClick={handleSubmit}
                />
            </div>






            {/* Modal toggle */}
            {/* <button
                data-modal-target="defaultModal"
                data-modal-toggle="defaultModal"
                className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                type="button"
            >
                Toggle modal
            </button> */}

            {/* Main modal */}
            <div
                id='defaultModal'
                tabIndex='-1'
                aria-hidden='true'
                className='fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full'
            >
                <div className='relative w-full max-h-full'>
                    {/* Modal content */}
                    <div className='relative bg-white rounded-lg shadow dark:bg-gray-700'>
                        {/* Modal header */}
                        <div className='flex p-4 border-b rounded-t dark:border-gray-600'>
                            <div className='flex items-center justify-center input-group'>
                                <h4 className='text-lg font-bold me-5'>Select Image</h4>
                                {/* {% comment %} <h4 className="me-5">Select Image</h4> {% endcomment */}
                                <div className='form-outline'>
                                    <input
                                        type='text'
                                        id='search_input'
                                        className='form-control'
                                        placeholder='Search images'
                                    />
                                </div>
                                <button
                                    id='search_btn'
                                    className='btn btn-primary'
                                    style={{ height: "38px", backgroundColor: "#36519e" }}
                                >
                                    <i className='fas fa-search'></i>
                                </button>
                            </div>

                            <button
                                type='button'
                                className='inline-flex items-center justify-center w-8 h-8 ml-auto text-sm text-gray-400 bg-transparent rounded-lg hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white'
                                data-modal-hide='defaultModal'
                            >
                                <svg
                                    className='w-3 h-3'
                                    aria-hidden='true'
                                    xmlns='http://www.w3.org/2000/svg'
                                    fill='none'
                                    viewBox='0 0 14 14'
                                >
                                    <path
                                        stroke='currentColor'
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth='2'
                                        d='m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6'
                                    />
                                </svg>
                                <span className='sr-only'>Close modal</span>
                            </button>
                        </div>

                        {/* Modal body */}
                        <div>
                            <div id='carousalContainer'>
                                <div
                                    id='myflickity'
                                    className='main-carousel pexels-image-row'
                                    data-flickity
                                >
                                    <div className='carousel-cell'>
                                        <img
                                            className='carousel-cell-image pexels-img'
                                            id='1'
                                            src='https://images.pexels.com/photos/2818118/pexels-photo-2818118.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
                                            alt='Photo of Hand Holding a Black Smartphone'
                                        />
                                    </div>
                                    <div className='carousel-cell'>
                                        <img
                                            className='carousel-cell-image pexels-img'
                                            id='2'
                                            src='https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
                                            alt='Close-up Photography of Smartphone Icons'
                                        />
                                    </div>
                                    <div className='carousel-cell'>
                                        <img
                                            className='carousel-cell-image pexels-img'
                                            id='3'
                                            src='https://images.pexels.com/photos/267394/pexels-photo-267394.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
                                            alt='Person Wearing White Silicone Strap Black Smartwatch'
                                        />
                                    </div>
                                    <div className='carousel-cell'>
                                        <img
                                            className='carousel-cell-image pexels-img'
                                            id='4'
                                            src='https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
                                            alt='Happy ethnic woman sitting at table with laptop'
                                        />
                                    </div>
                                    <div className='carousel-cell'>
                                        <img
                                            className='carousel-cell-image pexels-img'
                                            id='5'
                                            src='https://images.pexels.com/photos/3184424/pexels-photo-3184424.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
                                            alt='Photo Of People Near Wooden Table'
                                        />
                                    </div>
                                    <div className='carousel-cell'>
                                        <img
                                            className='carousel-cell-image pexels-img'
                                            id='6'
                                            src='https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
                                            alt='People Discuss About Graphs and Rates'
                                        />
                                    </div>
                                    <div className='carousel-cell'>
                                        <img
                                            className='carousel-cell-image pexels-img'
                                            id='7'
                                            src='https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
                                            alt='Group of People Gathered Around Wooden Table'
                                        />
                                    </div>
                                    <div className='carousel-cell'>
                                        <img
                                            className='carousel-cell-image pexels-img'
                                            id='8'
                                            src='https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg'
                                            alt='Silver iMac Displaying Collage Photos'
                                        />
                                    </div>
                                    <div className='carousel-cell'>
                                        <img
                                            className='carousel-cell-image pexels-img'
                                            id='9'
                                            src='https://images.pexels.com/photos/1402787/pexels-photo-1402787.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
                                            alt='Photo of Audi Parked near Trees'
                                        />
                                    </div>
                                    <div className='carousel-cell'>
                                        <img
                                            className='carousel-cell-image pexels-img'
                                            id='10'
                                            src='https://images.pexels.com/photos/1618200/pexels-photo-1618200.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
                                            alt='Football Game'
                                        />
                                    </div>
                                    <div className='carousel-cell'>
                                        <img
                                            className='carousel-cell-image pexels-img'
                                            id='11'
                                            src='https://images.pexels.com/photos/6749745/pexels-photo-6749745.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
                                            alt='Patient in front of an Autorefractor'
                                        />
                                    </div>
                                    <div className='carousel-cell'>
                                        <img
                                            className='carousel-cell-image pexels-img'
                                            id='12'
                                            src='https://images.pexels.com/photos/6132751/pexels-photo-6132751.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
                                            alt='Woman in Formal Wear using ATM'
                                        />
                                    </div>
                                    <div className='carousel-cell'>
                                        <img
                                            className='carousel-cell-image pexels-img'
                                            id='13'
                                            src='https://images.pexels.com/photos/326259/pexels-photo-326259.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
                                            alt='Car With Red Interior'
                                        />
                                    </div>
                                    <div className='carousel-cell'>
                                        <img
                                            className='carousel-cell-image pexels-img'
                                            id='14'
                                            src='https://images.pexels.com/photos/262438/pexels-photo-262438.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
                                            alt='Red and White Dart on Darts Board'
                                        />
                                    </div>
                                    <div className='carousel-cell'>
                                        <img
                                            className='carousel-cell-image pexels-img'
                                            id='15'
                                            src='https://images.pexels.com/photos/4560142/pexels-photo-4560142.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
                                            alt='Excited African American male student celebrating successful results of exams'
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='mt-3 mb-4 text-center image_details'>
                            <p className='mx-3 image_paragraph'>
                                The Dowell UX Livinglab is an innovative research and
                                development laboratory that focuses on the use of technology to
                                improve the quality of life.
                            </p>
                            <p id='imageURL' className='mx-3 image_paragraph'>
                                <strong>URL: </strong>Pexels.com
                            </p>
                            <p id='imageAuthor' className='mx-3 image_paragraph'>
                                <strong>Author: </strong>Pexels
                            </p>
                            <p id='authorURL' className='mx-3 image_paragraph '>
                                <strong>Author URL: </strong>Pexels.com
                            </p>
                        </div>

                        {/* Modal footer */}
                        <div className='flex flex-row-reverse items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600'>
                            <button
                                data-modal-hide='defaultModal'
                                type='button'
                                className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover-bg-blue-700 dark:focus:ring-blue-800'
                            >
                                Update Post
                            </button>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
}

export default PostDetail;
