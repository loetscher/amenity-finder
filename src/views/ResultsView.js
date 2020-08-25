import { css, html, LitElement } from 'lit-element';

import '../components/AmenityBrowser.js';
import '../components/AmenityItem.js';
import { distanceBetween } from '../utils/geolocation.js';
import { Requester } from '../mixins/RequesterMixin.js';

/**
 * @extends LitElement
 */
export class ResultsView extends Requester(LitElement) {
  static get properties() {
    return {
      latitude: { type: String },
      longitude: { type: String },
      radius: { type: Number },
      results: { type: Array },
    };
  }

  static get styles() {
    return css`
      :host {
        width: 100%;
        display: flex;
        flex-direction: column;
      }

      amenity-browser {
        position: relative;
        overflow-y: auto;
        flex: 1;

        /* stretch to edges */
        margin-left: calc(var(--amenity-container-padding) * -1);
        margin-right: calc(var(--amenity-container-padding) * -1);
        margin-bottom: calc(var(--amenity-container-padding) * -1);
      }
    `;
  }

  constructor() {
    super();

    this.results = [];
    this.api = this.requestInstance('api');
  }

  /**
   * Implement firstUpdated to perform one-time work after the element’s template has been created.
   *
   * @see https://lit-element.polymer-project.org/guide/lifecycle#firstupdated
   *
   * @param changedProperties
   * @return {Promise<void>}
   */
  async firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    await this._fetchResults();
  }

  render() {
    return html`
      <div>
        <h1>Results</h1>
        <p>
          Displaying results</strong> for
          <code>latitude</code> = <code>${this.latitude}</code>,
          <code>longitude</code> = <code>${this.longitude}</code> and
          <code>radius</code> = <code>${this.radius}</code>
        </p>
        <slot></slot>
      </div>
      <amenity-browser .amenities="${this.results}" .latitude="${this.latitude}" .longitude="${this.longitude}" .radius="${this.radius}"></amenity-browser>
    `;
  }

  async _fetchResults() {
    try {
      const results = await this.api.getNodeByLatLng(this.latitude, this.longitude, this.radius);
      this.results = results
        .map(result => {
          return {
            ...result,
            distance: distanceBetween([this.latitude, this.longitude], [result.lat, result.lon]),
          };
        })
        .sort((a, b) => a.distance - b.distance);
    } catch (err) {
      console.error(err);
    }
  }
}

customElements.define('results-view', ResultsView);
