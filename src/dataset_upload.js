import React from "react";
import { Upload, Icon, Alert, Button, Divider, message } from "antd";

export class DatasetUpload extends React.Component {
  componentDidMount() {
  }

  render() {
    const props = {
      name: "dataset",
      multiple: false,
      beforeUpload: file => {
        console.log('file ', file);
        if (file.type === 'text/csv') {
          this.props.handleFileUpload(file);
        } else {
          message.error('File must be in .csv format.');
        }

        return false;
      }
    };

    return (
      this.props.show && <div className="datasetUploadWrapper">
        <Upload.Dragger {...props} fileList={[]}>
          <p className="ant-upload-drag-icon">
            <Icon type="upload" />
          </p>
          <p className="ant-upload-text">
            {!this.props.uploadedFile ? "Click or drag dataset file to this area to upload" : "You may upload another dataset file to replace the current one."}
          </p>
          <p className="ant-upload-hint">
            Please make sure the dataset file is in .csv format.
          </p>
        </Upload.Dragger>
        {this.props.uploadedFile && (
          <Alert className="fileDetails"
            style={{ borderRadius: 0, borderTop: "none" }}
            message={this.props.uploadedFile.name}
            type="info"
          />
        )}
        <Divider dashed />
        <Button
          type="primary"
          className="nextButton"
          disabled={!this.props.uploadedFile}
          onClick={e => this.props.next()}
        >
          Next <Icon type="right" />
        </Button>
      </div>
    );
  }
}
