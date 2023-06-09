import React, { Component } from 'react';
import { Button, Input, Row, Nav, NavItem, NavLink, TabContent, TabPane, Col, Alert } from 'reactstrap';
import settings from './settings.json';

export class VK extends Component {
    static displayName = VK.name;

  constructor(props) {
    super(props);
      this.state = {
          products: [],
          photos:[],
          loading: true,
          activeTab: "1",
          searchPattern: "",
          code: null,
          accessToken: null,
          uploadServer: null,
          photosSuccessMessage: null,
          photosErrorMessage: null,
          productsSuccessMessage: null,
          productsErrorMessage: null,
          vkError: null,
      };
      this.renderProductTable = this.renderProductTable.bind(this);
      this.renderPhotosTable = this.renderPhotosTable.bind(this);
      this.getCode = this.getCode.bind(this);
      this.getToken = this.getToken.bind(this);
      this.uploadServerVK = this.uploadServerVK.bind(this);
      this.uploadPhotoVK = this.uploadPhotoVK.bind(this);
      this.productAddMarket = this.productAddMarket.bind(this);
      this.productEditMarket = this.productEditMarket.bind(this);
    }
    //добавление товаров в ВК
    async productAddMarket(product) {
        //добавляем товар в вк
        let main_photo_id = product.photos.filter(i => i.vK_ID && i.is_Cover === true)[0]?.vK_ID ?
            product.photos.filter(i => i.vK_ID && i.is_Cover === true)[0]?.vK_ID : product.photos.filter(i => i.vK_ID)[0]?.vK_ID;
        let photo_ids = product.photos?.filter(i => i.vK_ID && i.vK_ID !== main_photo_id).map(i => i.vK_ID).toString();

        const data = new FormData();
        data.append("access_token", this.state.accessToken);
        data.append("name", product.name);
        data.append("description", product.description ? product.description : product.name);
        data.append("price", "1");
        data.append("main_photo_id", main_photo_id);
        data.append("photo_ids", photo_ids);
        data.append("category_id", settings.category_id);
        data.append("owner_id", settings.owner_id);
        data.append("version", settings.version);

        const response = await fetch(settings.mkr_service_url + '/VK/MarketAdd', {
            method: 'post',
            body: data
        });
        if (response.ok) {
            const market_item = await response.json();
            let market_item_id = market_item.response.market_item_id;
            //обновляем данные по продукту
            let activeProduct = product;
            activeProduct.is_Deleted = activeProduct.is_Deleted !== null ? activeProduct.is_Deleted : false;
            activeProduct.vK_ID = market_item_id;

            const responseProducts = await fetch(settings.apiurl + '/Products/' + activeProduct.productID, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json;',
                    'accept': 'text/plain'
                },
                body: JSON.stringify(activeProduct)
            });
            if (responseProducts.ok) {
                this.populateProductData();
                this.setState({ productsErrorMessage: null, productsSuccessMessage: "Данные по продукту отправлены в ВК" });
            }
            else this.setState({ productsErrorMessage: 'Произошла ошибка при сохранении', productsSuccessMessage: null });
        }
        else this.setState({ productsErrorMessage: 'Произошла ошибка при загрузке товара в ВК', productsSuccessMessage: null });
    }

    //изменение данных по товарам в ВК
    async productEditMarket(product) {
        //добавляем товар в вк
        let main_photo_id = product.photos.filter(i => i.vK_ID && i.is_Cover === true)[0]?.vK_ID ?
            product.photos.filter(i => i.vK_ID && i.is_Cover === true)[0]?.vK_ID : product.photos.filter(i => i.vK_ID)[0]?.vK_ID;
        let photo_ids = product.photos?.filter(i => i.vK_ID && i.vK_ID !== main_photo_id).map(i => i.vK_ID).toString();

        const data = new FormData();
        data.append("access_token", this.state.accessToken);
        data.append("name", product.name);
        data.append("description", product.description ? product.description : product.name);
        data.append("price", "1");
        data.append("main_photo_id", main_photo_id);
        data.append("photo_ids", photo_ids);
        data.append("item_id", product.vK_ID);
        data.append("category_id", settings.category_id);
        data.append("owner_id", settings.owner_id);
        data.append("version", settings.version);       

        const response = await fetch(settings.mkr_service_url + '/VK/MarketEdit', {
            method: 'post',
            body: data
        });
        if (response.ok) {
            //const market_item = await response.json();
            this.setState({ productsErrorMessage: null, productsSuccessMessage: "Данные по продукту обновлены в ВК" });
        }
        else this.setState({ productsErrorMessage: 'Произошла ошибка при обновлении данных в ВК', productsSuccessMessage: null });
    }

    //загрузка фотографий в ВК
    async uploadPhotoVK(photo) {
        //загружаем фотографию
        const loaddata = new FormData();
        loaddata.append("access_token", this.state.accessToken);
        loaddata.append("upload_url", this.state.uploadServer);
        loaddata.append("photo_url", photo.photoUrl);
        const loadresponse = await fetch(settings.mkr_service_url + '/VK/UploadImageToServer', {
            method: 'post',
            body: loaddata
        });
        if (loadresponse.ok) {
            const loadingPhoto = await loadresponse.json();
            //сохраняем фотографию на сервере
            const savedata = new FormData();
            savedata.append("access_token", this.state.accessToken);
            savedata.append("group_id", settings.group_id);
            savedata.append("version", settings.version);
            savedata.append("photo", loadingPhoto.photo);
            savedata.append("server", loadingPhoto.server);
            savedata.append("hash", loadingPhoto.hash);
            const saveresponse = await fetch(settings.mkr_service_url + '/VK/SaveImageToServer', {
                method: 'post',
                body: savedata
            });
            if (saveresponse.ok) {
                const savedPhoto = await saveresponse.json();
                //обновляем данных по фотографии в базе данных
                let newPhoto = {
                    photoID: photo.photoID,
                    productID: photo.productID,
                    is_Cover: photo.is_Cover,
                    photoUrl: photo.photoUrl,
                    vK_ID: savedPhoto?.response[0].id
                };
                const response = await fetch(settings.apiurl + '/Photos/' + photo.photoID, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json;',
                        'accept': 'text/plain'
                    },
                    body: JSON.stringify(newPhoto)
                });
                if (response.ok) {
                    //данные обновлены по фотографии, перегружаем список 
                    this.populatePhotosData();
                    this.populateProductData();
                    this.setState({ photosErrorMessage: null, photosSuccessMessage: "Фотография успешно загружена на сервер ВК" });
                }
                else this.setState({ photosErrorMessage: 'Произошла ошибка', photosSuccessMessage: null });
            }
            else this.setState({ photosErrorMessage: 'Произошла ошибка при сохранении фото на сервере', photosSuccessMessage: null });
        }
        else this.setState({ photosErrorMessage: 'Произошла ошибка при загрузке фото на сервер', photosSuccessMessage: null });
    }

    async uploadServerVK() {
        //получаем адрес для загрузки
        if (this.state.uploadServer == null) {
            //получаем адрес для загрузки  
            const data = new FormData();
            data.append("access_token", this.state.accessToken);
            data.append("group_id", settings.group_id);
            data.append("version", settings.version);
            const response = await fetch(settings.mkr_service_url + '/VK/GetUploadServer', {
                method: 'post',
                body: data
            });
            if (response.ok) {
                const data = await response.json();                
                this.setState({ uploadServer: data.response.upload_url });
            }
            else this.setState({ vkError: "Произошла ошибка при получении адреса сервера для загрузки фотографий" });            
        }        
    }
    async getToken(code) {
        //делаем запрос на получение токена
        const data = new FormData();
        data.append("code", code);
        data.append("client_id", settings.client_id);
        data.append("client_secret", settings.client_secret);
        data.append("redirect_uri", settings.redirect_uri);
        const response = await fetch(settings.mkr_service_url + '/VK/GetToken', {
            method: 'POST',
            body: data
        });
        if (response.ok) {
            const data = await response.json();
            if (data.access_token)
                this.setState({ accessToken: data.access_token, vkError: null }, () => this.uploadServerVK());
        }
        else this.setState({ vkError: "Произошла ошибка при получении токена доступа в ВК. Попробуйте авторизоваться еще раз." });
    }
    getCode() {
        window.location.href = 'https://oauth.vk.com/authorize?client_id=51653671&display=page&redirect_uri=' + settings.redirect_uri + '&scope=market,photos&response_type=code&v=5.131';
    }
    componentDidMount() {      
      this.populateProductData();
      this.populatePhotosData();
      //получаем параметр кода сессии
      const search = window.location.search;
      const params = new URLSearchParams(search);
      let code = params.get('code');
      //console.log(code);
      if (code !== null) {
          this.setState({ code: code });
          //запрашиваем токен если его нет
          if (this.state.accessToken === null) this.getToken(code);
      }      
    }
    renderPhotosTable(photos) {
        return (<div>
            {photos.length > 0 ?
            <table className='table table-striped' aria-labelledby="tabelLabel">
                <thead>
                    <tr>
                        <th></th>
                        <th>Идентификатор товара</th>
                        <th>Фотография</th>
                        <th>Url</th>
                    </tr>
                </thead>
                <tbody>
                    {photos.map(photo =>
                        <tr key={photo.photoID}>
                            <td><Button
                                color="primary"
                                size="sm"
                                onClick={() => { this.uploadPhotoVK(photo) }}
                            >
                                Передать в ВК
                            </Button></td>
                            <td>{photo.productID}</td>
                            <td><img
                                alt={photo}
                                width="100"
                                src={photo.photoUrl ? photo.photoUrl : ''}
                            /></td>
                            <td>{photo.photoUrl}</td>
                        </tr>
                    )}
                </tbody>
                </table> : <Alert className="mt-2" color="success">
                    Отсутствуют фотографии для загрузки (все фотографии уже загружены)
                </Alert> }
        </div>);
    }

  renderProductTable(products) {
    return (
      <table className='table table-striped' aria-labelledby="tabelLabel">
        <thead>
          <tr>
                    <th></th>
                    <th>Статус</th>
                    <th>Фотографии</th>
                    <th>Наименование</th>
                    <th>Описание</th>
          </tr>
        </thead>
        <tbody>
                {products.map(product =>
              <tr key={product.productID}>
                        <td>
                            {product.photos.length > 0 && product.photos.filter(i => !i.vK_ID).length === 0 ? product.vK_ID ?
                                <Button
                                    color="primary"
                                    size="sm"
                                    onClick={() => { this.productEditMarket(product) }}
                                >
                                    Обновить в ВК
                                </Button> :
                                <Button
                                    color="primary"
                                    size="sm"
                                    onClick={() => { this.productAddMarket(product) }}
                                >
                                    Передать в ВК
                                </Button> : <span style={{ color: "red" }}>Не готово к отправке</span>
                            }
                        </td>
                        <td>{product.vK_ID ? <span style={{ color: "green" }}>Загружен</span> : "Не загружен"}</td>
                        <td>{product.photos.length === 0 ? <span style={{ color: "red" }}>Отсутствуют</span> :
                            product.photos.filter(i => !i.vK_ID).length > 0 ? <span style={{ color: "red" }}>Не загружены</span> :
                                <span style={{ color: "green" }}>Ок</span>}</td>
                        <td>{product.name}</td>
                        <td>{product.equipment}</td>
                        <td>{product.description}</td>
            </tr>
          )}
        </tbody>
      </table>
    );
  }    
    render() { 
    let contentsProducts = this.state.loading
        ? <p><em>Загрузка...</em></p>
        : this.renderProductTable(this.state.products.filter(i=> !i.is_Deleted));

      let contentsPhotos = this.state.loading
          ? <p><em>Загрузка...</em></p>
          : this.renderPhotosTable(this.state.photos.filter(i => !i.vK_ID));
             
    return (
      <div>
            <h1 id="tabelLabel" >Передача данных в ВК</h1>
            {
                !this.state.accessToken || !this.state.code ?
                    <div>
                        {this.state.vkError ? <Alert color='danger'>{ this.state.vkError }</Alert> : ''}
                        <h4 id="tabelLabel" >Для взаимодействия с ВК необходимо авторизоваться </h4>
                        <Button
                            color="primary"
                            onClick={this.getCode}
                        >
                            Авторизоваться в ВК
                        </Button>
                    </div> : ''

            }
            {
                this.state.accessToken ?
                    <div>
                        <div style={{ textAlign: 'right' }}>
                            </div>
                        <div className="row gy-1">
                            <Row className="gy-2"><Col sm="12"><Input onKeyDown={(ev) => {
                                if (ev.keyCode === 13) {
                                    this.setState({ searchPattern: ev.target.value }, () => { this.populateProductData() })                                    
                                }
                            }} placeholder='Введите текст для поиска' /></Col></Row>
                        </div>
                        <br />
                        <Nav tabs >
                            <NavItem>
                                <NavLink className={this.state.activeTab === "1" ? "active" : ""} onClick={() => this.setState({ activeTab: "1" })}>Товары</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink className={this.state.activeTab === "2" ? "active" : ""} onClick={() => this.setState({ activeTab: "2" })}>Фотографии</NavLink>
                            </NavItem>
                        </Nav>
                        <TabContent activeTab={this.state.activeTab}>
                            <TabPane tabId="1">
                                <Row>
                                    <Col sm="12">
                                        <button disabled className="mt-2 btn btn-primary">Передать (обновить) данные по всем товарам</button>
                                        {this.state.productsSuccessMessage ?
                                            <Alert className="mt-2" color="success">
                                                {this.state.productsSuccessMessage}
                                            </Alert>
                                            : ''}
                                        {this.state.productsErrorMessage ?
                                            <Alert className="mt-2" color="danger">
                                                {this.state.productsErrorMessage}
                                            </Alert>
                                            : ''}
                                        {contentsProducts}
                                    </Col>
                                </Row>
                            </TabPane>
                            <TabPane tabId="2">
                                <Row>
                                    <Col sm="12">
                                        {!this.state.uploadServer ? <Alert className="mt-2" color="danger">
                                            Не удалось получить адрес сервера для загрузки фотографий, загрузка фотографий невозможна
                                        </Alert> :
                                            <div>
                                                <button disabled className="mt-2 btn btn-primary">Передать данные по всем фотографиям</button>
                                                {this.state.photosSuccessMessage ?
                                                    <Alert className="mt-2" color="success">
                                                        {this.state.photosSuccessMessage}
                                                    </Alert>
                                                    : ''}
                                                {this.state.photosErrorMessage ?
                                                    <Alert className="mt-2" color="danger">
                                                        {this.state.photosErrorMessage}
                                                    </Alert>
                                                    : ''}
                                                {contentsPhotos}
                                            </div>}
                                        
                                                                                
                                    </Col>
                                </Row>
                            </TabPane>
                        </TabContent>                        
                    </div> : ''
            }            
      </div>
    );
  }

    async populateProductData() {
        const response = await fetch(settings.apiurl + '/Products?SearchPattern=' + this.state.searchPattern);
        const data = await response.json();
        this.setState({ products: data, loading: false });
    }
    async populatePhotosData() {
        const response = await fetch(settings.apiurl + '/Photos');
        const data = await response.json();
        this.setState({ photos: data });
    }    
}
