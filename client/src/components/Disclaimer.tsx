import { Dispatch, SetStateAction, useContext } from "react";
import Modal from "./Modal"
import { StateContext } from "@/contexts/state";
import {MdWarning} from "react-icons/md";

const Disclaimer = ({setShouldShow}: {setShouldShow: Dispatch<SetStateAction<"true" | "false">>}) => {

    const { state } = useContext(StateContext);
    const { darkMode } = state;

    const dismiss = () => {
        localStorage.setItem('disclaimerDismissed', 'true');
        setShouldShow("false");
    }

    return (
        <Modal dismiss={dismiss}>
            <div
        className={`z-10 relative md:rounded-2xl md:shadow-lg md:px-12 px-8 py-12 lg:w-1/3 md:w-2/3 h-full md:h-auto ${darkMode ? "secondaryDarkBg" : "secondaryLightBg"}`}
      >
            <h2 className="text-3xl mb-4 font-bold text-center flex items-center gap-2">Disclaimer <MdWarning color="yellow" /></h2>
            The backend runs on a free server that goes to sleep when inactive, so the first request may take a while as the system wakes up.

            <button
            className="bg-orange-500 hover:bg-orange-600 w-full text-center text-white rounded-md mt-4 py-2 focus:outline-none"
            onClick={dismiss}
          >Got it</button>
      </div>
        </Modal>
    )
}

export default Disclaimer;