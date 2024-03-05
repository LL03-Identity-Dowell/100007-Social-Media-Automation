import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import Loading from '../../components/Loading';
import { SuccessMessages, ErrorMessages } from '../../components/Messages';
import { TwitterAnalytics } from './_components/analytics/TwitterAnalytics';
import { facebookData, instagram } from './utils/fakedata';
import { FacebookAnalytics } from './_components/analytics/FacebookAnalytics';
import { InstagramAnalytics } from './_components/analytics/InstagramAnalytics';
const url = `${import.meta.env.VITE_APP_BASEURL}/post_analytics/`;

const CommentStats = ({ show }) => {
  const [stats, setStats] = useState({ facebook: facebookData, instagram });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useSearchParams();
  const { id } = useParams();
  const searchPlatform = search.get('platforms');
  const platforms = searchPlatform.split(',');

  console.log(stats);

  useEffect(() => {
    fetchStats();
  }, [id]);

  useEffect(() => {
    show(true);
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

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
        })
        .catch(() => {
          setError('Something went wrong');
        });
    });
    setLoading(false);
  };

  const twitterAnalytics = stats?.twitter?.analytics_data?.twitter?.analytics;
  const facebookAnalytics =
    // facebook?.analytics_data?.
    stats?.facebook?.analytics;
  const instagramAnalytics =
    // instagram?.analytics_data?.
    stats?.instagram?.analytics;

  return (
    <div className='w-[calc(100%-128px)] min-h-full mx-auto'>
      {error && <ErrorMessages>{error}</ErrorMessages>}
      {success && <SuccessMessages>{success}</SuccessMessages>}
      {loading ? <Loading /> : null}
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
        </ul>
      </div>
    </div>
  );
};

export default CommentStats;
