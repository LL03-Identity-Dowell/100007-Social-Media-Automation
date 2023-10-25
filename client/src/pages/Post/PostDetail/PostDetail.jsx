import React, { useState, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import { Menu, Transition } from "@headlessui/react";
import { UnstyledButton } from "../../../components/UnstyledBtn";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function PostDetail({ show }) {
  useEffect(() => {
    show();
  }, []);

  

  const [editing, setEditing] = useState(false);

  const [isModalOpen, setModalOpen] = useState(false);

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const editPost = () => {
    setEditing(true);
  };

  const savePost = () => {
    setEditing(false);
  };

  const imgOverlayClassName = `img-overlay ${editing ? "show-overlay" : ""}`;

  // Initialize Flickity carousel
  // var myModal = document.getElementById('largeModal');
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
    <div className="m-4 lg:m-8">
      <div className="flex flex-row-reverse">
        {/* Dropdown menu */}
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button
              id="dropdownDefaultButton"
              data-dropdown-toggle="dropdown"
              className="text-white bg-transparent hover:bg-blue-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                fill="#1B3474"
                className="bi bi-three-dots-vertical"
                viewBox="0 0 16 16"
              >
                <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
              </svg>
            </Menu.Button>
          </div>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1">
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="#"
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
                      href="#"
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
                      href="#"
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
                      type="submit"
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

      <div id="post-title" className="text-lg font-bold mb-2 md:mb-0">
        The inform documentation was informed by the Livinglab.
      </div>

      <hr className="my-4" />

      <div id="post-paragraphs" className="mt-4 md:mt-8">
        <div className="post-paragraph text-base">
          The Livinglab is an innovative research and development laboratory
          that focuses on the use of technology to improve the quality of life.
          The Livinglab has recently released a new document that discusses the
          use of technology in the industry. This document, entitled “The Inform
          Documentation”, provides an in-depth look at how technology can be
          used in the industry to improve efficiency and productivity.
        </div>
        <div className="post-paragraph text-base">
          The Livinglab is an innovative research and development laboratory
          that focuses on the use of technology to improve the quality of life.
          The Livinglab has recently released a new document that discusses the
          use of technology in the industry. This document, entitled “The
          Inform.
        </div>
        <div className="post-paragraph text-base">
          The Livinglab is an innovative research and development laboratory
          that focuses on the use of technology to improve the quality of life.
          The Livinglab has recently released a new document that discusses the
          use of technology in the industry. This document, entitled “The Inform
          Documentation”, provides an in-depth look at how technology can be
          used in the industry to improve efficiency and productivity.
        </div>
        <div className="post-paragraph text-base">
          The Livinglab is an innovative research and development laboratory
          that focuses on the use of technology to improve the quality of life.
          The Livinglab has recently released a new document that discusses the
          use of technology in the industry. This document, entitled “The Inform
          Documentation”.
        </div>
      </div>

      <hr className="my-4" />

      <div id="post-sources" className="mt-4 md:mt-8">
        <Link
          to="https://openai.com"
          className="post-source text-blue-500 hover:underline"
        >
          https://openai.com
        </Link>
      </div>

      <hr className="my-4" />

      <div className="flex flex-col lg:flex-row md:flex-row md:gap-20 lg:gap-24">
        <div className="m-3 relative image-container">
          <div className={imgOverlayClassName}>
            <button
              type="button"
              className="open_search glass-button absolute top-0 right-0"
              data-modal-target="defaultModal"
              data-modal-toggle="defaultModal"
              onClick={handleFlickity}
            >
              <a className="no-underline">Edit Photo</a>
            </button>
          </div>
          <img
            src="https://images.pexels.com/photos/261621/pexels-photo-261621.jpeg?auto=compress&cs=tinysrgb&h=350"
            alt="Random image"
            className="img-fluid post-img"
          />
        </div>

        <div className="post-options mt-5 flex flex-col gap-6">
          <div className="flex flex-col lg:flex-row lg:gap-8">
            <label
              htmlFor="content"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              <strong>Qualitative categorization:</strong>
            </label>
            <select
              name="qualitative_categorization"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option value="category">category</option>
            </select>
          </div>

          <div className="flex flex-col lg:flex-row lg:gap-8">
            <label
              htmlFor="brand"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              <strong>Targeted for:</strong>
            </label>
            <select
              id="brand"
              name="targeted_for"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option value="Apple-Technology">Apple-Technology</option>
            </select>
          </div>

          <div className="flex flex-col lg:flex-row lg:gap-8">
            <label
              htmlFor="channel"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              <strong>Designed for:</strong>
            </label>
            <select
              id="channel"
              name="designed_for"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option value="Twitter-uxlivinglab">Twitter-uxlivinglab</option>
            </select>
          </div>

          <div className="flex flex-col lg:flex-row lg:gap-8">
            <label
              htmlFor="countries"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              <strong>Targeted category:</strong>
            </label>
            <select
              id="channelbrand"
              name="targeted_category"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option value="Brand">Brand</option>
            </select>
          </div>
        </div>
      </div>

      <hr className="my-4" />

      <div className="flex justify-around flex-col md:flex-row lg:flex-row gap-4 ">
        <span className="bg-gray-100 text-gray-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded mr-2 dark:bg-gray-700 dark:text-gray-400 border border-gray-500">
          <svg
            className="w-2.5 h-2.5 mr-1.5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm3.982 13.982a1 1 0 0 1-1.414 0l-3.274-3.274A1.012 1.012 0 0 1 9 10V6a1 1 0 0 1 2 0v3.586l2.982 2.982a1 1 0 0 1 0 1.414Z" />
          </svg>
          550 Word(s)
        </span>
        <span className="bg-gray-100 text-gray-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded mr-2 dark:bg-gray-700 dark:text-gray-400 border border-gray-500">
          <svg
            className="w-2.5 h-2.5 mr-1.5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm3.982 13.982a1 1 0 0 1-1.414 0l-3.274-3.274A1.012 1.012 0 0 1 9 10V6a1 1 0 0 1 2 0v3.586l2.982 2.982a1 1 0 0 1 0 1.414Z" />
          </svg>
          4500 Character(s)
        </span>
        <span className="bg-gray-100 text-gray-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded mr-2 dark:bg-gray-700 dark:text-gray-400 border border-gray-500">
          <svg
            className="w-2.5 h-2.5 mr-1.5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm3.982 13.982a1 1 0 0 1-1.414 0l-3.274-3.274A1.012 1.012 0 0 1 9 10V6a1 1 0 0 1 2 0v3.586l2.982 2.982a1 1 0 0 1 0 1.414Z" />
          </svg>
          8 Hashtag(s)
        </span>
      </div>

      <div className="mt-8 flex gap-12 justify-center">
        <UnstyledButton
          text={"Back"}
          className="text-base font-semibold bg-customBlue w-[128px] hover:bg-blue-800"
        />
        <UnstyledButton
          text={"Next"}
          className="text-base font-semibold bg-customBlue w-[128px] hover:bg-blue-800"
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
        id="defaultModal"
        tabIndex="-1"
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
      >
        <div className="relative w-full  max-h-full">
          {/* Modal content */}
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            {/* Modal header */}
            <div className="flex p-4 border-b rounded-t dark:border-gray-600">
              <div className="input-group flex items-center justify-center">
                <h4 className="me-5 text-lg font-bold">Select Image</h4>
                {/* {% comment %} <h4 className="me-5">Select Image</h4> {% endcomment */}
                <div className="form-outline">
                  <input
                    type="text"
                    id="search_input"
                    className="form-control"
                    placeholder="Search images"
                  />
                </div>
                <button
                  id="search_btn"
                  className="btn btn-primary"
                  style={{ height: "38px", backgroundColor: "#36519e" }}
                >
                  <i className="fas fa-search"></i>
                </button>
              </div>

              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-hide="defaultModal"
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>

            {/* Modal body */}
            <div>
              <div id="carousalContainer">
                <div
                  id="myflickity"
                  className="main-carousel pexels-image-row"
                  data-flickity
                >
                  <div className="carousel-cell">
                    <img
                      className="carousel-cell-image pexels-img"
                      id="1"
                      src="https://images.pexels.com/photos/2818118/pexels-photo-2818118.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                      alt="Photo of Hand Holding a Black Smartphone"
                    />
                  </div>
                  <div className="carousel-cell">
                    <img
                      className="carousel-cell-image pexels-img"
                      id="2"
                      src="https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                      alt="Close-up Photography of Smartphone Icons"
                    />
                  </div>
                  <div className="carousel-cell">
                    <img
                      className="carousel-cell-image pexels-img"
                      id="3"
                      src="https://images.pexels.com/photos/267394/pexels-photo-267394.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                      alt="Person Wearing White Silicone Strap Black Smartwatch"
                    />
                  </div>
                  <div className="carousel-cell">
                    <img
                      className="carousel-cell-image pexels-img"
                      id="4"
                      src="https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                      alt="Happy ethnic woman sitting at table with laptop"
                    />
                  </div>
                  <div className="carousel-cell">
                    <img
                      className="carousel-cell-image pexels-img"
                      id="5"
                      src="https://images.pexels.com/photos/3184424/pexels-photo-3184424.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                      alt="Photo Of People Near Wooden Table"
                    />
                  </div>
                  <div className="carousel-cell">
                    <img
                      className="carousel-cell-image pexels-img"
                      id="6"
                      src="https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                      alt="People Discuss About Graphs and Rates"
                    />
                  </div>
                  <div className="carousel-cell">
                    <img
                      className="carousel-cell-image pexels-img"
                      id="7"
                      src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                      alt="Group of People Gathered Around Wooden Table"
                    />
                  </div>
                  <div className="carousel-cell">
                    <img
                      className="carousel-cell-image pexels-img"
                      id="8"
                      src="https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg"
                      alt="Silver iMac Displaying Collage Photos"
                    />
                  </div>
                  <div className="carousel-cell">
                    <img
                      className="carousel-cell-image pexels-img"
                      id="9"
                      src="https://images.pexels.com/photos/1402787/pexels-photo-1402787.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                      alt="Photo of Audi Parked near Trees"
                    />
                  </div>
                  <div className="carousel-cell">
                    <img
                      className="carousel-cell-image pexels-img"
                      id="10"
                      src="https://images.pexels.com/photos/1618200/pexels-photo-1618200.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                      alt="Football Game"
                    />
                  </div>
                  <div className="carousel-cell">
                    <img
                      className="carousel-cell-image pexels-img"
                      id="11"
                      src="https://images.pexels.com/photos/6749745/pexels-photo-6749745.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                      alt="Patient in front of an Autorefractor"
                    />
                  </div>
                  <div className="carousel-cell">
                    <img
                      className="carousel-cell-image pexels-img"
                      id="12"
                      src="https://images.pexels.com/photos/6132751/pexels-photo-6132751.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                      alt="Woman in Formal Wear using ATM"
                    />
                  </div>
                  <div className="carousel-cell">
                    <img
                      className="carousel-cell-image pexels-img"
                      id="13"
                      src="https://images.pexels.com/photos/326259/pexels-photo-326259.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                      alt="Car With Red Interior"
                    />
                  </div>
                  <div className="carousel-cell">
                    <img
                      className="carousel-cell-image pexels-img"
                      id="14"
                      src="https://images.pexels.com/photos/262438/pexels-photo-262438.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                      alt="Red and White Dart on Darts Board"
                    />
                  </div>
                  <div className="carousel-cell">
                    <img
                      className="carousel-cell-image pexels-img"
                      id="15"
                      src="https://images.pexels.com/photos/4560142/pexels-photo-4560142.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                      alt="Excited African American male student celebrating successful results of exams"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="image_details mt-3 mb-4 text-center">
              <p className="image_paragraph mx-3">
                The Dowell UX Livinglab is an innovative research and
                development laboratory that focuses on the use of technology to
                improve the quality of life.
              </p>
              <p id="imageURL" className="image_paragraph mx-3">
                <strong>URL: </strong>Pexels.com
              </p>
              <p id="imageAuthor" className="image_paragraph mx-3">
                <strong>Author: </strong>Pexels
              </p>
              <p id="authorURL" className="image_paragraph mx-3 ">
                <strong>Author URL: </strong>Pexels.com
              </p>
            </div>

            {/* Modal footer */}
            <div className="flex flex-row-reverse items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
              <button
                data-modal-hide="defaultModal"
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover-bg-blue-700 dark:focus:ring-blue-800"
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
