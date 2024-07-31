// pages/SearchPage.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import Avatar from '../components/Avatar';
import moment from 'moment';
import { LuDot } from "react-icons/lu";
import VideoThumbnail from '../components/videos/VideoThumbnail';
import VideoList from '../components/videos/VideoList';

const SearchPage = () => {
    const [results, setResults] = useState([]);
    const location = useLocation();
    const query = new URLSearchParams(location.search).get('q');

    useEffect(() => {
        const fetchSearchResults = async () => {
            try {
                const response = await axiosInstance.get(`/videos/search?q=${query}`);
                setResults(response.data.data);
            } catch (error) {
                console.error('Error fetching search results:', error);
            }
        };

        if (query!= null) {
            fetchSearchResults();
        }
    }, [query]);

   
    return (
        <div className="search-page container mx-auto px-4 py-8">

            {results.length > 0 && (
                <p className="text-sm text-gray-500 mb-4">

                    {results.length} {results.length === 1 ? 'result' : 'results'} found
                </p>
            )}
           
            <VideoList videos={results} from={"search-results"}/>
        </div>
    );
};

export default SearchPage;
