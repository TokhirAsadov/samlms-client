import React from 'react';
import styled from "styled-components";

const ChatNavBar = () => {
  return (
    <Container>
      <div>left</div>
      <div>center</div>
      <div>right</div>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 18rem auto 20rem;
`;

export default ChatNavBar;