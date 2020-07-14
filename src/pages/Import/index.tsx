import React, { useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import Header from '../../components/Header';
import FileList from '../../components/FileList';
import Upload from '../../components/Upload';

import { Container, Title, ImportFileContainer, Footer } from './styles';

import alert from '../../assets/alert.svg';
import api from '../../services/api';

interface FileProps {
  file: File;
  name: string;
  readableSize: string;
}


const Import: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileProps[]>([]);
  const history = useHistory();

  const handleUpload = useCallback( async (): Promise<void> => {
    if (!uploadedFiles.length) return;

    const data = new FormData();
    const file = uploadedFiles[0];
    data.append('file', file.file, file.name);
    /* uploadedFiles.forEach( file => {
        data.append('file', file.file, file.name);
    }); */
     
    try {
      await api.post('/transactions/import', data);
      history.push('/');
    } catch (err) {
      console.log(err.response.error);
    }
  }, [uploadedFiles]);

  const submitFile = useCallback( (files: File[]): void => {    
    if (files.length === 0) return;
    
    const submitedfiles: FileProps[] = files.map( file => ({
        file,
        name: file.name,
        readableSize: file.size.toString()
    }));

    setUploadedFiles([...uploadedFiles, ...submitedfiles]);
  }, [setUploadedFiles, uploadedFiles]);

  return (
    <>
      <Header size="small" />
      <Container>
        <Title>Importar uma transação</Title>
        <ImportFileContainer>
          <Upload onUpload={submitFile} />
          {
            !!uploadedFiles.length && <FileList files={uploadedFiles} />
          }
          <Footer>
            <p>
              <img src={alert} alt="Alert" />
              Permitido apenas arquivos CSV
            </p>
            <button onClick={handleUpload} type="button">
              Enviar
            </button>
          </Footer>
        </ImportFileContainer>
      </Container>
    </>
  );
};

export default Import;
