import React, { useState } from 'react';
import Dropdown from './components/dropdown/dropdown';
import Slider from './components/slider/slider';

import './App.css';

const options = [
  { value: 1000, text: 'Option 1' },
  { value: 1001, text: 'Option 2' },
  { value: 1002, text: 'Option 3' },
  { value: 1003, text: 'Option 4' },
  { value: 1004, text: 'Option 5' },
  { value: 1005, text: 'Option 6' },
];

const covers = [
  { url: 'https://picsum.photos/id/900/1200/500', alt: 'random1' },
  { url: 'https://picsum.photos/id/400/1200/500', alt: 'random2' },
  { url: 'https://picsum.photos/id/990/1200/500', alt: 'random3' },
  { url: 'https://picsum.photos/id/891/1200/500', alt: 'random4' },
  { url: 'https://picsum.photos/id/892/1200/500', alt: 'random5' },
  { url: 'https://picsum.photos/id/893/1200/500', alt: 'random6' },
  { url: 'https://picsum.photos/id/894/1200/500', alt: 'random7' },
  { url: 'https://picsum.photos/id/885/1200/500', alt: 'random8' },
  { url: 'https://picsum.photos/id/886/1200/500', alt: 'random10' }
];

function App() {
  const [selected, setselected] = useState(1000)
  const handleChangeDropdown = (event, value) => setselected(value);

  const labelDropdown = (selected, show) => <span>{selected} {show ? <i class="fas fa-chevron-up" /> : <i class="fas fa-chevron-down" />}</span>
  return (
    <div className="App">
      <div>
        <div className="covers">
          <Slider className="covers-slider">
            <Slider.Window className="covers-window">
              {covers.map(cover => <Slider.Slide className="cover-image">
                  <div style={{backgroundImage: `url(${cover.url})`}}/>
                </Slider.Slide>)}
            </Slider.Window>
            <div>
              <Slider.Button first>First</Slider.Button>
              <Slider.Button prev>Prev</Slider.Button>
              <Slider.Button next>Next</Slider.Button>
              <Slider.Button last>Last</Slider.Button>
            </div>
          </Slider>
        </div>
        <div className="form-field">
          <label>Dropdown</label>
          <Dropdown value={selected} onChange={handleChangeDropdown} label={labelDropdown}>
            {options.map(({value, text}) => <Dropdown.Option value={value}>{text}</Dropdown.Option>)}
          </Dropdown>
        </div>
      </div>
    </div>
  );
}

export default App;
