import { firestore } from '../../../firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';

export const FETCH_PROJECTS_SUCCESS = 'FETCH_PROJECTS_SUCCESS';
export const FETCH_PROJECTS_FAILURE = 'FETCH_PROJECTS_FAILURE';

const fetchProjectsSuccess = (projects) => ({
  type: FETCH_PROJECTS_SUCCESS,
  payload: projects,
});

const fetchProjectsFailure = (error) => ({
  type: FETCH_PROJECTS_FAILURE,
  payload: error,
});

export const addProject = (projectData) => async (dispatch) => {
  try {
    // Add to Firestore
    const projectsCollection = collection(firestore, 'projects');
    await addDoc(projectsCollection, projectData);

    // Optionally, dispatch an action after adding project
    // For example, fetch updated projects list
    dispatch(fetchProjects());
  } catch (error) {
    console.error('Error adding project:', error);
    // Handle error or dispatch an error action
  }
};

export const fetchProjects = () => async (dispatch) => {
  try {
    // Fetch from Firestore
    const projectsCollection = collection(firestore, 'projects');
    const projectsSnapshot = await getDocs(projectsCollection);
    const projectsList = projectsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    dispatch(fetchProjectsSuccess(projectsList));
  } catch (error) {
    console.error('Error fetching projects:', error);
    dispatch(fetchProjectsFailure(error.message));
  }
};
