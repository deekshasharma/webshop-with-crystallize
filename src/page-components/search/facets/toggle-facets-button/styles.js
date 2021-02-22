import styled from 'styled-components';

export const Text = styled.span`
  white-space: nowrap;
`;

export const Button = styled.button`
  align-items: center;
  appearance: none;
  background: var(--color-background);
  border: none;
  color: var(--color-text-main);
  cursor: pointer;
  display: inline-flex;
  font-family: var(--font-family-main);
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.5px;
  padding: 0.75rem 1rem;
  position: relative;
  text-align: center;
  text-decoration: none;

  &:hover {
    border: 0.4px solid gray;
    color: var(--font-family-main);
    border-radius: 30px;
  }

  ${Text} {
    margin-right: 0.5rem;
  }
`;
