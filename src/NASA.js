import { LitElement, css, html } from 'lit';
import '@lrnwebcomponents/accent-card/accent-card.js';

export class NASA extends LitElement {
  constructor() {
    super();
    this.image = [];
    this.title = [];
    this.description = [];
    this.secondary_creator = [];
    this.loadData = false;
    this.term =
      'http://images-api.nasa.gov/search?q=SummerMoonFestival&description=Wapakoneta&media_type=image';
  }

  static get properties() {
    return {
      image: { type: Array },
      loadData: {
        type: Boolean,
        reflect: true,
        attribute: 'load-data',
      },
    };
  }

  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === 'loadData' && this[propName]) {
        this.getData();
      } else if (propName === 'image') {
        this.dispatchEvent(
          new CustomEvent('results-changed', {
            detail: {
              value: this.image,
            },
          })
        );
      }
    });
  }

  async getNASAData() {
    fetch(this.term)
      .then(resp => {
        if (resp.ok) {
          // but remote requests should check for a valid response
          return resp.json();
        }

        return false;
      })
      .then(data => {
        // console.log(data);
        this.image = [];
        // many ways to loop here -- https://www.codespot.org/ways-to-loop-through-an-array-in-javascript/#:~:text=6%20Ways%20to%20Loop%20Through%20an%20Array%20in,callback%20function%20for%20each%20element%20in%20the%20array.
        // for loop runs synchronously though
        // this line prevents the linter from being mad since this is kinda a crappy old way of doing this :)
        // details: https://masteringjs.io/tutorials/eslint/ignore#:~:text=You%20can%20use%20comments%20to%20disable%20all%20ESLint,root%20directory..eslintignore%20syntax%20is%20similar%20to%20that%20of.gitignore.
        /* eslint-disable */
        for (let i = 0; i < data.length; i++) {
          // the API we're drawing in is confusing, let's simplify for internal usage to our element
          const eventInfo = {
            image: href[i].image,
            title: data[i].title,
            description: data[i].discription,
            secondary_creator: data[i].secondary_creator,
          };
        }
      });
  }
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
        iframe {
          height: 500px;
          width: 500px;
        }
      `,
    ];
  }

  render() {
    return html`
      ${this.view === 'list'
        ? html`
            <ul>
              ${this.image.map(
                item => html`
                  <li>
                    ${item.image} - ${item.title} - ${item.description} -
                    ${item.secondary_creator}
                  </li>
                `
              )}
            </ul>
          `
        : html`
            ${this.dates.map(
              item => html`
                  <accent-card
                    image_src="${item.image}">
                    <div slot="heading">"${item.title}"
                    <div slot = "content">"${item.description}"
                    <div slot = "author">"${item.secondary_creator}"
                  </accent-card>
                `
            )}
          `}
    `;
  }
}

customElements.define('nasa-image-search', NASA);
