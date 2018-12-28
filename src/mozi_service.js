import React from 'react';
import { MosesService } from './proto/moses_service_pb_service';
import { grpc } from 'grpc-web-client';
import { SERVER_ADDRESS } from './utils';
import { MoziServiceForm } from './mozi_service_form';
import { MoziServiceResult } from './mozi_service_result';
import { message } from 'antd';

export class MoziService extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      resultLink: undefined,
      busy: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(analysisParameters) {
    this.setState({ busy: true });
    const hideLoader = message.loading('Attempting to start analysis ...', 0);
    const request = grpc.unary(MosesService.StartAnalysis, {
      request: analysisParameters,
      host: SERVER_ADDRESS,
      onEnd: res => {
        hideLoader();
        if (res.status === grpc.Code.OK) {
          message.success('Analysis has started!');
          this.setState(state => ({
            resultLink: res.message.array[0],
            busy: false
          }));
        } else {
          this.setState({ busy: false });
          message.error('Analysis could not be started.');
        }
      }
    });
  }

  render() {
    return (
      <React.Fragment>
        {this.state.resultLink ? (
          <MoziServiceResult resultLink={this.state.resultLink} />
        ) : (
          <MoziServiceForm
            busy={this.state.busy}
            handleSubmit={this.handleSubmit}
          />
        )}
      </React.Fragment>
    );
  }
}

export default MoziService;
