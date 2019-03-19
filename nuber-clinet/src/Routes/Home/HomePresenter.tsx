import React from "react";
import Helmet from "react-helmet";
import Sidebar from "react-sidebar";
import Menu from "../../Components/Menu";
import styled from '../../typed-components';



const Container = styled.div``;

interface IProps {
  isMenuOpen: boolean;
  toggleMenu: () => void;
}


const HomePresenter: React.SFC<IProps> = ({isMenuOpen, toggleMenu}) =>(
  <Container>
    <Helmet>
      <title>Home | Number</title>
    </Helmet>
    <Sidebar
      sidebar={<Menu />}
      open={isMenuOpen}
      onSetOpen={toggleMenu}
      styles={{ sidebar: {background:"white"} }}
    >
      <button onClick={toggleMenu}>Open sidebar</button>
    </Sidebar>
  </Container>
)

export default HomePresenter;