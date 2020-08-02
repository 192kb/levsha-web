import Dropzone from 'react-dropzone';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Resizer from 'react-image-file-resizer';
import ImageIcon from '@material-ui/icons/Image';
import { TaskImage, TaskApi } from '../model';
import { apiConfiguration, axiosRequestConfig } from '../App';

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
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'baseline',
    flexWrap: 'nowrap',
  },
  previewImage: {
    width: '33%',
    height: 'auto',
  },
}));

export const ImageDropzone: React.FC<ImageDropzoneProps> = (
  props: Readonly<ImageDropzoneProps>
) => {
  const classes = useStyles();
  const [files, setFiles] = React.useState<File[]>([]);
  const [isUploading, setIsUploading] = React.useState<boolean>(false);

  const handleFileUpload = (filesToUpload: File[]) => {
    setIsUploading(true);

    const taskApi = new TaskApi(apiConfiguration);

    var taskImages: TaskImage[] = [];
    Promise.all(
      filesToUpload.map(
        (file) =>
          new Promise((resolve, reject) => {
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
                      taskImages = [...taskImages, response.data];
                      resolve(response.data);
                    }
                  })
                  .catch(reject),
              'blob'
            );
          })
      )
    )
      .then((value) => console.log('promises fullfiled', value, taskImages))
      .catch((error) => console.error(error))
      .finally(() => {
        setIsUploading(false);
        props.onFinishedUpload();
      });
  };

  return (
    <Dropzone
      disabled={isUploading}
      accept={'image/jpeg'}
      onDrop={(acceptedFiles) => {
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
            .splice(-3, 3);
          setFiles(newFiles);
          handleFileUpload(newFiles);
        }
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
                    key={file.size}
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
