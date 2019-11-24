import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import './dropdown.scss';

function Dropdown({ children, value, onChange, label }) {
  const [selected, setSelected] = useState(null);
  const [show, setShow] = useState(false);
  const labelRef = useRef(null);
  const values = {};

  const classnameOptions = `dropdown--options ${show ? 'show' : ''}`;

  useEffect(() => {
    const hideOption = (event) => {
      const ignore = labelRef.current.contains(event.target);
      if (show || ignore) return;
      setShow(false);
    }
    document.addEventListener('click', hideOption);
    return () => document.removeEventListener('click', hideOption);
  }, []);

  const handleClickLabel = (event) => {
    event.stopPropagation();
    setShow(!show)
  };
  const change = (event) => {
    onChange(event, event.target.value);
  }

  useEffect(() => {
    setSelected(values[value]);
  }, [value]);

  return (
    <div className="dropdown--container">
      <button className="dropdown--label" ref={labelRef} onClick={handleClickLabel}>{label ? label(selected, show) : selected}</button>
      <div className={classnameOptions}>{
        React.Children.map(children, child => {
          values[child.props.value] = child.props.children;
          return React.cloneElement(child, {
            children: child.props.children,
            value: child.props.value,
            onClick: change,
            active: value === child.props.value
          });
        })
      }</div>
    </div>
  );
}

function Option({ children, value, onClick, active }) {
  const classname = `dropdown--option ${active ? 'active': ''}`;
  return (
    <button onClick={onClick} value={value} className={classname}>
      {children}
    </button>
  )
}

Option.propTypes = {
  value: PropTypes.any,
  onClick: PropTypes.func,
  active: PropTypes.bool
}

Dropdown.Option = Option;
Dropdown.defaultProps = {
  label: null
};

Dropdown.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func,
  label: PropTypes.func,
};

export default Dropdown;
