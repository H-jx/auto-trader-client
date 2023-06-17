import React, { useRef } from 'react';

interface InputTriggerProps {
  children: React.ReactNode;
  onChange: (file: File | null) => void;
}

const UploadTrigger: React.FC<InputTriggerProps> = ({ children, onChange }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleInputChange = () => {
    if (inputRef.current?.files?.length) {
      const file = inputRef.current.files[0];
      onChange(file);
    } else {
      onChange(null);
    }
  };

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <>
      {React.cloneElement(children as React.ReactElement<any>, { onClick: handleClick })}
      <input
        ref={inputRef}
        type="file"
        style={{ display: 'none' }}
        onChange={handleInputChange}
      />
    </>
  );
};

export default UploadTrigger;