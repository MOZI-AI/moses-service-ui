import React from 'react';
import { ChevronRight } from '@material-ui/icons';
import { Grid, Button } from '@material-ui/core';
import { showNotification } from './utils';
import FileUpload from './FileUpload';

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
    return (
      this.props.show && (
        <div className="datasetUploadWrapper">
          {this.state.notification &&
            showNotification(this.state.notification, () => {
              this.setState({ notification: null });
            })}

          <FileUpload
            handleFileUpload={this.props.handleFileUpload}
            inputName="dataset"
            uploadedFile={this.props.uploadedFile}
            acceptedFileExtensions=".csv, .xlsx, .xls"
            setValidationStatus={valid => {
              if (!valid) {
                this.setState({
                  notification: {
                    message: 'The file you selected is not a valid dataset',
                    busy: false
                  },
                  fileError: true
                });
              }
            }}
          />

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
