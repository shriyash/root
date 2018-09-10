import {IFormState} from "./types";
import { Reducer } from 'redux';

const initialState: IFormState = {
  profile: null,
  schemas: require("./schemas.json"),
  page: 0
};

const form: Reducer<any> = (state: any = initialState, action): any => {
  switch (action.type) {
    case "SET_PAGE":
      return {
        ...state,
        page: action.page
      };
    case "SET_USER_PROFILE":
      return {
        ...state,
        profile: action.profile
      };
    default:
      return state;
  }
};

export default form;