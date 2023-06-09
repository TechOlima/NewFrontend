import React, { Component } from 'react';
import settings from './settings.json';

export class MaterialType extends Component {
    static displayName = MaterialType.name;

  constructor(props) {
    super(props);
      this.state = { materialTypes: [], loading: true };
  }

  componentDidMount() {
      this.populateMaterialTypeData();
  }

    static renderMaterialTypeTable(materialTypes) {
    return (
      <table className='table table-striped' aria-labelledby="tabelLabel">
        <thead>
          <tr>            
            <th>Наименование</th>
            <th>Проба</th>            
          </tr>
        </thead>
        <tbody>
                {materialTypes.map(materialType =>
                    <tr key={materialType.materialTypeID}>                  
                        <td>{materialType.name}</td>
                        <td>{materialType.fineness}</td>                  
            </tr>
          )}
        </tbody>
      </table>
    );
  }

  render() {
    let contents = this.state.loading
        ? <p><em>Loading...</em></p>
        : MaterialType.renderMaterialTypeTable(this.state.materialTypes);

    return (
      <div>
            <h1 id="tabelLabel" >Типы материала товара</h1>            
        {contents}
      </div>
    );
  }

    async populateMaterialTypeData() {
        const response = await fetch(settings.apiurl + '/MaterialTypes');
        const data = await response.json();
        this.setState({ materialTypes: data, loading: false });
  }
}
