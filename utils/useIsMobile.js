import MobileDetect from "mobile-detect";
import { createContext, useContext, useState, useEffect } from "react";

export const IsSsrMobileContext = createContext(false);

export const getIsSsrMobile = (context) => {
    const md = new MobileDetect(context.req.headers["user-agent"]);
    return Boolean(md.mobile());
};

export const useWindowSize = () => {

    const [windowSize, setWindowSize] = useState({
        width: undefined,
        height: undefined
    })

    useEffect(() => {
        function handleResize() {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        }

        window.addEventListener("resize", handleResize);

        // Call handler right away so state gets updated with initial window size
        handleResize();

        // Don't forget to remove event listener on cleanup
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return windowSize;
};

export const useIsMobile = () => {
    const isSsrMobile = useContext(IsSsrMobileContext);
    const { width: windowWidth } = useWindowSize();
    const isBrowserMobile = !!windowWidth && windowWidth < 460;

    return isSsrMobile || isBrowserMobile;
};