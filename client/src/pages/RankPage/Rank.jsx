import { useState, useEffect, Fragment } from "react";
import { useLocation, useNavigate } from 'react-router-dom';

import Loading from "../../components/Loading";
import { ErrorMessages, SuccessMessages } from "../../components/Messages";



function Rank() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [sentences, setSentences] = useState([]);

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        fetchSentences();
    }, []);

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
            setError("Cannot retrieve sentences");
            setTimeout(() => {
                navigate('/topic');
            }, 4000);
        }
    };


    const handleChange = (index, event) => {
        const newValue = event.target.value;

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


    return (
        <div className="bg-slate-50">
            {loading && <Loading />}
            {error && <ErrorMessages>{error}</ErrorMessages>}
            {success && <SuccessMessages>{success}</SuccessMessages>}

            <div className="flex flex-col justify-center items-center my-24">
                <div className="w-[720px] mb-5">
                    {sentences &&
                        sentences.map((sentence, index) => (
                            <div className="pt-4" key={index}>
                                <p className="block mb-2 font-semibold text-gray-900 dark:text-white">
                                    {sentence.sentenceType}
                                </p>
                                <div className="flex justify-between bg-slate-200">
                                    <p className="ml-2 italic">{sentence.sentence}</p>
                                    <span className="answer_rank">
                                        <label>
                                            <select
                                                className="block p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                value={sentence.selectedValue}
                                                onChange={(event) => handleChange(index, event)}
                                            >
                                                <option value="Rank" disabled={sentence.disabledOptions.includes('Rank')}>
                                                    Rank
                                                </option>
                                                {[...Array(12)].map((_, i) => (
                                                    <option
                                                        key={i}
                                                        value={i + 1}
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

                <div className="flex mt-4 gap-2 mr-6 md:mr-0 w-[720px] text-white ">
                    <div>
                        <button className="bg-red-500 hover:bg-red-900 rounded py-2 px-6">Cancel</button>
                    </div>
                    <div>
                        <button className="bg-green-500 hover:bg-green-900 rounded py-2 px-6">Submit</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Rank;