import { xTwitter } from '../../../../assets';

export const TwitterAnalytics = ({ twitterAnalytics, twitter }) => {
  return (
    <li className=' relative border-[2px] border-black/50  p-4 rounded w-[calc(33%-20px)] min-w-64 text-start shrink-0 p-auto md:pl-12 '>
      <h2 className='text-2xl font-semibold text-black/80 mb-4 flex items-center gap-x-2'>
        Stats for Twitter
        <img src={xTwitter} alt='' className='size-8 bg-black p-1' />
      </h2>
      <div className='mb-auto text-black/80'>
        <p>
          User profile clicks -{' '}
          {twitterAnalytics?.nonPublicMetrics?.userProfileClicks}
        </p>
        <p>
          Impression - {twitterAnalytics?.nonPublicMetrics?.impressionCount}
        </p>
        <p>Likes - {twitterAnalytics?.organicMetrics?.likeCount}</p>
        <p>Reply - {twitterAnalytics?.organicMetrics?.replyCount}</p>
        <p>Retweets - {twitterAnalytics?.organicMetrics?.retweetCount}</p>
        <p>Quote - {twitterAnalytics?.publicMetrics?.quoteCount}</p>
      </div>
      <a
        href={twitter?.analytics_data?.twitter?.postUrl}
        className='absolute bottom-5  underline text-customTextBlue text-lg leading-3 self-end'
        rel='noreferrer'
        target='_blank'>
        Go to the post
      </a>
    </li>
  );
};
