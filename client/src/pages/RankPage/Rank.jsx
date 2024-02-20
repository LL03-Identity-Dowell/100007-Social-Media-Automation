import {useEffect, useState} from "react";
import {useLocation, useNavigate} from 'react-router-dom';
import axios from "axios";


import Loading from "../../components/Loading";
import {ErrorMessages, SuccessMessages} from "../../components/Messages";


function Rank({show}) {
    const [isProductKey, setIsProductKey] = useState();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [sentences, setSentences] = useState([]);
    const [rank, setRank] = useState({}) // { "1": "rank_12", "3": "rank_5", "6": "rank_9" ...} before switching
    const [id, setId] = useState();


    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const productKey = localStorage.getItem("productKey");
        setIsProductKey(productKey);
      }, []);

    useEffect(() => {
        show();
        fetchSentences();
    }, []);

    useEffect(() => {
        // remove duplicate values properties from rank object leaving only current selection
        const propertiesDeleted = deletePropertiesWithSameValue(rank, id);
    }, [rank]);


    const fetchSentences = () => {
        setLoading(true);

        if (location.state && location.state.data) {
            setLoading(false);
            const sentenceData = location.state.data;

            const apiSentences = Object.keys(sentenceData)
                .filter((key) => key.startsWith('api_sentence_'))
                .map((key) => ({
                    sentenceType: sentenceData[key].sentence_type,
                    sentence: sentenceData[key].sentence, // Assuming 'sentence' is a property in the 'sentenceData' object
                    selectedValue: 'Rank',
                    disabledOptions: [],
                }));

            setSentences(apiSentences);
        } else {
        setLoading(false);
            setError("Cannot retrieve sentences");
            setTimeout(() => {
                navigate('/topic');
            }, 4000);
        }
    };


    const handleChange = (index, event) => {
        const newValue = event.target.value;
        const id = event.target.id;
        setId(id);

        handleRanking(event);

        // remove also from rank object
        const propertiesDeleted = deletePropertiesWithSameValue(rank, id);

        setSentences((prevSentences) => {
            const newSentences = prevSentences.map((sentence, i) => {
                if (i === index) {
                    return {
                        ...sentence,
                        selectedValue: newValue,
                    };
                } else if (sentence.selectedValue === newValue) {


                    // Reset the value in other dropdowns if it matches the new value
                    return {
                        ...sentence,
                        selectedValue: 'Rank',
                    };
                }

                return sentence;
            });

            return newSentences;
        });
    };

    const handleRanking = (event) => {
        const {id, value} = event.target;

        setRank({
            ...rank,
            [id]: value,
        });

    }

    const handleCancel = () => {
        // Go back to the previous page
        navigate(-1);
    };

    const handleSubmit = () => {
        if (isProductKey) {
            navigate("/");
          } 

        if (!checkNumberRankSentence(rank)) {
            setError("Please rank up to three(3) sentences");
            setTimeout(() => {
                setError("");

            }, 4000);

        } else {
            setLoading(true);

            const data = rank
            const flippedData = flipObject(data)

            axios
                .post(`${import.meta.env.VITE_APP_WEBSITEBASEURL}/selected_result/`, flippedData, {
                    withCredentials: true,
                })
                .then((response) => {
                    setLoading(false)
                    let resData = response.data;
                    console.log(resData);
                    setSuccess("Topics ranked successfully!");
                    setTimeout(() => {
                        navigate('/')
                    }, 2000);
                })
                .catch((error) => {
                    setLoading(false);
                    setError("Error ranking topics..!");
                    console.error("Error ranking topics:", error);
                });

            setTimeout(() => {
                setError("");
            }, 4000)
        }

    };

    const checkNumberRankSentence = (allRankData) => {
        const rankLength = Object.keys(allRankData).length

        if (rankLength >= 3) {
            return true;
        } else {
            return false;
        }
    }

    function deletePropertiesWithSameValue(obj, key) {
        const valueToDelete = obj[key];

        const deletedProperties = Object.keys(obj)
            .filter(prop => obj[prop] === valueToDelete && prop !== key);

        deletedProperties.forEach(prop => delete obj[prop]);

        return deletedProperties.length > 0;
    }


    //flip object keys to value, and value to keys
    function flipObject(obj) {
        const flippedObject = {};

        for (const key in obj) {
            if (obj.hasOwnProperty(key) && obj[key] !== null && obj[key] !== undefined && obj[key] !== '') {
                flippedObject[obj[key]] = key;
            }
        }

        return flippedObject;
    }

    return (
        <div className="bg-slate-50 h-full">
            {loading && <Loading/>}
            {error && <ErrorMessages>{error}</ErrorMessages>}
            {success && <SuccessMessages>{success}</SuccessMessages>}

            <div className="flex flex-col justify-center lg:items-center my-5">
                <div className="lg:w-[720px] mb-5">
                    {sentences &&
                        sentences.map((sentence, index) => (
                            <div className="pt-4" key={index}>
                                <p className="block mb-2 font-semibold text-gray-900 dark:text-white">
                                    {sentence.sentenceType}
                                </p>
                                <div className="flex flex-col lg:justify-between lg:flex-row bg-slate-200">
                                    <p className="ml-2 italic">{sentence.sentence}</p>
                                    <span className="answer_rank">
                                        <label>
                                            <select
                                                id={index + 1}
                                                className="block p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                value={sentence.selectedValue}
                                                onChange={(event) => handleChange(index, event)}
                                            >
                                                <option value="" disabled={sentence.disabledOptions.includes('Rank')}>
                                                    Rank
                                                </option>
                                                {[...Array(12)].map((_, i) => (
                                                    <option
                                                        key={i}
                                                        value={`rank_${i + 1}`}
                                                        disabled={sentence.disabledOptions?.includes(i + 1)}
                                                    >
                                                        {i + 1}
                                                    </option>
                                                ))}
                                            </select>
                                        </label>
                                    </span>
                                </div>
                            </div>
                        ))}
                </div>

                <div className="flex mt-4 gap-2 mr-6 md:mr-0 lg:w-[720px] text-white ">
                    <div>
                        <button className="bg-red-500 hover:bg-red-900 rounded py-2 px-6"
                                onClick={handleCancel}>Cancel
                        </button>
                    </div>
                    <div>
                        <button className="bg-green-500 hover:bg-green-900 rounded py-2 px-6"
                                onClick={handleSubmit}>Submit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Rank;