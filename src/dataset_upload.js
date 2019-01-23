import React from 'react';
import { relative } from 'path';
import Dropzone from 'react-dropzone';
import classNames from 'classnames';
import { CloudUpload, Check, ChevronRight } from '@material-ui/icons';
import { Grid, Button } from '@material-ui/core';
import { showNotification } from './utils';

export class DatasetUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileError: false,
      notification: null
    };
  }
  componentDidMount() {}

  render() {
    const props = {
      name: 'dataset',
      multiple: false,
      onDrop: files => {
        const file = files[0];
        if (file.type === 'text/csv') {
          this.props.handleFileUpload(file);
        } else {
          this.setState({
            notification: {
              message: 'The file you selected is not a valid dataset',
              busy: false
            },
            fileError: true
          });
        }

        return false;
      }
    };

    return (
      this.props.show && (
        <div className="datasetUploadWrapper">
          {this.state.notification &&
            showNotification(this.state.notification, () => {
              this.setState({ notification: null });
            })}
          <Dropzone {...props} style={{ marginBottom: '15px' }}>
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
                    border: 'dashed 1px #90D4FF'
                  }}
                >
                  <input {...getInputProps()} />
                  {this.props.uploadedFile ? (
                    <Check style={{ fontSize: '48px', color: '#54C21F' }} />
                  ) : (
                    <CloudUpload style={{ fontSize: '48px' }} />
                  )}
                  {isDragActive ? (
                    <p>Drop dataset here...</p>
                  ) : (
                    <p>
                      Click here to select a dataset file, or drag and drop it
                      over this text.
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
                ' ( ' +
                (this.props.uploadedFile.size / 1000000).toPrecision(2) +
                ' MB )'}
            </div>
          )}

          <Grid
            container
            spacing={24}
            style={{ marginTop: '30px', justifyItems: 'end' }}
          >
            <Grid item xs={12}>
              <Button
                id="nextButton"
                variant="contained"
                color="primary"
                onClick={e => this.props.next()}
                disabled={!this.props.uploadedFile}
              >
                Next
                <ChevronRight />
              </Button>
            </Grid>
          </Grid>
        </div>
      )
    );
  }
}
