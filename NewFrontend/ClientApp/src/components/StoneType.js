import React, { Component } from 'react';
import settings from './settings.json';

export class StoneType extends Component {
    static displayName = StoneType.name;

  constructor(props) {
    super(props);
      this.state = { stonetypes: [], loading: true };
  }

  componentDidMount() {
      this.populateStoneTypeData();
  }

    static renderStoneTypeTable(stonetypes) {
    return (
      <table className='table table-striped' aria-labelledby="tabelLabel">
        <thead>
          <tr>            
            <th>Наименование товара</th>                        
          </tr>
        </thead>
        <tbody>
                {stonetypes.map(stonetype =>
                    <tr key={stonetype.stoneTypeID}>
                        <td>{stonetype.name}</td>                        
            </tr>
          )}
        </tbody>
      </table>
    );
  }

  render() {
    let contents = this.state.loading
        ? <p><em>Loading...</em></p>
        : StoneType.renderStoneTypeTable(this.state.stonetypes);

    return (
      <div>
            <h1 id="tabelLabel" >Тип камня</h1>            
        {contents}
      </div>
    );
  }

    async populateStoneTypeData() {
        const response = await fetch(settings.apiurl + '/StoneTypes');
        const data = await response.json();
        this.setState({ stonetypes: data, loading: false });
  }
}
