import { html, LitElement } from 'lit-element';

export class ResultsView extends LitElement {
  static get properties() {
    return {
      latitude: { type: String },
      longitude: { type: String },
      radius: { type: Number },
    };
  }

  render() {
    return html`
      <h1>Results</h1>
      <p>
        Displaying results</strong> for
        <code>latitude</code> = <code>${this.latitude}</code>,
        <code>longitude</code> = <code>${this.longitude}</code> and
        <code>radius</code> = <code>${this.radius}</code>
      </p>
    `;
  }
}

customElements.define('results-view', ResultsView);
