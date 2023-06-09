import React, { Component } from 'react';
import { Collapse, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink, UncontrolledButtonDropdown, DropdownToggle, DropdownItem, DropdownMenu   } from 'reactstrap';
import { Link } from 'react-router-dom';
import './NavMenu.css';

export class NavMenu extends Component {
  static displayName = NavMenu.name;

  constructor (props) {
    super(props);

    this.toggleNavbar = this.toggleNavbar.bind(this);
      this.state = {
          dropdownOpen: false,
      collapsed: true
    };
  }

  toggleNavbar () {
    this.setState({
      collapsed: !this.state.collapsed
    });
    }

    dropdownOpen() {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }

  render() {    

      return (
      <header>
        <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3" container light>
          <NavbarBrand tag={Link} to="/">Olima v3 - Поставки</NavbarBrand>
          <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
          <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!this.state.collapsed} navbar>
            <ul className="navbar-nav flex-grow">
              <NavItem>
                <NavLink tag={Link} className="text-dark" to="/">Стартовая</NavLink>
              </NavItem> 
              <NavItem>
                <NavLink tag={Link} className="text-dark" to="/product">Товары</NavLink>
                          </NavItem>
                <NavItem>
                    <NavLink tag={Link} className="text-dark" to="/order">Заказы</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink tag={Link} className="text-dark" to="/supply">Поставки</NavLink>
                </NavItem>
                <UncontrolledButtonDropdown>
                    <DropdownToggle nav caret>
                        Справочники
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem><NavLink tag={Link} className="text-dark" to="/producttype">Тип товара</NavLink></DropdownItem>
                        <DropdownItem><NavLink tag={Link} className="text-dark" to="/materialtype">Тип материала</NavLink></DropdownItem>
                        <DropdownItem><NavLink tag={Link} className="text-dark" to="/insert">Вставки</NavLink></DropdownItem>
                                  <DropdownItem><NavLink tag={Link} className="text-dark" to="/photo">Фото</NavLink></DropdownItem>
                                  <DropdownItem><NavLink tag={Link} className="text-dark" to="/stonetype">Тип камня</NavLink></DropdownItem>
                                  <DropdownItem divider />
                                  <DropdownItem><NavLink tag={Link} disabled to="/product_order">Товары в заказах</NavLink></DropdownItem>
                                  <DropdownItem><NavLink tag={Link} disabled to="/product_supply">Товары в поставках</NavLink></DropdownItem>

                    </DropdownMenu>
                </UncontrolledButtonDropdown>
            </ul>
          </Collapse>
        </Navbar>
      </header>
    );
  }
}
