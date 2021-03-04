const fs = require('fs');
const axios = require('axios');
const { MarkovMachine } = require('./markov');

const argv = process.argv;

const handleParameters = async () => {
  let type = argv[2];
  let path = argv[3];
  content = await getContent(type, path);

  let mm = new MarkovMachine(content);
  let text = mm.makeText();

  console.log(text);
};

const cat = (path) => {
  return new Promise((res, rej) => {
    fs.readFile(`./${path}`, 'utf8', function (err, data) {
      if (err) {
        // handle possible error
        console.error(err.message);
        // kill the process and tell the shell it errored
        process.exit(1);
      }
      // otherwise success
      res(data);
    });
  });
};

const webCat = async (url) => {
  try {
    const resp = await axios.get(url);
    return resp.data;
  } catch (err) {
    console.log(err.message);
  }
};

const getContent = (type, path) => {
  if (type === 'url') {
    content = webCat(path);
    return content;
  } else {
    content = cat(path);
    return content;
  }
};

handleParameters();
