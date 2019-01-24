import React from 'react';
import { MosesOptionsForm } from './moses_opts';
import { CrossValidationOptionsForm } from './crossval_opts';
import { DatasetUpload } from './dataset_upload';
import { stringifyMosesOptions } from './utils';
import { TargetFeatureForm } from './target_feature';
import {
  AnalysisParameters,
  CrossValOptions,
  Filter
} from './proto/moses_service_pb';
import { Stepper, Step, StepLabel, Divider } from '@material-ui/core';

const Options = {
  DATASET: 0,
  MOSES_OPTIONS: 1,
  CROSS_VALIDATION_OPTIONS: 2,
  TARGET_FEATURE: 3
};

export class MoziServiceForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mosesOpts: {
        maximumEvals: 1000,
        featureSelectionTargetSize: 4,
        reductKnobBuildingEffort: '0',
        resultCount: 100,
        numberOfThreads: 8,
        featureSelectionAlgorithm: 'simple',
        enableFeatureSelection: true,
        hcWidenSearch: true,
        balance: true,
        hcCrossoverMinNeighbors: 5000,
        hcCrossoverPopSize: 1000,
        complexityRatio: 3
      },
      additionalParameters: [],
      crossValOptions: {
        folds: 1,
        testSize: 0.3,
        randomSeed: 5
      },
      dataset: undefined,
      targetFeature: 'case',
      filter: { name: '', value: '' },
      datasetFile: undefined,
      currentStep: Options.DATASET
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleAdditionalParametersAdded = this.handleAdditionalParametersAdded.bind(
      this
    );
    this.handleAdditionalParametersRemoved = this.handleAdditionalParametersRemoved.bind(
      this
    );
    this.handleFileUpload = this.handleFileUpload.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.changeStep = this.changeStep.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
  }

  changeStep(step) {
    this.setState({ currentStep: step });
  }

  handleFileUpload(file) {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      let encoded = fileReader.result.replace(/^data:(.*;base64,)?/, '');
      encoded.length % 4 > 0 &&
        (encoded += '='.repeat(4 - (encoded.length % 4)));
      this.setState({ dataset: encoded, datasetFile: file });
    };
  }

  handleInputChange(option, event) {
    const target = event.target;
    const update = { [target.name]: this.parseValue(target) };
    this.setState(state => {
      switch (option) {
        case Options.MOSES_OPTIONS:
          return { mosesOpts: Object.assign({}, state.mosesOpts, update) };
        case Options.CROSS_VALIDATION_OPTIONS:
          return {
            crossValOptions: Object.assign({}, state.crossValOptions, update)
          };
        case Options.TARGET_FEATURE:
          return { targetFeature: update[target.name] };
        default:
          break;
      }
    });
    event.preventDefault();
  }

  handleFilterChange(update) {
    this.setState(state => ({
      filter: Object.assign({}, state.filter, update)
    }));
  }

  handleAdditionalParametersAdded(name, value) {
    const param = Object.assign({}, this.state.additionalParameters, {
      [name]: value
    });
    this.setState({ additionalParameters: param });
  }

  handleAdditionalParametersRemoved(name) {
    const additionalParameters = Object.assign(
      {},
      this.state.additionalParameters
    );
    delete additionalParameters[name];
    this.setState({ additionalParameters: additionalParameters });
  }

  parseValue(target) {
    if (target.value === '') return '';
    let parsedValue =
      target.type === 'checkbox'
        ? !!+target.checked
        : isNaN(target.value)
        ? target.value
        : +target.value;
    return parsedValue;
  }

  handleSubmit() {
    // if a request is being processed, do nothing and wait for it to finish
    if (this.props.busy) {
      return;
    }
    const crossValOptions = new CrossValOptions();
    crossValOptions.setFolds(this.state.crossValOptions.folds);
    crossValOptions.setRandomseed(this.state.crossValOptions.randomSeed);
    crossValOptions.setTestsize(this.state.crossValOptions.testSize);

    const analysisParameters = new AnalysisParameters();
    analysisParameters.setMosesopts(
      stringifyMosesOptions(
        this.state.mosesOpts,
        this.state.additionalParameters
      )
    );

    const filter = new Filter();
    filter.setScore(this.state.filter.name);
    filter.setValue(this.state.filter.name ? this.state.filter.value : -1);

    analysisParameters.setDataset(this.state.dataset);
    analysisParameters.setTargetFeature(this.state.targetFeature);
    analysisParameters.setCrossvalopts(crossValOptions);
    analysisParameters.setFilter(filter);

    this.props.handleSubmit(analysisParameters);
  }

  render() {
    return (
      <React.Fragment>
        <Stepper activeStep={this.state.currentStep} style={{ color: 'red' }}>
          <Step key={1}>
            <StepLabel>Select dataset</StepLabel>
          </Step>
          <Step key={1}>
            <StepLabel>Moses Options</StepLabel>
          </Step>
          <Step key={1}>
            <StepLabel>Cross Validation Options</StepLabel>
          </Step>
          <Step key={1}>
            <StepLabel>Target feature</StepLabel>
          </Step>
        </Stepper>

        {this.props.error && (
          <div
            style={{
              padding: '15px',
              border: 'solid 1px #FFA19D',
              backgroundColor: '#FFF0EF',
              borderRadius: '5px'
            }}
          >
            <p>{this.props.error}</p>
          </div>
        )}
        <Divider style={{ marginBottom: '30px' }} />
        <DatasetUpload
          show={this.state.currentStep === Options.DATASET}
          uploadedFile={this.state.datasetFile}
          handleFileUpload={this.handleFileUpload}
          next={() => this.changeStep(Options.MOSES_OPTIONS)}
        />
        <MosesOptionsForm
          show={this.state.currentStep === Options.MOSES_OPTIONS}
          defaults={this.state.mosesOpts}
          additionalParameters={this.state.additionalParameters}
          changeInput={event =>
            this.handleInputChange(Options.MOSES_OPTIONS, event)
          }
          addAdditionalParameter={this.handleAdditionalParametersAdded}
          removeAdditionalParameter={this.handleAdditionalParametersRemoved}
          back={() => this.changeStep(Options.DATASET)}
          next={() => this.changeStep(Options.CROSS_VALIDATION_OPTIONS)}
        />
        <CrossValidationOptionsForm
          show={this.state.currentStep === Options.CROSS_VALIDATION_OPTIONS}
          defaults={this.state.crossValOptions}
          changeInput={event =>
            this.handleInputChange(Options.CROSS_VALIDATION_OPTIONS, event)
          }
          back={() => this.changeStep(Options.MOSES_OPTIONS)}
          next={() => this.changeStep(Options.TARGET_FEATURE)}
        />
        <TargetFeatureForm
          show={this.state.currentStep === Options.TARGET_FEATURE}
          defaults={{
            targetFeature: this.state.targetFeature,
            filter: this.state.filter
          }}
          changeInput={event =>
            this.handleInputChange(Options.TARGET_FEATURE, event)
          }
          back={() => this.changeStep(Options.CROSS_VALIDATION_OPTIONS)}
          submit={this.handleSubmit}
          handleFilterChange={this.handleFilterChange}
        />
      </React.Fragment>
    );
  }
}
