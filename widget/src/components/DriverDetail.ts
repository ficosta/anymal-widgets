/**
 * DriverDetail - F1 driver information
 */

export class DriverDetail extends HTMLElement {
  connectedCallback() {
    const driverId = this.dataset.driverId;
    this.innerHTML = `
      <div class="driver-detail">
        <h3>Driver Detail</h3>
        <p>Driver ID: ${driverId}</p>
      </div>
    `;
  }
}

if (!customElements.get('driver-detail')) {
  customElements.define('driver-detail', DriverDetail);
}
