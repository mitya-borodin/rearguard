// https://github.com/Quramy/typed-css-modules

import DtsCreator from 'typed-css-modules';

export default (path) => {
  const creator = new DtsCreator();

  return creator.create(path).then(content => {
    console.log(content.tokens);          // ['myClass']
    console.log(content.formatted);       // 'export const myClass: string;'
    content.writeFile();                  // writes this content to "src/style.css.d.ts"
  });
}
