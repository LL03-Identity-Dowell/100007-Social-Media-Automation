import { facebook } from '../../../../assets';

export const FacebookAnalytics = ({ facebookData, facebookAnalytics }) => {
  return (
    <li className=' relative border-[2px] border-black/50  p-4 rounded w-[calc(33%-20px)] min-w-64 text-start shrink-0 p-auto md:pl-12 '>
      <h2 className='text-2xl font-semibold text-black/80 mb-4 flex items-center gap-x-2'>
        Stats for Facebook
        <img src={facebook} alt='' className='size-8 bg-customTextBlue p-1' />
      </h2>
      <div className='mb-8 text-black/80'>
        <p>Reel play count - {facebookAnalytics?.blueReelsPlayCount}</p>
        <p>Comments - {facebookAnalytics?.commentCount}</p>
        <p>Engaged Users - {facebookAnalytics?.engagedUsers}</p>
        <p>Likes - {facebookAnalytics?.likeCount}</p>
        <p>Negative feedback - {facebookAnalytics?.negativeFeedback}</p>
        <p>Unique impressions - {facebookAnalytics?.postImpressionsUnique}</p>
        <p>Avg Watch Time - {facebookAnalytics?.postVideoAvgTimeWatched}</p>
        <p>Reactions - {facebookAnalytics?.reactions?.total}</p>
        <p>Shares - {facebookAnalytics?.sharesCount}</p>
        <Date
          next={facebookData?.analytics_data?.facebook?.nextUpdate}
          last={facebookData?.analytics_data?.facebook?.lastUpdated}
        />
      </div>
      <a
        href={facebookData?.analytics_data?.facebook?.postUrl}
        className='absolute bottom-5  underline text-customTextBlue text-lg leading-3 self-end'
        rel='noreferrer'
        target='_blank'>
        Go to the post
      </a>
    </li>
  );
};
