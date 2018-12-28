import React from 'react';
import { mount } from 'enzyme';
import { CrossValidationOptionsForm } from '../crossval_opts';
import renderer from 'react-test-renderer';

const crossValOptions = {
  folds: 0,
  testSize: 3,
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
    const wrapper = mount(
      <CrossValidationOptionsForm
        defaults={crossValOptions}
        changeInput={() => {}}
        show="true"
      />
    );
    wrapper
      .find('input[name="testSize"]')
      .simulate('change', { target: { value: 5 } });
    expect(
      wrapper.find('.has-error input[name="testSize"]').exists()
    ).toBeTruthy();
  });

  it('shows error when number of folds is less than one', () => {
    const wrapper = mount(
      <CrossValidationOptionsForm
        defaults={crossValOptions}
        changeInput={() => {}}
        show="true"
      />
    );
    wrapper
      .find('input[name="folds"]')
      .simulate('change', { target: { value: 0 } });
    expect(
      wrapper.find('.has-error input[name="folds"]').exists()
    ).toBeTruthy();
  });
});
