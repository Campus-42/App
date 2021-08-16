import sw from 'stopword';

const clean = (string) => string.replace(/[^a-zA-Z ]/g, '');

export const serverFuncs = {
  createSearchIndex: async function (item) {
    if (typeof item.description == 'object')
      item.description = item.description.join(' ');

    var description = clean(
      item.description.toLowerCase().replace('\n', ' '),
    ).split(' ');
    description = sw.removeStopwords(description, sw.en);

    // Make title lower case before uploading
    const title = (item.__type == 'society' ? item.name : item.title)
      .toLowerCase()
      .split(' ');

    // Make tags lower case by making them a string again and then an array
    const tags = (item.__type == 'event' ? item.tags : [])
      .join(' ')
      .toLowerCase()
      .split(' ');

    const index = description
      .concat(title)
      .concat(tags)
      .filter((e) => e !== '' && e !== ' ');
    return index;
  },
  cleanString: async function (string) {
    return clean(string);
  },
};
