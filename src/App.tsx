import React, { useEffect, useState } from 'react';
import './App.css';
import '@logseq/libs';
import axios from 'axios';

type Project = {
  id: number;
  name: string;
};

type Label = {
  id: number;
  name: string;
};

const App = () => {
  const [settingsInput, setSettingsInput] = useState({
    apiToken: logseq.settings!.apiToken,
    clearTasks: logseq.settings!.clearTasks,
    sendLabel: logseq.settings!.sendProject,
    sendProject: logseq.settings!.sendLabel,
    allProjects: [{ id: 0, name: '-' }],
    allLabels: [{ id: 0, name: '-' }],
    setDeadlineToday: logseq.settings!.setDeadlineToday,
  });

  useEffect(() => {
    getAllProjectsAndLabels(logseq.settings!.apiToken);
    console.log(settingsInput);
  }, []);

  ////////////////////////////// BUTTONS //////////////////////////////
  const handleInput = (e: any) => {
    const { name, value } = e.target;
    setSettingsInput({ ...settingsInput, [name]: value });
  };

  const handleCheckbox = (e: any) => {
    if (e.target.checked) {
      if (e.target.name === 'clearTasks') {
        setSettingsInput({ ...settingsInput, clearTasks: true });
      }
    } else if (!e.target.checked) {
      if (e.target.name === 'clearTasks') {
        setSettingsInput({ ...settingsInput, clearTasks: false });
      }
    }
  };

  const hide = () => {
    logseq.hideMainUI();
  };

  const saveAndClose = () => {
    logseq.hideMainUI();
    const { allProjects, allLabels, ...settingsToUpdate } = settingsInput;
    logseq.updateSettings(settingsToUpdate);
  };

  // Below function is used for testing
  // const showSettings = () => {
  //   console.log(settingsInput);
  //   console.log(`Project With Prefix Checked: ${projectWithPrefix}`);
  //   console.log(`Project Without Prefix Checked: ${projectWithoutPrefix}`);
  // };

  const submitToken = () => {
    const { allProjects, allLabels, ...settingsToUpdate } = settingsInput;
    logseq.updateSettings(settingsToUpdate);
    getAllProjectsAndLabels(settingsInput.apiToken);
  };
  ////////////////////////////// BUTTONS //////////////////////////////

  const getAllProjectsAndLabels = async (token: string) => {
    const allProjects = await axios.get(
      `https://api.todoist.com/rest/v1/projects`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const allLabels = await axios.get(
      `https://api.todoist.com/rest/v1/labels`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setSettingsInput({
      ...settingsInput,
      allProjects: [{ id: 0, name: '-' }, ...allProjects.data],
      allLabels: [{ id: 0, name: '-' }, ...allLabels.data],
    });
  };

  return (
    <div className="flex justify-center border border-black">
      <div className="absolute top-3 bg-white rounded-lg p-3 w-96 border">
        {/* Start from here */}

        <div className="flex justify-between border-b border-red-500 py-2">
          <input
            className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
            type="text"
            placeholder="Enter your API token"
            aria-label="apiToken"
            onChange={handleInput}
            name="apiToken"
            value={settingsInput.apiToken}
          />
          <button
            className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
            type="button"
            onClick={submitToken}
          >
            Submit Token
          </button>
        </div>

        <div className="mt-5">
          If you have recently updated your project and label lists, please{' '}
          <span
            onClick={() => getAllProjectsAndLabels(logseq.settings?.apiToken)}
            className="hover:cursor-pointer text-teal-700"
          >
            click here to refresh
          </span>
          .
        </div>

        {/* PULLING TASKS */}
        <div className="font-sans mt-5 ">
          <h1 className="text-2xl border-b-2 border-red-500">Pulling tasks</h1>

          <div className="p-3 border border-dashed border-grey-500 mt-2">
            <input
              type="checkbox"
              name="clearTasks"
              className="text-indigo-500 w-8 h-8 mr-2 focus:ring-indigo-400 focus:ring-opacity-25 border border-gray-300 rounded"
              onChange={handleCheckbox}
              value={settingsInput.clearTasks}
            />{' '}
            I want to clear the tasks from Todoist after pulling them over.
          </div>
        </div>

        <div className="flex justify-start mt-3">
          <button
            className="flex-shrink-0 bg-teal-500 hover:bg-teal-700  hover:border-teal-700 border-4 text-white py-1 px-2 rounded mr-2"
            type="button"
            onClick={saveAndClose}
          >
            Save and close
          </button>
          <button
            className="flex-shrink-0 bg-pink-500 hover:bg-pink-700  hover:border-pink-700 border-4 text-white py-1 px-2 rounded mr-2"
            type="button"
            onClick={hide}
          >
            Close without Saving
          </button>
          {/* Button below is used only when testing */}
          {/* <button
            className="flex-shrink-0 bg-pink-500 hover:bg-pink-700  hover:border-pink-700 border-4 text-white py-1 px-2 rounded mr-2"
            type="button"
            onClick={showSettings}
          >
            Show Settings
          </button> */}
        </div>
        {/* End here */}
      </div>
    </div>
  );
};

export default App;
