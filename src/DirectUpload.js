import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import { useState } from 'react';

//import { BASE_BACKEND_URL } from 'config/urls';
//import { getConfig } from 'config/api';
const BASE_BACKEND_URL = 'http://ittweb.ddns.net:8000';

class Car extends React.Component {
  render() {
    return <h2>Hi, I am a Car!</h2>
  }
}

const directUploadStart = ({ fileName, fileType }) => {
  return axios.post(
    `${BASE_BACKEND_URL}/api/files/upload/direct/start/`,
    { file_name: fileName, file_type: fileType },
    { headers: { 'Content-Type': 'application/json' }
      
    }
  );
};

const directUploadDo = ({ data, file }) => {
  const postData = new FormData();

  for (const key in data?.fields) {
    postData.append(key, data.fields[key]);
  }

  postData.append('file', file);

  return axios
    .post(data.url, postData, {'Content-Type': 'application/octet-stream'})
    .then(() => Promise.resolve({ fileId: data.id }));
};

const directUploadFinish = ({ data }) => {
  return axios.post(
    `${BASE_BACKEND_URL}/api/files/upload/direct/finish/`,
    { file_id: data.id }
  );
};

const DirectUploadExample = () => {
  const [message, setMessage] = useState();

  const onInputChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      directUploadStart({
        fileName: file.name,
        fileType: file.type
      })
        .then((response) =>
          directUploadDo({ data: response.data, file })
            .then(() => directUploadFinish({ data: response.data }))
            .then(() => {
              setMessage('File upload completed!');
            })
        )
        .catch((error) => { 
          setMessage('File upload failed!');
         const root = ReactDOM.createRoot(document.getElementById('container'));
         root.render(<Car />);
          
        });
    }
  };

  return (
    <div>
      <h1>Sube imagen a S3</h1>
      <div>Selecciona los archivos a subir:</div>

      <input id="input" type="file" accept="image/*" onChange={onInputChange} />

      <div>{message}</div>
     <div id="container">
     
     </div>
    </div>
  );
};

export default DirectUploadExample;

// export NODE_OPTIONS=--openssl-legacy-provider