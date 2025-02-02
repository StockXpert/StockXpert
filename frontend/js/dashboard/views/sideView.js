import View from './view.js';
import * as helpers from '../helpers.js';
import * as model from '../model.js';
import { GROUP_BTNS } from '../config.js';
class SideView extends View {
  _parentElement = document.querySelector('.sidebar');
  btns = [
    document.querySelector('.dashbord-btn'),
    document.querySelector('.utilisateurs'),
    document.querySelector('.structures-btn'),
    document.querySelector('.roles-btn'),
    document.querySelector('.permissions-btn'),
    document.querySelector('.modification-btn'),
    document.querySelector('.statistiques-btn'),
    document.querySelector('.archive-btn'),
    document.querySelector('.articles-btn'),
    document.querySelector('.chapitres-btn'),
    document.querySelector('.produits-btn'),
    document.querySelector('.bon-de-commandes-btn'),
    document.querySelector('.bon-de-commandes-interne-btn'),
    document.querySelector('.inventaire-btn'),
    document.querySelector('.fournisseurs-btn'),
  ];
  divs = [
    document.getElementById('main-profile-table'),
    document.getElementById('main-table-users'),
    document.getElementById('main-table-structures'),
    document.getElementById('main-table-roles'),
    document.getElementById('main-table-permissions'),
    document.getElementById('main-table-modifications'),
    document.getElementById('main-table-statistiques'),
    ,
    document.getElementById('main-table-articles'),
    document.getElementById('main-table-chapitres'),
    document.getElementById('main-table-produits'),
    document.getElementById('main-table-bdc'),
    document.getElementById('main-table-bdci'),
    document.getElementById('main-table-inv'),
    document.getElementById('main-table-fournisseur'),
    ,
  ];

  hideAllDivs() {
    // console.log('hideAllDivs', this.divs);
    this.divs.forEach(div => div.classList.add('hidden'));
    this.divs[0].classList.remove('hidden');
  }

  reselectBtns() {
    // this.btns = [...this._parentElement.children];
    this.btns = [
      document.querySelector('.dashbord-btn'),
      document.querySelector('.utilisateurs'),
      document.querySelector('.structures-btn'),
      document.querySelector('.roles-btn'),
      document.querySelector('.permissions-btn'),
      document.querySelector('.modification-btn'),
      document.querySelector('.statistiques-btn'),
      document.querySelector('.archive-btn'),
      document.querySelector('.articles-btn'),
      document.querySelector('.chapitres-btn'),
      document.querySelector('.produits-btn'),
      document.querySelector('.bon-de-commandes-btn'),
      document.querySelector('.bon-de-commandes-interne-btn'),
      document.querySelector('.inventaire-btn'),
      document.querySelector('.fournisseurs-btn'),
    ];
    this.divs = [
      document.getElementById('main-profile-table'),
      document.getElementById('main-table-users'),
      document.getElementById('main-table-structures'),
      document.getElementById('main-table-roles'),
      document.getElementById('main-table-permissions'),
      document.getElementById('main-table-modifications'),
      document.getElementById('main-table-statistiques'),
      ,
      document.getElementById('main-table-articles'),
      document.getElementById('main-table-chapitres'),
      document.getElementById('main-table-produits'),
      document.getElementById('main-table-bdc'),
      document.getElementById('main-table-bdci'),
      document.getElementById('main-table-inv'),
      document.getElementById('main-table-fournisseur'),
    ];
  }

  hideBtns(perms = []) {
    console.log(perms);
    this.btns.forEach(btn => {
      if (perms.includes(btn.name)) {
        btn.classList.remove('hidden');
      } else {
        btn.classList.add('hidden');
      }
    });
  }

  addHandlerBtns(controllers, index = '', myPerms = []) {
    if (index !== '') {
      // console.log(this.divs);
      this.divs.forEach(div => {
        div.classList.add('hidden');
      });
      this.divs[index].classList.remove('hidden');
    } else {
      //TODO: STOP THE JS FROM ADDING EVENT LISTNNERS TO BTNS
      // if error: 'Acces refusé' : display a poppup saying "you lack permisssions to perform this act" (in model error handling probably)
      this.btns.forEach(el => {
        // if (!myPerms.includes(el.name)) return;
        if (el !== null)
          el.addEventListener('click', async e => {
            e.preventDefault();
            const targeto = e.currentTarget;

            this.btns.forEach(btn => {
              if (btn !== null) btn.classList.remove('active');
            });
            this.divs.forEach(btn => {
              if (btn !== null) btn.classList.add('hidden');
            });
            this.divs[
              helpers.findNodeIndex(this.btns, targeto)
            ].classList.remove('hidden');
            targeto.classList.add('active');
            // console.log(helpers.findNodeIndex(this.btns, targeto));
            await controllers[helpers.findNodeIndex(this.btns, targeto)]();
          });
      });
    }
  }

  // TODO: MAKE A CONFIG ARRAY THAT HAS: KEY(PERM GROUP) VALUE(HTML)
  _generateMarkup() {
    return `
    ${this._data
      // .filter(
      //   group =>
      //     group.permissions.length === 1 &&
      //     group.permissions[0].code.startsWith('show')
      // )
      .filter(
        group =>
          group.permissions.length !== 1 ||
          !group.permissions[0].code.startsWith('show')
      )
      .map(el => this._generateMarkupPerview(el.groupName))
      .join('')} 
    <a class="sidebar-btns" href="/frontend/html/login.html">
      <span class="material-icons-sharp"> logout </span>
      <h3>Se deconnecter</h3>
    </a>`;
  }
  _generateMarkupPerview(group) {
    return `
      ${GROUP_BTNS[group]}
    `;
  }
}
export default new SideView();
