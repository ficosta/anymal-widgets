/**
 * NavTab - Tab navigation component
 */

export class NavTab extends HTMLElement {
  connectedCallback() {
    const isActive = this.hasAttribute('active');
    this.className = `nav-tab ${isActive ? 'active' : ''}`;

    this.addEventListener('click', () => {
      // Deactivate all siblings
      const siblings = Array.from(this.parentElement?.children || []);
      siblings.forEach((sibling) => {
        if (sibling !== this) {
          sibling.classList.remove('active');
        }
      });

      // Activate this tab
      this.classList.add('active');

      this.dispatchEvent(
        new CustomEvent('tab-selected', { detail: { tab: this.dataset.tab }, bubbles: true })
      );
    });
  }
}

if (!customElements.get('nav-tab')) {
  customElements.define('nav-tab', NavTab);
}
