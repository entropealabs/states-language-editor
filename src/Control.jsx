import React from 'react';
import Rete from 'rete';

export class MyControl extends Rete.Control {
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

  constructor(emitter, key, node, readonly = false) {
    super(key);
    this.emitter = emitter;
    this.key = key;
    this.component = MyControl.component;

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
