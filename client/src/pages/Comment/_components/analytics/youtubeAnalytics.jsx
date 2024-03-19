import { youtube } from '../../../../assets';
import { Dates } from './Dates';

export const YoutubeAnalytics = ({ youtubeAnalytics, youtubeData }) => {
  return (
    <li className=' relative border-[2px] border-black/50  p-4 rounded w-[calc(33%-20px)] min-w-64 text-start shrink-0 p-auto md:pl-12 '>
      <h2 className='text-2xl font-semibold text-black/80 mb-4 flex items-center gap-x-2'>
        Stats for Youtube
        <img src={youtube} alt='' className='size-8 bg-[#e61d27] p-1' />
      </h2>
      <div className='mb-8 text-black/80'>
        <p>Title - {youtubeAnalytics?.channelTitle}</p>
        <p>Comments - {youtubeAnalytics?.comments}</p>
        <p>Likes - {youtubeAnalytics?.likes}</p>
        <p>Dislikes - {youtubeAnalytics?.dislikes}</p>
        <p>
          Estimated Minutes Watched -{' '}
          {youtubeAnalytics?.estimatedMinutesWatched}
        </p>
        <p>Views - {youtubeAnalytics?.views}</p>
        <p>Dislikes - {youtubeAnalytics?.dislikes}</p>

        <p>Average View Duration - {youtubeAnalytics?.averageViewDuration}</p>
        <p>
          Average View Percentage - {youtubeAnalytics?.averageViewPercentage}
        </p>
        <p>Average Watch Time - {youtubeAnalytics?.videoAvgWatchTime}</p>
        <p>
          Videos Added To Playlists - {youtubeAnalytics?.videosAddedToPlaylists}
        </p>

        <Dates
          next={youtubeData?.analytics_data?.youtube?.nextUpdate}
          last={youtubeData?.analytics_data?.youtube?.lastUpdated}
        />
      </div>

      <a
        href={youtubeData?.analytics_data?.youtube?.postUrl}
        className='absolute bottom-5  underline text-customTextBlue text-lg leading-3 self-end'
        rel='noreferrer'
        target='_blank'>
        Go to the post
      </a>
    </li>
  );
};
