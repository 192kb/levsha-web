import { grey } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import React from 'react';
import Dropzone from 'react-dropzone';
import Resizer from 'react-image-file-resizer';

import { apiConfiguration, axiosRequestConfig } from '../App';
import { TaskApi, TaskImage } from '../model';

const maximumImagesAllowed = 3;

type ImageDropzoneProps = {
  onFileArrayChange: (takImages: TaskImage[]) => void;
  onStartUpload: () => void;
  onFinishedUpload: () => void;
};

const useStyles = makeStyles((theme) => ({
  dropzoneSection: {
    width: '100%',
    minWidth: 0,
    padding: 0,
    textAlign: 'center',
  },
  addIcon: {
    padding: 10,
    background: grey[400],
    borderRadius: '50%',
  },
  preview: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'baseline',
    flexWrap: 'nowrap',
    margin: 0,
  },
  previewImage: {
    width: '33%',
    height: 'auto',
    margin: theme.spacing(3),
  },
}));

export const ImageDropzone: React.FC<ImageDropzoneProps> = (
  props: Readonly<ImageDropzoneProps>
) => {
  const classes = useStyles();
  const [files, setFiles] = React.useState<File[]>([]);
  const [isUploading, setIsUploading] = React.useState<boolean>(false);

  const handleFileUpload = React.useCallback(
    (filesToUpload: File[]) => {
      setIsUploading(true);

      const taskApi = new TaskApi(apiConfiguration);
      Promise.all(
        filesToUpload.map(
          (file) =>
            new Promise<TaskImage>((resolve, reject) => {
              Resizer.imageFileResizer(
                file,
                500,
                500,
                'JPEG',
                80,
                0,
                (blob) =>
                  taskApi
                    .uploadTaskImage(blob, axiosRequestConfig)
                    .then((response) => {
                      if (response.status === 200 && response.data) {
                        resolve(response.data);
                      }
                    })
                    .catch(reject),
                'blob'
              );
            })
        )
      )
        .then((taskImages) => props.onFileArrayChange(taskImages))
        .catch((error) => console.warn(error))
        .finally(() => {
          setIsUploading(false);
          props.onFinishedUpload();
        });
    },
    [props]
  );

  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles) {
        let uniqueFiles: number[] = [];
        const newFiles = [...files, ...acceptedFiles]
          .filter((file) => {
            if (uniqueFiles.includes(file.size)) {
              return false;
            }

            uniqueFiles = [...uniqueFiles, file.size];
            return true;
          })
          .splice(-maximumImagesAllowed, maximumImagesAllowed);
        setFiles(newFiles);
        handleFileUpload(newFiles);
      }
    },
    [files, handleFileUpload]
  );

  return (
    <Dropzone
      disabled={isUploading}
      accept={{
        'image/*': ['.png', '.gif', '.jpeg', '.jpg'],
      }}
      onDrop={onDrop}
    >
      {({ getRootProps, getInputProps }) => (
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          {files ? (
            <p className={classes.preview}>
              {files.map((file) => (
                <img
                  key={file.size}
                  className={classes.previewImage}
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                />
              ))}
            </p>
          ) : null}
          <span>
            <AddIcon className={classes.addIcon} /> <br />
            Добавить фото
          </span>
        </div>
      )}
    </Dropzone>
  );
};
