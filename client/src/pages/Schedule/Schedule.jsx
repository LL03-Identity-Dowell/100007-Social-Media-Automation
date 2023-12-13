import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ScheduledPage from "./_components/Scheduled";
import UnscheduledPage from "./_components/Unscheduled";
import MostRecent from "./_components/MostRecent";
import { ScheduledCustomLink } from "./_components/ScheduledCustomLink";

const routes = {
  SCHEDULED: "scheduled",
  UNSCHEDULED: "unscheduled",
  RECENT: "recent",
};

function ScheduleSection({ show }) {
  const url = useLocation();
  const [pathname, setPathname] = useState("scheduled");
  useEffect(() => {
    show();
    setPathname(url.pathname.split("/")[1]);
  }, [url, show]);
  return (
    <div className='flex flex-col items-center w-full h-full gap-10'>
      <div className='flex items-center gap-1 md:gap-20 md:px-20 md:mt-10 '>
        <ScheduledCustomLink pathname={pathname} to='/recent'>
          Most Recent
        </ScheduledCustomLink>

        <ScheduledCustomLink pathname={pathname} to='/unscheduled'>
          Unscheduled Posts
        </ScheduledCustomLink>
        <ScheduledCustomLink pathname={pathname} to='/scheduled'>
          Scheduled Posts
        </ScheduledCustomLink>
      </div>

      <div>
        {pathname === routes.SCHEDULED && <ScheduledPage />}
        {pathname === routes.UNSCHEDULED && <UnscheduledPage />}
        {pathname === routes.RECENT && <MostRecent />}
      </div>
    </div>
  );
}

export default ScheduleSection;
