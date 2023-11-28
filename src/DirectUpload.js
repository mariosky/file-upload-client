import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import { useState } from 'react';
import EventSourceComponent from './Notify.js';
//import { BASE_BACKEND_URL } from 'config/urls';
//import { getConfig } from 'config/api';
const BASE_BACKEND_URL = 'http://54.146.67.173:8000';
let image = undefined;

/*function Image({image_url}) {
    return  (
    <img src={ image_url } alt='uploaded' />  
  );
}*/

const directUploadStart = ({ fileName, fileType }) => {
  return axios.post(
    `${BASE_BACKEND_URL}/api/files/upload/direct/start/`,
    { file_name: fileName, file_type: fileType },
    { headers: { 'Content-Type': 'application/json' }
      
    }
  );
};

const directUploadDo = ({ data, file, setOriginal }) => {
  const postData = new FormData();

  for (const key in data?.fields) {
    postData.append(key, data.fields[key]);
  }
  image = data.url+data.fields['key']
  setOriginal(data.url+data.fields['key']);
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
  const [original, setOriginal] = useState();

  const onInputChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      directUploadStart({
        fileName: file.name,
        fileType: file.type
      })
        .then((response) =>
          directUploadDo({ data: response.data, file, setOriginal })
            .then(() => directUploadFinish({ data: response.data }))
            .then(() => {
              setMessage('File upload completed!');
                // const root = ReactDOM.createRoot(document.getElementById('container'));
                // root.render(<Image image_url={image} />);
            })
            .then(() => {
             // setMessage('File upload completed!');
                 const root = ReactDOM.createRoot(document.getElementById('container'));
                 root.render( <EventSourceComponent image_url={image} />);
            })
        )
        .catch((error) => { 
          setMessage('File upload failed!');
          
        });
    }
  };

  return (
    <div>
      <h1>Sube imagen a S3</h1>
      <div>Selecciona los archivos a subir:</div>

      <input id="input" type="file" accept="image/*" onChange={onInputChange} />

      <div>{message} {original}</div>
     <div id="container">
     
     </div>
    
    </div>
  );
};

export default DirectUploadExample;

// export NODE_OPTIONS=--openssl-legacy-provider