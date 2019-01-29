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
import { Grid, Button, Divider } from '@material-ui/core';
import { Check } from '@material-ui/icons';

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
      currentStep: Options.DATASET,
      isValid: {
        dataset: true,
        mosesOptions: true,
        crossValOptions: true,
        targetFeatureAndFilters: true
      }
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
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.isValid = this.isValid.bind(this);
    this.setValidationStatus = this.setValidationStatus.bind(this);
  }

  isValid() {
    return Object.values(this.state.isValid).reduce(
      (acc, val) => val && acc,
      true
    );
  }

  setValidationStatus(key, valid) {
    if (this.state.isValid[key] !== valid) {
      this.setState(state => {
        const isValid = Object.assign({}, state.isValid);
        isValid[key] = valid;

        return { isValid: isValid };
      });
    }
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
    filter.setScore(this.state.filter.name || 'null');
    filter.setValue(this.state.filter.name ? this.state.filter.value : '0');

    analysisParameters.setDataset(this.state.dataset);
    analysisParameters.setTargetFeature(this.state.targetFeature);
    analysisParameters.setCrossvalopts(crossValOptions);
    analysisParameters.setFilter(filter);

    this.props.handleSubmit(analysisParameters);
  }

  render() {
    return (
      <div style={{ overflowX: 'hidden' }}>
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
        <h3
          style={{
            color: this.state.isValid.dataset ? 'black' : 'red'
          }}
        >
          Upload dataset
        </h3>
        <DatasetUpload
          uploadedFile={this.state.datasetFile}
          handleFileUpload={this.handleFileUpload}
          setValidationStatus={valid =>
            this.setValidationStatus('dataset', valid)
          }
        />
        <h3
          style={{
            color: this.state.isValid.mosesOptions ? 'black' : 'red'
          }}
        >
          Moses options
        </h3>
        <MosesOptionsForm
          defaults={this.state.mosesOpts}
          additionalParameters={this.state.additionalParameters}
          changeInput={event =>
            this.handleInputChange(Options.MOSES_OPTIONS, event)
          }
          addAdditionalParameter={this.handleAdditionalParametersAdded}
          removeAdditionalParameter={this.handleAdditionalParametersRemoved}
          setValidationStatus={valid =>
            this.setValidationStatus('mosesOptions', valid)
          }
        />
        <h3
          style={{
            color: this.state.isValid.crossValOptions ? 'black' : 'red'
          }}
        >
          {' '}
          Cross validation options{' '}
        </h3>
        <CrossValidationOptionsForm
          defaults={this.state.crossValOptions}
          changeInput={event =>
            this.handleInputChange(Options.CROSS_VALIDATION_OPTIONS, event)
          }
          setValidationStatus={valid =>
            this.setValidationStatus('crossValOptions', valid)
          }
        />
        <h3
          style={{
            color: this.state.isValid.targetFeatureAndFilters ? 'black' : 'red'
          }}
        >
          Target feature & filters
        </h3>

        <TargetFeatureForm
          defaults={{
            targetFeature: this.state.targetFeature,
            filter: this.state.filter
          }}
          changeInput={event =>
            this.handleInputChange(Options.TARGET_FEATURE, event)
          }
          handleFilterChange={this.handleFilterChange}
          setValidationStatus={valid =>
            this.setValidationStatus('targetFeatureAndFilters', valid)
          }
        />
        <Divider style={{ margin: '15px 0' }} />

        <Grid container>
          <Grid item xs={12} style={{ textAlign: 'end' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => this.handleSubmit()}
              disabled={this.props.busy || !this.isValid()}
              style={{ marginLeft: '5px' }}
            >
              Submit
              <Check />
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  }
}
