import Dropzone from 'react-dropzone';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import ImageIcon from '@material-ui/icons/Image';
import { TaskImage, TaskApi } from '../model';
import { apiConfiguration } from '../App';

type ImageDropzoneProps = {
  onFileArrayChange: (uuids: TaskImage[]) => void;
  onStartUpload: () => void;
  onFinishedUpload: () => void;
};

const useStyles = makeStyles((theme) => ({
  dropzoneSection: {
    padding: theme.spacing(5),
    border: '2px dashed #ccc',
  },
  imageIcon: {
    verticalAlign: 'text-bottom',
  },
  preview: {
    display: 'flow',
  },
  previewImage: {},
}));

export const ImageDropzone: React.FC<ImageDropzoneProps> = (
  props: Readonly<ImageDropzoneProps>
) => {
  const classes = useStyles();
  const [files, setFiles] = React.useState<File[]>([]);
  const [isUploading, setIsUploading] = React.useState<boolean>(false);

  const handleFileUpload = () => {
    setIsUploading(true);

    const taskApi = new TaskApi(apiConfiguration);
    Promise.all(
      files.map(
        (file) => new Promise((resolve, reject) => taskApi.uploadNewTaskImage())
      )
    ).finally(() => {
      setIsUploading(false);
      props.onFinishedUpload();
    });
  };

  return (
    <Dropzone
      disabled={isUploading}
      accept={['image/jpg', 'image/png']}
      onDrop={(acceptedFiles) => {
        setFiles(acceptedFiles);
        handleFileUpload();
      }}
    >
      {({ getRootProps, getInputProps }) => (
        <section className={classes.dropzoneSection}>
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            {files ? (
              <p className={classes.preview}>
                {files.map((file) => (
                  <img
                    className={classes.previewImage}
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                  />
                ))}
              </p>
            ) : null}
            <p>
              <ImageIcon className={classes.imageIcon} /> Добавить фото
            </p>
          </div>
        </section>
      )}
    </Dropzone>
  );
};
