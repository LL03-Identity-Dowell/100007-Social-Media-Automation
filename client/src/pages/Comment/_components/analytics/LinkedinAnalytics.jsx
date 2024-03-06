import { linkedin } from '../../../../assets';

export const LinkedinAnalytics = ({ linkedinAnalytics, linkedinData }) => {
  console.log(linkedinAnalytics);
  return (
    <>
      {!(
        Object.keys(linkedinAnalytics).length === 0 &&
        linkedinAnalytics.constructor === Object
      ) ? (
        <li className=' relative border-[2px] border-black/50  p-4 rounded w-[calc(33%-20px)] min-w-64 text-start shrink-0 p-auto md:pl-12 '>
          <h2 className='text-2xl font-semibold text-black/80 mb-4 flex items-center gap-x-2'>
            Stats for Linkedin
            <img src={linkedin} alt='' className='size-8 bg-[#3b7cdd] p-1' />
          </h2>
          <div className='mb-8 text-black/80'>
            <p>Clicks - {linkedinAnalytics?.clickCount}</p>
            <p>Comments - {linkedinAnalytics?.commentCount}</p>
            <p>Engagement - {linkedinAnalytics?.engagement}</p>
            <p>Impression - {linkedinAnalytics?.impressionCount}</p>
            <p>Likes - {linkedinAnalytics?.likeCount}</p>
            <p>Share - {linkedinAnalytics?.shareCount}</p>
            <p>
              Unique Impressions - {linkedinAnalytics?.uniqueImpressionsCount}
            </p>
            <p>Video views - {linkedinAnalytics?.videoViews}</p>
          </div>
          <a
            href={linkedinData?.analytics_data?.linkedin?.postUrl}
            className='absolute bottom-5  underline text-customTextBlue text-lg leading-3 self-end'
            rel='noreferrer'
            target='_blank'>
            Go to the post
          </a>
        </li>
      ) : (
        <li className=' relative border-[2px] border-black/50  p-4 rounded w-[calc(33%-20px)] min-w-64 text-start shrink-0 p-auto md:pl-12 '>
          <h2 className='text-2xl font-semibold text-black/80 mb-4 flex items-center gap-x-2'>
            Stats for Linkedin
            <img src={linkedin} alt='' className='size-8 bg-[#3b7cdd] p-1' />
          </h2>
          <div className='mb-8 text-black/80'>
            <p>Clicks - 0</p>
            <p>Comments - 0</p>
            <p>Engagement - 0</p>
            <p>Impression - 0</p>
            <p>Likes - 0 </p>
            <p>Share - 0</p>
            <p>Unique Impressions - 0</p>
            <p>Video views - 0</p>
          </div>
          <a
            href={linkedinData?.analytics_data?.linkedin?.postUrl}
            className='absolute bottom-5  underline text-customTextBlue text-lg leading-3 self-end'
            rel='noreferrer'
            target='_blank'>
            Go to the post
          </a>
        </li>
      )}
    </>
  );
};

const dj = {
  analytics: {
    clickCount: 0, // Clicks on a post
    commentCount: 0, // Comments count
    engagement: 0, // Organic clicks, likes, comments, and shares over impressions
    impressionCount: 0, // Impressions on a post
    likeCount: 1, // Likes on a count
    reactions: {
      // Get reactions on a LinkedIn share
      like: 1, // "Like in the UI
      praise: 2, // "Celebrate" in the UI
      maybe: 3, // "Curious" in the UI
      empathy: 3, // "Love" in the UI
      interest: 2, // "Insightful" in the UI
      appreciation: 5, // "Support" in the UI
    },
    shareCount: 0, // Shares on a post
    uniqueImpressionsCount: 0, // Unique impressions for a post
    videoViews: 1, // Number of times video viewed
  },
};
