class EmbeddedMessage extends HTMLElement {
  static get observedAttributes() {
    return ['src'];
  }

  constructor() {
    super();

    // Create a shadow root
    const shadow = this.attachShadow({ mode: 'open' });

    // Create a div
    const div = document.createElement('div');
    div.className = 'message';

    // create a paragraph
    const p = document.createElement('p');
    p.textContent = 'Hello from the iframe:';
    div.appendChild(p);

    // Create a style element
    const style = document.createElement('style');

    // Add the styles to the style element
    style.textContent = `
      .message {
        padding: 10px;
        margin: 10px;
        border: 1px solid #eeeeee;
        border-radius: 15px;
      }
      iframe {
          border: none;
        }`;

    // Append the style element to the shadow root
    shadow.appendChild(style);

    // Create an iframe
    this.iframe = document.createElement('iframe');
    this.iframe.src = this.getAttribute('src'); // get the iframe's source from the component's attribute

    // Append the iframe to the div
    div.appendChild(this.iframe);

    // Append the div to the shadow root
    shadow.appendChild(div);

    // Add the event listener
    window.addEventListener('message', (event) => {
      // Check if the message is coming from the iframe
      if (event.source !== this.iframe.contentWindow) {
        return;
      }

      // Handle the message
      if (event.data.type === 'randomize-text-color') {
        div.style.color = this.getRandomColor();
      } else if (event.data.type === 'set-background-color') {
        // if the current color is the same as the new color, change it to white
        if (div.style.backgroundColor === event.data?.payload?.color) {
          div.style.backgroundColor = 'white';
        } else {
          div.style.backgroundColor = event.data?.payload?.color;
        }
      }
    });
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'src') {
      this.updateIframeSrc(newValue);
    }
  }

  updateIframeSrc(src) {
    // Assuming `this.iframe` is a reference to your iframe element
    this.iframe.src = src;
  }

  getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}

// Define the new element
customElements.define('embedded-message', EmbeddedMessage);
