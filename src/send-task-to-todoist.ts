import axios from 'axios';

const getProjectId = async (name: string) => {
  let id = 0
  const projects = await axios.get(
    `https://api.todoist.com/rest/v1/projects`,
    {
      headers: {
        Authorization: `Bearer ${logseq.settings?.apiToken}`,
      },
    }
  ).then(function (response) {
    for (let i = 0; i < response.data.length; i++){
      if (response.data[i].name == name){
        id = parseInt(response.data[i].id)
      }
    }  
  });
  return id
};

// const getTaskId = async (name: string, projectId: Number, date?: Date) => {
const getTaskId = async (name: string) => {
  let id = 0
  const tasks = await axios.get(
    `https://api.todoist.com/rest/v1/tasks`,
    {
      headers: {
        Authorization: `Bearer ${logseq.settings?.apiToken}`,
      },
    }
  ).then(function (response) {
    for (let i = 0; i < response.data.length; i++){
      if (response.data[i].content == name){
        logseq.App.showMsg(
          response.data[i].content
        );
        id = parseInt(response.data[i].id)
      }
    }  
  });
  return id
};

const sendTaskToTodist = async (
  content: string,
  project: string,
  date: string,
) => {
  let projectId = await getProjectId(project)
  if (projectId == 0) { projectId = await getProjectId("Inbox") }
  const { apiToken } = logseq.settings!;
  if (date != "") {
    await axios.post(
      'https://api.todoist.com/rest/v1/tasks',
      {
        content: content,
        project_id: projectId,
        due_date: new Date(date)
            .toLocaleDateString('en-GB')
            .split('/')
            .reverse()
            .join('-'),
      },
      {
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
      }
    );
  } else {
    await axios.post(
      'https://api.todoist.com/rest/v1/tasks',
      {
        content: content,
        project_id: projectId,        
      },
      {
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
      }
    );
  }
};

const completeTask = async (
  content: string,
  project: string,
  date?: Date
) => {
  // await getProjectId(project)
  const taskId = await getTaskId(content)
  const { apiToken } = logseq.settings!;
  try {
    await axios.post(
      `https://api.todoist.com/rest/v1/tasks/${taskId}/close`,
      {
      },
      {
        headers: {
          Authorization: `Bearer ${logseq.settings?.apiToken}`,
        },
      }
    );
  } catch (e:any) {
    logseq.App.showMsg(
      e.toString()
    );
  }
};


export default { sendTaskToTodist, completeTask};
