import View from './view.js';
import { AddUserView } from './addUserView.js';
export class DeleteUserView extends AddUserView {
  _window = document.querySelector('.container-supp-user');
  _overlay = document.querySelector('.overlayDel');
  _btnOpen = document.querySelector('.btn-delete-user');
  _btnClose = document.querySelector('.supp-user-annuler');
  _confirm = document.querySelector('.supp-user-confirmer');

  constructor() {
    super();
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  addDeleteController(ctrler) {
    const closeBtn = this._btnClose;
    this._confirm.addEventListener('click', async function (e) {
      closeBtn.click();
      await ctrler();
    });
  }
}
export default new DeleteUserView();
