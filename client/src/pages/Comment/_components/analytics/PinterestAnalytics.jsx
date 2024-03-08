import { pinterest } from '../../../../assets';
import { Dates } from './Dates';

export const PinterestAnalytics = ({ pinterestData, pinterestAnalytics }) => {
  return (
    <li className=' relative border-[2px] border-black/50  p-4 rounded w-[calc(33%-20px)] min-w-64 text-start shrink-0 p-auto md:pl-12 '>
      <h2 className='text-2xl font-semibold text-black/80 mb-4 flex items-center gap-x-2'>
        Stats for Pinterest
        <img src={pinterest} alt='' className='size-8 bg-[#e61d59] p-1' />
      </h2>
      <div className='mb-8 text-black/80'>
        <p>Impression - {pinterestAnalytics?.impression}</p>
        <p>Outbound Clicks - {pinterestAnalytics?.outboundClick}</p>
        <p>Pin Clicks - {pinterestAnalytics?.pinClick}</p>
        <p>Save - {pinterestAnalytics?.save}</p>
        <p>Average Watch Time - {pinterestAnalytics?.videoAvgWatchTime}</p>
        <p>
          Quartile 95 Percent View - {pinterestAnalytics.quartile95PercentView}
        </p>
        <Dates
          next={pinterestData?.analytics_data?.pinterest?.nextUpdate}
          last={pinterestData?.analytics_data?.pinterest?.lastUpdated}
        />
      </div>
      <a
        href={pinterestData?.analytics_data?.pinterest?.postUrl}
        className='absolute bottom-5  underline text-customTextBlue text-lg leading-3 self-end'
        rel='noreferrer'
        target='_blank'>
        Go to the post
      </a>
    </li>
  );
};
