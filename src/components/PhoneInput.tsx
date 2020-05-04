import React from 'react';

import MaskedInput, { MaskedInputProps } from 'react-text-mask';

const PhoneInput: React.FC<
  MaskedInputProps & { inputRef: (ref: HTMLInputElement | null) => void }
> = ({ inputRef, ...others }) => {
  return (
    <MaskedInput
      {...others}
      ref={(ref: any) => {
        inputRef(ref ? ref.inputElement : null);
      }}
      mask={[
        '+',
        '7',
        ' ',
        /\d/,
        /\d/,
        /\d/,
        ' ',
        /\d/,
        /\d/,
        /\d/,
        '-',
        /\d/,
        /\d/,
        '-',
        /\d/,
        /\d/,
      ]}
    />
  );
};

export default PhoneInput;
