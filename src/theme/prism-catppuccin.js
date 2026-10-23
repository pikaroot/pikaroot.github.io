// Catppuccin themes for prism-react-renderer (code blocks):
// Rosé Pine Dawn for light mode, Frappé for dark mode.

const latte = {
  text: '#575279',
  overlay2: '#797593',
  overlay0: '#9893a5',
  mantle: '#fffaf3',
  mauve: '#7e6a9a',
  red: '#b4637a',
  maroon: '#b4637a',
  peach: '#d7827e',
  yellow: '#c07a1a',
  green: '#3d7f8a',
  sky: '#56949f',
  blue: '#286983',
  pink: '#d7827e',
  lavender: '#907aa9',
};

const frappe = {
  text: '#c6d0f5',
  overlay2: '#949cbb',
  overlay0: '#737994',
  mantle: '#292c3c',
  mauve: '#ca9ee6',
  red: '#e78284',
  maroon: '#ea999c',
  peach: '#ef9f76',
  yellow: '#e5c890',
  green: '#a6d189',
  sky: '#99d1db',
  blue: '#8caaee',
  pink: '#f4b8e4',
  lavender: '#babbf1',
};

/** @returns {import('prism-react-renderer').PrismTheme} */
function makeTheme(c) {
  return {
    plain: {color: c.text, backgroundColor: c.mantle},
    styles: [
      {types: ['comment', 'prolog', 'doctype', 'cdata'], style: {color: c.overlay0, fontStyle: 'italic'}},
      {types: ['punctuation'], style: {color: c.overlay2}},
      {types: ['namespace'], style: {opacity: 0.8}},
      {types: ['tag', 'deleted'], style: {color: c.red}},
      {types: ['property', 'attr-name'], style: {color: c.blue}},
      {types: ['boolean', 'number', 'constant', 'symbol'], style: {color: c.peach}},
      {types: ['string', 'char', 'attr-value', 'inserted', 'template-string'], style: {color: c.green}},
      {types: ['selector', 'builtin', 'class-name', 'maybe-class-name'], style: {color: c.yellow}},
      {types: ['operator', 'entity', 'url'], style: {color: c.sky}},
      {types: ['keyword', 'atrule', 'important'], style: {color: c.mauve}},
      {types: ['function'], style: {color: c.blue}},
      {types: ['regex'], style: {color: c.pink}},
      {types: ['variable', 'parameter'], style: {color: c.maroon}},
      {types: ['imports', 'exports'], style: {color: c.lavender}},
      {types: ['bold'], style: {fontWeight: 'bold'}},
      {types: ['italic'], style: {fontStyle: 'italic'}},
    ],
  };
}

export const latteTheme = makeTheme(latte);
export const frappeTheme = makeTheme(frappe);
