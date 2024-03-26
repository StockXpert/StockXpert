import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import searchView from './views/searchView.js';
import usersView from './views/usersView.js';
// import { AddUserView } from './views/addUserView.js';
// import { EditUserView } from './views/editUserView.js';
import addUserView from './views/addUserView.js';
import sideView from './views/sideView.js';
import numberView from './views/numberView.js';
import editUserView from './views/editUserView.js';
import StructuresView from './views/structuresView.js';
import Fuse from 'https://cdn.jsdelivr.net/npm/fuse.js@6.5.3/dist/fuse.esm.js';
import AddStructureView from './views/addStructureView.js';
import * as helpers from './helpers.js';

//controller is the mastermind behind the applciation
//it orchestrates the entire thing, even the rendering (calls a function from the views that's responsible of rendering and gives it some data fetched by the model's functions to render it (the data as an argument))
// let editUserView = new EditUserView();

const controlSearchResults = async function () {
  try {
    usersView.renderSpinner('');
    await model.loadSearchResults();
    // D Y N A M I C   S E A R C H   A C T I V A T I O N :
    searchView.addHandlerSearchV2(controlFuzzySearch);
    usersView.render(model.state.search.results);
    userViewAdders();
    return;
  } catch (err) {
    console.error(err);
    //TODO: throw err or treat it with a special func
  }
};
// controlAddUser is a handler function that takes in the newUser's data
// this taking of the newUser data is coded in the addHandlerUpload
const controlAddUser = async function (newUser) {
  try {
    console.log(newUser);
    await model.uploadUser(newUser); //new User is going to be in this case here, data received from the upload form's submission (see addUserView.js)
    //treatment of that data retrieved from the view is delegated to the model - (model.uploadUser(newUser)) (in accordance with the MCV architecture)
    addUserView.toggleWindow();
    console.log(model.state.User);
  } catch (err) {
    console.error(err);
  }
};

const controlEditUser = function () {
  //ONCLICK OF A EDIT BUTTON
  //Get the index of the clicked edit button here
  const target = this;
  const targetIndex = helpers.findNodeIndex(editUserView._btnOpen, target);
  //Use it to extract the input data from the state object
  editUserView.changeInputs(model.state.search.queryResults[targetIndex]);
  //                                                                           TODO:
};

const controlNumber = function () {
  numberView._clear();
  model.state.displayed.selected = numberView.calculateCheckboxes();
  numberView.render(model.state);
};

const controlLoadStructures = async function () {
  try {
    console.log('LOADING STRUCTURES...');
    StructuresView.renderSpinner();
    await model.loadStructures();
    console.log('LOADED !');
    StructuresView.render(model.state.structures);
  } catch (error) {
    console.error(error);
  }
};

const controlAddStructure = async function (newStructure) {
  try {
    await model.uploadStructure(newStructure);
    console.log(model.state.structures);
    StructuresView.render(model.state.structures);
    AddStructureView.clearForm();
    //Close Window
    // setTimeout(function () {
    //   AddStructureView.toggleWindow();
    // }, MODAL_CLOSE_SEC * 1000);
  } catch (error) {
    console.error(error);
  }
};

const controlShowUsersEmail = async function () {
  try {
    const options = await model.getUsersEmail();
    AddStructureView.addEmailsSelection(options);
  } catch (error) {
    console.error('🤔 ' + error);
  }
};
// SEARCH

const controlFilterring = function (filters, bool) {
  controlFuzzySearch(filters, bool);
};

const controlFuzzySearch = function (searchKeyword, isFilterring) {
  // console.log(model.state.search.results);
  let fuse = '';
  if (!isFilterring) {
    console.log(model.state.search.results);
    fuse = model.fuseMaker(model.state.search.results);
  } else {
    fuse = model.fuseMaker(model.state.search.queryResults);
  }
  const filteredList = fuse.search(searchKeyword);
  function extractItems(data) {
    return data.map(entry => entry.item);
  }
  //        Q U E R Y        A I N ' T        E M P T Y
  if (!(searchKeyword.trim() === '')) {
    model.state.search.queryResults = extractItems(filteredList);
    usersView.render(model.state.search.queryResults);
    userViewAdders();
    //        Q U E R Y        I S        E M P T Y
  } else {
    if (!isFilterring)
      model.state.search.queryResults = model.state.search.results;
    //RERENDERRING RESULTS CONSTANTLY (This function will get re-executed on each search bar input change)
    //WERE PRING queryResults, so that's where the play is gonna happen
    usersView.render(model.state.search.queryResults);
    userViewAdders();
  }

  // const cleanFilteredList = filteredList
  //   .slice(0, BROWSER_SUGGESTIONS_MAX_SIZE)
  //   .map(el => el.item.longName);
  // renderInputSuggestions(browserInputElement, cleanFilteredList);
};

const userViewAdders = function () {
  numberView.updateMasterCheckbox();
  numberView.addHandlerNumber(controlNumber);
  numberView.addHandlerMasterCheckbox(controlNumber);
  addUserView.addHandlerShowWindow('.add-users-btn', '.add-user-container');
  addUserView.addHandlerHideWindow('.close-btn', '.add-user-container');
  editUserView.addHandlerHideWindow('.close-btn-edit', '.edit-user-container');
  editUserView.addHandlerHideWindow(
    '.edit-btn-decline',
    '.edit-user-container'
  );
  editUserView.addHandlerShowWindow('.details-btn', '.edit-user-container');
  editUserView.addHandlerEdit(controlEditUser);
  // searchView.addHandlerFilter(controlFilterring);
};

//TODO: TEMPORARY
controlSearchResults();

searchView.addHandlerSearch(controlSearchResults);
addUserView.addHandlerUpload(controlAddUser); //adds a handler function, but when that handler gets called, it gets called on data from the form submission          (see addUserView.js) (in this case the handler is controlAddUser())
editUserView.addHandlerUpload(controlAddUser); //adds a handler function, but when that handler gets called, it gets called on data from the form submission          (see addUserView.js) (in this case the handler is controlAddUser())
// editUserView.addHandlerUpload(controlAddUser, '.inputs-edit');
numberView.addHandlerNumber(controlNumber);
const controllers = [controlSearchResults, controlLoadStructures];
sideView.addHandlerBtns(controllers);
numberView.addHandlerMasterCheckbox(controlNumber);

controlShowUsersEmail();
// controlLoadStructures();

AddStructureView.addHandlerUpload(controlAddStructure);

editUserView.addHandlerEdit(controlEditUser);
searchView.addHandlerSearchV2(controlFuzzySearch);
searchView.addHandlerFilter(controlFilterring);
// searchView.addHandlerFilter(controlFilterring, 1);
