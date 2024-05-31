import { css } from "styled-components";


export const xxlarge = (props) => {
    return css`
    @media only screen and  (min-width: 1400px)  {
      ${props};
    }
  `;
};
export const xlarge = (props) => {
    return css`
    @media only screen and  (min-width: 1200px) and  (max-width: 1400px)  {
      ${props};
    }
  `;
};
export const    large = (props) => {
    return css`
    @media only screen and  (min-width: 992px) and  (max-width: 1200px)  {
      ${props};
    }
  `;
};

export const medium = (props) => {
    return css`
    @media only screen and  (min-width: 768px) and  (max-width: 992px)  {
      ${props};
    }
  `;
};

export const small = (props) => {
    return css`
    @media only screen and  (min-width: 576px) and  (max-width: 768px)  {
      ${props};
    }
  `;
};
export const extrasmall = (props) => {
    return css`
    @media only screen and  (max-width: 576px)   {
      ${props};
    }
  `;
};

