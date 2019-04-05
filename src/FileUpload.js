import React from 'react';
import { relative } from 'path';
import Dropzone from 'react-dropzone';
import classNames from 'classnames';
import { CloudUpload, Check } from '@material-ui/icons';
import fileSize from 'filesize';

export default class FileUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileError: false
    };
  }
  componentDidUpdate() {
    this.props.setValidationStatus(this.props.uploadedFile ? true : false);
  }

  render() {
    const props = {
      name: this.props.inputName,
      multiple: false,
      onDrop: files => {
        const file = files[0];
        this.props.handleFileUpload(this.props.inputName, file);
        return false;
      }
    };

    return (
      <div style={{ width: '100%' }}>
        <Dropzone
          {...props}
          style={{ marginBottom: '15px' }}
          accept={this.props.acceptedFileExtensions}
        >
          {({ getRootProps, getInputProps, isDragActive }) => {
            return (
              <div
                {...getRootProps()}
                className={classNames('dropzone', {
                  'dropzone--isActive': isDragActive
                })}
                style={{
                  textAlign: 'center',
                  padding: '30px',
                  border: 'dashed 1px #90D4FF',
                  backgroundColor: '#fff'
                }}
              >
                <input {...getInputProps()} />
                {this.props.uploadedFile ? (
                  <Check style={{ fontSize: '48px', color: '#54C21F' }} />
                ) : (
                  <CloudUpload style={{ fontSize: '48px' }} />
                )}
                {isDragActive ? (
                  <p>Drop file here...</p>
                ) : (
                  <p>
                    Click here to select a file, or drag and drop it over this
                    text.
                  </p>
                )}
              </div>
            );
          }}
        </Dropzone>
        {this.props.uploadedFile && (
          <div
            id="fileDetails"
            style={{
              borderRadius: 0,
              position: relative,
              bottom: '5px',
              border: 'solid 1px #90D4FF',
              borderTop: 'none',
              padding: '15px',
              backgroundColor: '#e1f4ff'
            }}
          >
            {this.props.uploadedFile.name +
              ' ' +
              fileSize(this.props.uploadedFile.size)}
          </div>
        )}
      </div>
    );
  }
}
