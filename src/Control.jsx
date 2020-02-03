import React from 'react';
import Rete from 'rete';

class TextControl extends Rete.Control {
  static component = ({ value, onChange, placeholder }) => (
    <input
      value={value}
      placeholder={placeholder}
      ref={ref => {
        ref && ref.addEventListener('pointerdown', e => e.stopPropagation());
      }}
      onChange={e => onChange(e.target.value)}
    />
  );

  constructor(emitter, key, node, default_value = '', readonly = false) {
    super(key);
    this.emitter = emitter;
    this.key = key;
    this.component = TextControl.component;

    const initial = node.data[key] || default_value;

    node.data[key] = initial;
    this.props = {
      readonly,
      value: initial,
      onChange: v => {
        this.setValue(v);
        this.emitter.trigger('process');
      },
      placeholder: key,
    };
  }

  setValue(val) {
    this.props.value = val;
    this.putData(this.key, val);
    this.update();
  }
}

class IntegerControl extends Rete.Control {
  static component = ({ value, onChange, placeholder }) => (
    <input
      type="number"
      value={value}
      placeholder={placeholder}
      ref={ref => {
        ref && ref.addEventListener('pointerdown', e => e.stopPropagation());
      }}
      onChange={e => onChange(e.target.value)}
    />
  );

  constructor(emitter, key, node, readonly = false) {
    super(key);
    this.emitter = emitter;
    this.key = key;
    this.component = IntegerControl.component;

    const initial = node.data[key] || '';

    node.data[key] = initial;
    this.props = {
      readonly,
      value: initial,
      onChange: v => {
        this.setValue(v);
        this.emitter.trigger('process');
      },
      placeholder: key
    };
  }

  setValue(val) {
    this.props.value = val;
    this.putData(this.key, val);
    this.update();
  }
}

class BooleanControl extends Rete.Control {
  static component = ({ value, onChange, placeholder }) => (
    <label><input
      type="checkbox"
      value={placeholder}
      checked={value}
      ref={ref => {
        ref && ref.addEventListener('pointerdown', e => e.stopPropagation());
      }}
      onChange={e => onChange(e.target.checked)}
    />{placeholder}</label>
  );

  constructor(emitter, key, node, readonly = false) {
    super(key);
    this.emitter = emitter;
    this.key = key;
    this.component = BooleanControl.component;

    const initial = node.data[key] || false;

    node.data[key] = initial;
    this.props = {
      readonly,
      value: initial,
      onChange: v => {
        this.setValue(v);
        this.emitter.trigger('process');
      },
      placeholder: key
    };
  }

  setValue(val) {
    this.props.value = val;
    this.putData(this.key, val);
    this.update();
  }
}

export { TextControl, BooleanControl, IntegerControl }

