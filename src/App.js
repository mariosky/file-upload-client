import React from 'react';

import DirectUpload from './DirectUpload.js';
import PersonList from './PersonList.js';

function App() {
  return (
    <div ClassName="App">
      <DirectUpload />
      <PersonList />
    </div>
  )
}

export default App;

// export NODE_OPTIONS=--openssl-legacy-provider