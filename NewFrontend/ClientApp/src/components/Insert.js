import React, { Component } from 'react';
import settings from './settings.json';

export class Insert extends Component {
    static displayName = Insert.name;

  constructor(props) {
    super(props);
    this.state = { inserts: [], loading: true };
  }

  componentDidMount() {
      this.populateInsertData();
  }

  static renderInsertTable(inserts) {
    return (
      <table className='table table-striped' aria-labelledby="tabelLabel">
        <thead>
          <tr>            
            <th>Товар</th>
            <th>Вес</th>
            <th>Тип камня</th>            
          </tr>
        </thead>
        <tbody>
          {inserts.map(insert =>
              <tr key={insert.insertID}>                  
                  <td>{insert.productName}</td>
                  <td>{insert.weight}</td>
                  <td>{insert.stoneType}</td>                  
            </tr>
          )}
        </tbody>
      </table>
    );
  }

  render() {
    let contents = this.state.loading
        ? <p><em>Загрузка...</em></p>
        : Insert.renderInsertTable(this.state.inserts);

    return (
      <div>
            <h1 id="tabelLabel" >Вставки</h1>            
        {contents}
      </div>
    );
  }

    async populateInsertData() {        
        const response = await fetch(settings.apiurl + '/Inserts');
        const data = await response.json();
        this.setState({ inserts: data, loading: false });
  }
}
