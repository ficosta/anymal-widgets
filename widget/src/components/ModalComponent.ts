/**
 * ModalComponent - Modal dialog component
 */

export class ModalComponent extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="modal-overlay">
        <div class="modal-content">
          <button class="modal-close" aria-label="Close">&times;</button>
          <div class="modal-body">
            <slot></slot>
          </div>
        </div>
      </div>
    `;

    this.querySelector('.modal-close')?.addEventListener('click', () => this.close());
    this.querySelector('.modal-overlay')?.addEventListener('click', (e) => {
      if (e.target === e.currentTarget) this.close();
    });
  }

  close() {
    this.remove();
  }
}

if (!customElements.get('modal-component')) {
  customElements.define('modal-component', ModalComponent);
}
