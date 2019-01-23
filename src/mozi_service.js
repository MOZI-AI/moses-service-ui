import React from 'react';
import { MosesService } from './proto/moses_service_pb_service';
import { grpc } from 'grpc-web-client';
import { SERVER_ADDRESS, showNotification } from './utils';
import { MoziServiceForm } from './mozi_service_form';
import { MoziServiceResult } from './mozi_service_result';

export class MoziService extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      resultLink: 'http://bing.com?id=ad123d',
      busy: false,
      error: null,
      notification: null
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(analysisParameters) {
    this.setState({
      busy: true,
      notification: { message: 'Attempting to start analysis ...', busy: true }
    });

    grpc.unary(MosesService.StartAnalysis, {
      request: analysisParameters,
      host: SERVER_ADDRESS,
      onEnd: res => {
        if (res.status === grpc.Code.OK) {
          this.setState(state => ({
            resultLink: res.message.array[0],
            busy: false,
            error: null,
            notification: { message: 'Analysis has started', busy: false }
          }));
        } else {
          this.setState({
            busy: false,
            error: res.statusMessage,
            notification: { message: res.statusMessage, busy: false }
          });

          console.log(res);
        }
      }
    });
  }

  render() {
    return (
      <React.Fragment>
        {this.state.notification &&
          showNotification(this.state.notification, () => {
            this.setState({ notification: null });
          })}
        {this.state.resultLink ? (
          <MoziServiceResult resultLink={this.state.resultLink} />
        ) : (
          <MoziServiceForm
            busy={this.state.busy}
            handleSubmit={this.handleSubmit}
            error={this.state.error}
          />
        )}
      </React.Fragment>
    );
  }
}

export default MoziService;
