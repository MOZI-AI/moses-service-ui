import React from 'react';
import { shallow } from 'enzyme';
import { CrossValidationOptionsForm } from '../crossval_opts';
import renderer from 'react-test-renderer';

const crossValOptions = {
  folds: 1,
  testSize: 0.3,
  randomSeed: 5
};

describe('<CrossValidationOptionsForm />', () => {
  it('rendered correctly', () => {
    const tree = renderer
      .create(
        <CrossValidationOptionsForm defaults={crossValOptions} show="true" />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('shows error when test size is not between zero and one', () => {
    const wrapper = shallow(
      <CrossValidationOptionsForm
        defaults={crossValOptions}
        changeInput={() => {}}
        show="true"
      />
    );
    expect(
      wrapper
        .update()
        .find('TextField[name="testSize"]')
        .prop('error')
    ).toBeFalsy();
    wrapper.setProps({
      defaults: Object.assign({}, crossValOptions, { testSize: 2 })
    });
    expect(
      wrapper
        .update()
        .find('TextField[name="testSize"]')
        .prop('error')
    ).toBeTruthy();
  });

  it('shows error when number of folds is less than one', () => {
    const wrapper = shallow(
      <CrossValidationOptionsForm
        defaults={crossValOptions}
        changeInput={() => {}}
        show="true"
      />
    );
    expect(
      wrapper
        .update()
        .find('TextField[name="folds"]')
        .prop('error')
    ).toBeFalsy();
    wrapper.setProps({
      defaults: Object.assign({}, crossValOptions, { folds: 0 })
    });
    expect(
      wrapper
        .update()
        .find('TextField[name="folds"]')
        .prop('error')
    ).toBeTruthy();
  });
});
