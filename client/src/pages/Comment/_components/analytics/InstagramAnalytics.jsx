import { instagram } from '../../../../assets';
import { Date } from './Dates';

export const InstagramAnalytics = ({ instagramData, instagramAnalytics }) => {
  return (
    <li className=' relative border-[2px] border-black/50  p-4 rounded w-[calc(33%-20px)] min-w-64 text-start shrink-0 p-auto md:pl-12 '>
      <h2 className='text-2xl font-semibold text-black/80 mb-4 flex items-center gap-x-2'>
        Stats for Instagram
        <img src={instagram} alt='' className='size-8 bg-[#ff78c2] p-1' />
      </h2>
      <div className='mb-8 text-black/80'>
        <p>Likes - {instagramAnalytics?.likeCount}</p>
        <p>Comments - {instagramAnalytics?.commentsCount}</p>
        <p>Impression - {instagramAnalytics?.impressionsCount}</p>
        <p>Reach - {instagramAnalytics?.reachCount}</p>
        <p>Saved - {instagramAnalytics?.savedCount}</p>
        <p>Views - {instagramAnalytics?.videoViews}</p>
        <p>
          Reels avg Watch Time - {instagramAnalytics?.igReelsAvgWatchTimeCount}
        </p>
        <p>
          Reels Video Views -{' '}
          {instagramAnalytics?.igReelsVideoViewTotalTimeCount}
        </p>
        <p>Play - {instagramAnalytics?.playsCount}</p>
        <p>Share - {instagramAnalytics?.sharesCount}</p>
        <p>Total Interactions - {instagramAnalytics?.totalInteractionsCount}</p>
        <Date
          next={instagramData?.analytics_data?.instagram?.nextUpdate}
          last={instagramData?.analytics_data?.instagram?.lastUpdated}
        />
      </div>
      <a
        href={instagramData?.analytics_data?.instagram?.postUrl}
        className='absolute bottom-5 underline text-customTextBlue text-lg leading-3 self-end'
        rel='noreferrer'
        target='_blank'>
        Go to the post
      </a>
    </li>
  );
};
