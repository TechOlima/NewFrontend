import React, { Component } from 'react';
import settings from './settings.json';

export class ProductType extends Component {
    static displayName = ProductType.name;

  constructor(props) {
    super(props);
      this.state = { productTypes: [], loading: true };
  }

  componentDidMount() {
      this.populateProductTypeData();
  }

    static renderProductTypeTable(productTypes) {
    return (
      <table className='table table-striped' aria-labelledby="tabelLabel">
        <thead>
          <tr>            
            <th>Наименование</th>                
          </tr>
        </thead>
        <tbody>
                {productTypes.map(productType =>
                    <tr key={productType.productTypeID}>                  
                        <td>{productType.name}</td>                        
            </tr>
          )}
        </tbody>
      </table>
    );
  }

  render() {
    let contents = this.state.loading
        ? <p><em>Loading...</em></p>
        : ProductType.renderProductTypeTable(this.state.productTypes);

    return (
      <div>
            <h1 id="tabelLabel" >Типы товара</h1>            
        {contents}
      </div>
    );
  }

    async populateProductTypeData() {
        const response = await fetch(settings.apiurl + '/ProductTypes');
        const data = await response.json();
        this.setState({ productTypes: data, loading: false });
  }
}
