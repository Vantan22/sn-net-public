import React from 'react'

const InputComponents = (props) => {
    const { children, handleChange, customStyle, type, id,placeholder,classP,Textchildren,register,name,value } = props;
    return (
      <label htmlFor="">
      <p className={classP}>{children}</p>
        <input className={customStyle} type={type} id={id} placeholder={placeholder} name={name} onInput={handleChange} value={value} {...register}  >{Textchildren}
        </input>
    </label>
    );
    
}

export default InputComponents
