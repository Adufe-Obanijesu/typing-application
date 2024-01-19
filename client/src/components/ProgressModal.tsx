import React, { useContext } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
  import { Line } from 'react-chartjs-2';
  import {faker} from '@faker-js/faker';
  
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

// component
import Modal from "./Modal";
import { StateContext } from "@/contexts/state";

const ProgressModal = () => {

    const { state, dispatch } = useContext(StateContext);
    const { user, presets, darkMode } = state;
    const { difficulty } = presets;

    const labels = user?.scores[difficulty].scores.map(score => score.date) || [];
    const scoreData = user?.scores[difficulty].scores.map(score => score.score) || [];

    const data = {
        labels,
        datasets: [
          {
            label: '',
            data: scoreData,
            borderColor: '#ff9800',
            backgroundColor: 'rgb(51, 65, 85)',
          },
        ],
    }
    
    const options = {
    responsive: true,
    plugins: {
        legend: {
        position: 'top' as const,
        },
        title: {
        display: true,
        text: 'Your Progress',
        },
    },
    };

    const dismiss = ()  => {
      dispatch({ type: "SET_VIEW_PROGRESS", payload: false });
    }

    return (
        <Modal dismiss={dismiss}>
            <div className={`z-10 relative md:rounded-2xl md:shadow-lg md:px-10 px-8 py-12 lg:w-1/2 md:w-2/3 h-full md:h-auto ${darkMode ? "secondaryDarkBg" : "secondaryLightBg"}`}>
                <Line data={data} options={options} />
            </div>
        </Modal>
    )
}

export default ProgressModal;