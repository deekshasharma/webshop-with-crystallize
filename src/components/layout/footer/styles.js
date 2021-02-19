import styled from 'styled-components';

export const Outer = styled.footer`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  max-width: 1600px;
  margin: 50px auto;
  border-top: 2px solid var(--color-box-background);
  padding: 20px 20px;
  justify-content: space-between;
`;

export const Logo = styled.div`
  width: 70px;
`;

export const NavList = styled.footer`
  list-style: none;
  font-weight: 500;
  font-size: 1rem;
  display: block;
  margin: 0 0 0 auto;

  li {
    line-height: 1.5rem;
  }
  h5 {
    font-size: 0.7rem;
    font-weight: 400;
    margin-bottom: 10px;
  }
`;

export const Social = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start; 
  margin: 0 0 0 auto;
`
