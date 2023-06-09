import React, { Component } from 'react';
import { Button } from 'reactstrap';
import settings from './settings.json';

export class Product extends Component {
    static displayName = Product.name;

  constructor(props) {
    super(props);
    this.state = { products: [], loading: true };
  }

  componentDidMount() {
    this.populateProductData();
  }

  static renderProductTable(products) {
    return (
      <table className='table table-striped' aria-labelledby="tabelLabel">
        <thead>
          <tr>
            <th></th>
            <th>Наименование</th>
            <th>Состав</th>
            <th>Тип</th>
            <th>Материал</th>
            <th>Код производителя</th>
            <th>Цена</th>
            <th>Описание</th>
            <th>Пол</th>
            <th>Удаленный</th>
            <th>Размер</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product =>
              <tr key={product.productID}>
                  <td>
                      <Button
                          color="info"
                          size="sm"
                          disabled
                      >
                          Изменить
                      </Button>
                      <Button
                          color="danger"
                          size="sm"
                          disabled
                      >
                          Удалить
                      </Button>

                  </td>
                  <td>{product.name}</td>
                  <td>{product.equipment}</td>
                  <td>{product.productType.name}</td>
                  <td>{product.materialType.name}</td>
                  <td>{product.vendorCode}</td>
                  <td>{product.price}</td>
                  <td>{product.description}</td>
                  <td>{product.gender}</td>
                  <td>{product.is_Deleted}</td>
                  <td>{product.size}</td>
            </tr>
          )}
        </tbody>
      </table>
    );
  }

  render() {
    let contents = this.state.loading
        ? <p><em>Loading...</em></p>
        : Product.renderProductTable(this.state.products);

    return (
      <div>
            <h1 id="tabelLabel" >Товары</h1>
            <button className="btn btn-primary" disabled onClick={this.incrementCounter}>Добавить товар</button>
        {contents}
      </div>
    );
  }

    async populateProductData() {        
        const response = await fetch(settings.apiurl + '/Products');
        const data = await response.json();
        this.setState({ products: data, loading: false });
  }
}
