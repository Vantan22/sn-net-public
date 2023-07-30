export const CURRENT_ID = localStorage.getItem('ID');
export const SET_CURRENTID = (props)=> {
   return localStorage.setItem('ID', props)
};
export const REMOVE_CURRENT_ID = (props)=> {
   return localStorage.removeItem(props)
};
