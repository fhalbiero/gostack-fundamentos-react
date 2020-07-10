import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import filesize from 'filesize';

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

interface File {
  name: string;
  path: string;
  size: number;
  lastModified: Date;
  lastModifiedDate: Date;
  type: string;
  webkitRelativePath: string;
}

const Import: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileProps[]>([]);
  const history = useHistory();

  async function handleUpload(): Promise<void> {
    if (!uploadedFiles.length) return;
  
    const files:File[] = uploadedFiles.map( uploadFile => uploadFile.file );

    const data = new FormData();
    data.append('file', JSON.stringify(files));    

    try {
      await api.post('/transactions/import', data);
      history.push('/');
    } catch (err) {
      console.log(err.response.error);
    }
  }

  function submitFile(files: File[]): void {
    
    if (files.length === 0) return;
    
    const filesProps: FileProps[] = files.map( file => ({
        file,
        name: file.name,
        readableSize: file.size.toString()
    }));

    setUploadedFiles({...uploadedFiles, ...filesProps});
  }

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
