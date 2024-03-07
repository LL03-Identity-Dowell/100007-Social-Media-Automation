import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import Loading from '../../components/Loading';
import { SuccessMessages, ErrorMessages } from '../../components/Messages';
import { TwitterAnalytics } from './_components/analytics/TwitterAnalytics';
import { FacebookAnalytics } from './_components/analytics/FacebookAnalytics';
import { InstagramAnalytics } from './_components/analytics/InstagramAnalytics';
import { PinterestAnalytics } from './_components/analytics/PinterestAnalytics';
import { LinkedinAnalytics } from './_components/analytics/LinkedinAnalytics';
import { YoutubeAnalytics } from './_components/analytics/youtubeAnalytics';
const url = `${import.meta.env.VITE_APP_BASEURL}/post_analytics/`;

const CommentStats = ({ show }) => {
  const [stats, setStats] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const [search] = useSearchParams();
  const { id } = useParams();
  const searchPlatform = search.get('platforms');
  const platforms = searchPlatform.split(',');

  useEffect(() => {
    fetchStats();
  }, [id]);

  useEffect(() => {
    show(true);
  }, []);

  const fetchStats = async () => {
    setError('');
    setSuccess('');

    setLoading(true);
    platforms.forEach((platform) => {
      const body = { id, platform };
      axios
        .post(url, body, {
          withCredentials: true,
        })
        .then((res) => {
          const { data } = res;
          setStats((prevStats) => {
            return { ...prevStats, [data.platform]: data };
          });
          setSuccess('Successfully fetched analytics');
          setLoading(false);
        })
        .catch(() => {
          setError('Something went wrong');
          setLoading(false);
        });
    });
  };

  console.log(stats);

  const twitterAnalytics = stats?.twitter?.analytics_data?.twitter?.analytics;
  const pinterestAnalytics =
    stats?.pinterest?.analytics_data?.pinterest?.analytics;
  const facebookAnalytics =
    stats?.facebook?.analytics_data?.facebook?.analytics;
  const instagramAnalytics =
    stats?.instagram?.analytics_data?.instagram?.analytics;
  const linkedinAnalytics =
    stats?.linkedin?.analytics_data?.linkedin?.analytics;
  const youtubeAnalytics = stats?.youtube?.analytics_data?.youtube?.analytics;

  return (
    <div className='w-[calc(100%-128px)] min-h-full mx-auto'>
      {error && <ErrorMessages>{error}</ErrorMessages>}
      {success && <SuccessMessages>{success}</SuccessMessages>}
      {loading && <Loading />}
      <div className='w-full text-center'>
        <h1 className='text-3xl font-bold text-customBlue'>Analytics</h1>
        <ul className='flex gap-x-6 pt-10 px-6 flex-wrap'>
          {stats?.twitter && (
            <TwitterAnalytics
              twitter={stats?.twitter}
              twitterAnalytics={twitterAnalytics}
            />
          )}

          {stats.facebook && (
            <FacebookAnalytics
              facebookData={stats?.facebook}
              facebookAnalytics={facebookAnalytics}
            />
          )}
          {stats.instagram && (
            <InstagramAnalytics
              instagramData={stats?.instagram}
              instagramAnalytics={instagramAnalytics}
            />
          )}
          {stats.pinterest && (
            <PinterestAnalytics
              pinterestData={stats?.pinterest}
              pinterestAnalytics={pinterestAnalytics}
            />
          )}
          {stats.linkedin && (
            <LinkedinAnalytics
              linkedinData={stats?.linkedin}
              linkedinAnalytics={linkedinAnalytics}
            />
          )}
          {stats.youtube && (
            <YoutubeAnalytics
              youtubeData={stats?.youtube}
              youtubeAnalytics={youtubeAnalytics}
            />
          )}
        </ul>
      </div>
    </div>
  );
};

export default CommentStats;
