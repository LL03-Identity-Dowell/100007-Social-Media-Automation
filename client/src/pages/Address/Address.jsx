import React, {useEffect} from "react";

const Address = ({close}) => {
    useEffect(() => {
        close();
    }, []);
    return <div className="h-[80vh] mt-12 max-w-5xl mx-auto w-full px-6">
        <div className="w-full overflow-x-auto">
            <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.8138357285243!2d103.8495304142655!3d1.2857064621375176!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31da19096bd6a989%3A0xf0f7a19a28c52f43!2sDoWell%20Research%20Pte%20Ltd!5e0!3m2!1sen!2sng!4v1663343231305!5m2!1sen!2sng"
                className="w-full h-[400px]" preload="none" loading="lazy"></iframe>

        </div>
        <h2 className="mt-10 text-xl lg:text-3xl text-center font-bold text-customBlue">6 Battery Rd, Level 42,
            Singapore 049909</h2>
    </div>;
};

export default Address;
