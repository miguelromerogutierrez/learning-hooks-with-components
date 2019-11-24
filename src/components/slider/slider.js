import React from 'react';
import PropTypes from 'prop-types';
import './slider.css';

const SlideContext = React.createContext({});

function CardsSlider({ className = '', ...props }) {
  const [move, setMove] = React.useState(0);

  const forward = () => {
    const slides = document.querySelectorAll('.cards-slider__slide');
    const nextMove = move + 1;
    setMove(nextMove >= slides.length ? move : nextMove);
  };
  
  const backward = () => {
    const prevMove = move - 1;
    setMove(prevMove < 0 ? move : prevMove);
  };

  const goToFirst = () => {
    setMove(0);
  };

  const goToLast = () => {
    const slides = document.querySelectorAll('.cards-slider__slide');
    setMove(slides.length - 1);
  }

  const contextValue = {
    forward,
    backward,
    move,
    goToFirst,
    goToLast
  };
  return (
    <SlideContext.Provider value={contextValue}>
      <div
        className={`${className} cards-slider__container`}
        {...props}
      />
    </SlideContext.Provider>
  );
}

function useSlide() {
  const context = React.useContext(SlideContext);
  return context;
}

function SliderWindow({className = '', ...props}) {
  const { move } = useSlide();
  const [translate , setTranslate] = React.useState(0);
  React.useEffect(() => {
    const slides = document.querySelectorAll('.cards-slider__slide');
    const widthSlide = slides[0].offsetWidth || 300;
    setTranslate(move * widthSlide * (-1));
  }, [move]);
  
  return (
    <div
      className={`${className} cards-slider__window`}
      style={{ transform: `translateX(${translate}px)` }}
      {...props}
    />
  );
}

function Slide({className, ...props}) {
  return <div className={`${className} cards-slider__slide`} {...props} />
}

function Button({
  className,
  next = false,
  prev = false,
  first = false,
  last = false,
  ...props
}) {
  const { forward, backward, goToFirst, goToLast } = useSlide();
  const handleClick = next ? forward : prev ? backward : first ? goToFirst : last ? goToLast : null;
  return <button onClick={handleClick} {...props} />
}

CardsSlider.Window = SliderWindow;
CardsSlider.Button = Button;
CardsSlider.Slide = Slide;

CardsSlider.defaultProps = {};
SliderWindow.propTypes = {};
Slide.propTypes = {};
Button.propTypes = {
  next: PropTypes.bool,
  prev: PropTypes.bool,
  first: PropTypes.bool,
  last: PropTypes.bool
};
CardsSlider.propTypes = {};

export default CardsSlider;
