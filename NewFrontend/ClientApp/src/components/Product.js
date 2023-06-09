import React, { Component } from 'react';
import { Button, Input, Row, Nav, NavItem, NavLink, TabContent, TabPane, Col, Modal, ModalBody, ModalHeader, ModalFooter, Form, FormGroup, Label, CardFooter } from 'reactstrap';
import { Card, CardHeader, CardBody, Alert, CardImg, ButtonGroup } from 'reactstrap';
import settings from './settings.json';
//import axios from 'axios';

export class Product extends Component {
    static displayName = Product.name;    

  constructor(props) {
    super(props);
      this.state = {
          products: [],
          loading: true,
          activeTab: "1",
          searchPattern: "",
          showModal: false,
          productTypes: [],
          materialTypes: [],
          genderTypes: [],
          stoneTypes:[],
          activeProduct: null,
          successMessage: null,
          errorMessage: null,
          insertSuccessMessage: null,
          insertErrorMessage: null,
          newInsertWeight: '',
          newInsertType: '',
          selectedImage: null,
          imageSuccessMessage: null,
          imageErrorMessage: null,
      };
      this.toggleModal = this.toggleModal.bind(this);
      this.editProduct = this.editProduct.bind(this);
      this.renderProductTable = this.renderProductTable.bind(this);
      this.changeActiveProduct = this.changeActiveProduct.bind(this);
      this.getActiveProduct = this.getActiveProduct.bind(this);
      this.saveActiveProductChanges = this.saveActiveProductChanges.bind(this);
      this.deleteActiveProduct = this.deleteActiveProduct.bind(this);
      this.addNewInsert = this.addNewInsert.bind(this);
      this.deleteInsert = this.deleteInsert.bind(this);
      this.UploadImage = this.UploadImage.bind(this);
      this.MakeCoverImage = this.MakeCoverImage.bind(this);
      this.DeleteImage = this.DeleteImage.bind(this);
    }
    
    async UploadImage() {
        let newPhoto = {
            productID: this.state.activeProduct.productID,
            is_Cover: false,
            photoUrl: this.state.selectedImage
        };
        const response = await fetch(settings.apiurl + '/Photos/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;',
                'accept': 'text/plain'
            },
            body: JSON.stringify(newPhoto)
        });
        if (response.ok) {
            const response = await fetch(settings.apiurl + '/Products/' + this.state.activeProduct.productID);
            const data = await response.json();
            this.setState({
                imageSuccessMessage: 'Фотография добавлена',
                imageErrorMessage: null,
                selectedImage: null,
                activeProduct: this.getActiveProduct(data)
            });
        }
        else this.setState({ imageErrorMessage: 'Произошла ошибка при добавлении фотографии', imageSuccessMessage: null });
    }
    async MakeCoverImage(photo) {
        let newPhoto = {
            photoID: photo.photoID,
            productID: photo.productID,
            is_Cover: true,
            photoUrl: photo?.photoUrl,
            vK_ID: photo?.vK_ID
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
            const response = await fetch(settings.apiurl + '/Products/' + this.state.activeProduct.productID);
            const data = await response.json();
            this.setState({
                imageSuccessMessage: 'Фотография сделана обложкой',
                imageErrorMessage: null,
                selectedImage: null,
                activeProduct: this.getActiveProduct(data)
            });
        }
        else this.setState({ imageErrorMessage: 'Произошла ошибка', imageSuccessMessage: null });
    }
    async DeleteImage(photoID) {
        const response = await fetch(settings.apiurl + '/Photos/' + photoID, {
            method: 'DELETE',
        });        
        if (response.ok) {
            const response = await fetch(settings.apiurl + '/Products/' + this.state.activeProduct.productID);
            const data = await response.json();
            this.setState({
                imageSuccessMessage: 'Фотография удалена',
                imageErrorMessage: null,
                selectedImage: null,
                activeProduct: this.getActiveProduct(data)
            });
        }
        else this.setState({ imageErrorMessage: 'Произошла ошибка при удалении фотографии', imageSuccessMessage: null });
    }
    toggleModal() {
        let newmodal = !this.state.showModal;
        this.setState({ showModal: newmodal });
    }
    getActiveProduct(product) {
        return {
            productID: product ? product.productID : null,
            productType: product ? product.productType ? product.productType : "" : "",
            materialType: product ? product.materialType ? product.materialType : "" :"",
            name: product ? product.name ? product.name : "" :"",
            equipment: product ? product.equipment ? product.equipment : "" :"",
            vendorCode: product ? product.vendorCode ? product.vendorCode : "" :"",
            size: product ? product.size ? product.size : "" :"",
            description: product ? product.description ? product.description : "" :"",
            genderType: product ? product.genderType ? product.genderType : "" :"",
            is_Deleted: product ? product.is_Deleted : null,
            photos: product ? product.photos ? product.photos : [] : [],
            inserts: product ? product.inserts ? product.inserts : [] : [],
            amounth: product ? product.amounth ? product.amounth : "" : "",
            vK_ID: product?.vK_ID ? product.vK_ID : null
        };
    }

    async saveActiveProductChanges() { 
        let activeProduct = this.state.activeProduct;

        activeProduct.is_Deleted = activeProduct.is_Deleted !== null ? activeProduct.is_Deleted : false;
                
        const response = await fetch(this.state.activeProduct.productID ? (settings.apiurl + '/Products/' + this.state.activeProduct.productID) : (settings.apiurl + '/Products/'), {
            method: this.state.activeProduct.productID ? 'PUT' : 'POST',
            headers: {
                'Content-Type': 'application/json;',
                'accept': 'text/plain'
            },
            body: JSON.stringify(activeProduct)
        });
        if (response.ok) {
            if (this.state.activeProduct.productID !== null) {
                this.setState({ successMessage: 'Данные успешно сохранены', errorMessage: null });                
            }
            else {
                const data = await response.json();
                this.setState({ activeProduct: this.getActiveProduct(data), successMessage: 'Данные успешно сохранены', errorMessage: null });
            }
        }
        else this.setState({ errorMessage: 'Произошла ошибка при сохранении', successMessage: null });
        
    }
    async deleteActiveProduct() {        
        const response = await fetch(settings.apiurl + '/Products/' + this.state.activeProduct.productID, {
            method: 'DELETE',            
        });
        if (response.ok) {
            this.setState({ activeProduct: this.getActiveProduct(), successMessage: 'Данные успешно удалены', errorMessage: null }, () => {
                this.populateProductData();
            });
        }
        else this.setState({ errorMessage: 'Произошла ошибка при удалении', successMessage: null });
    }
    async addNewInsert() {
        let newInsert = {
            weight: this.state.newInsertWeight,
            stoneType: this.state.newInsertType,
            productID: this.state.activeProduct.productID
        };
        const response = await fetch(settings.apiurl + '/Inserts/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;',
                'accept': 'text/plain'
            },
            body: JSON.stringify(newInsert)
        });
        if (response.ok) {
            const response = await fetch(settings.apiurl + '/Products/' + this.state.activeProduct.productID);
            const data = await response.json();
            this.setState({ insertSuccessMessage: 'Данные успешно сохранены', insertErrorMessage: null, activeProduct: this.getActiveProduct(data) });
        }
        else this.setState({ insertErrorMessage: 'Произошла ошибка при сохранении', insertSuccessMessage: null });
    }
    async deleteInsert(insertID) {
        const response = await fetch(settings.apiurl + '/Inserts/' + insertID, {
            method: 'DELETE'            
        });
        if (response.ok) {
            const response = await fetch(settings.apiurl + '/Products/' + this.state.activeProduct.productID);
            const data = await response.json();
            this.setState({ insertSuccessMessage: 'Данные успешно удалены', insertErrorMessage: null, activeProduct: this.getActiveProduct(data) });
        }
        else this.setState({ insertSuccessMessage: null, insertErrorMessage: 'Произошла ошибка при удалении' });
    }

  componentDidMount() {
      this.populateProductData();
      this.populateProductTypeData();
      this.populateMaterialTypeData();
      this.populateGenderTypeData();
      this.populateStoneTypeData();
    }
    async editProduct(productID) {
        const response = await fetch(settings.apiurl + '/Products/' + productID);
        const data = await response.json();
        this.setState({
            activeProduct: this.getActiveProduct(data),
            successMessage: null,
            errorMessage: null,
            insertSuccessMessage: null,
            insertErrorMessage: null,
            imageSuccessMessage: null,
            imageErrorMessage: null
        }, () => {
            this.toggleModal();
        });        
    }
    changeActiveProduct(value, propertie) {
        let changedProduct = this.state.activeProduct;
        changedProduct[propertie] = value;
        this.setState({ activeProduct: changedProduct }); 
    }

    renderModal() {        
        return (
            <div>
                <Modal isOpen={this.state.showModal} size={this.state.activeProduct?.productID ? 'xl' : 'lg' } toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Карточка товара</ModalHeader>
                    <ModalBody>
                        <Row>{
                            this.state.activeProduct?.productID ?
                            <Col md={3}>
                                {this.state.imageSuccessMessage ?
                                    <Alert color="success">
                                        {this.state.imageSuccessMessage}
                                    </Alert>
                                    : ''}
                                {this.state.imageErrorMessage ?
                                    <Alert color="danger">
                                        {this.state.imageErrorMessage}
                                    </Alert>
                                        : ''}                                    
                                
                                        <Card className='mt-2'>
                                            <CardHeader>Добавить изображение</CardHeader>
                                            {this.state.selectedImage ? 
                                                <CardImg
                                                    alt="newphoto"
                                                width="100%"                                                
                                                    src={this.state.selectedImage}
                                                /> : ""
                                            }
                                            <CardBody>
                                            <FormGroup>                                                
                                                <Input
                                                    name="nameInput"
                                                    placeholder="Введите url изображение"
                                                    value={this.state.selectedImage ? this.state.selectedImage : ''}
                                                    onChange={(event) => {
                                                        this.setState({ selectedImage: event.target.value });
                                                    }}
                                                />
                                            </FormGroup>
                                            </CardBody>                                            
                                        {this.state.selectedImage ?
                                            <CardFooter ><button
                                                className="btn btn-primary"
                                                width="100%"
                                                color="primary"
                                                onClick={this.UploadImage}
                                                type="button"
                                            >Добавить</button>
                                            </CardFooter>
                                                : ''}
                                            
                                        </Card>                                                                     
                                {
                                    this.state.activeProduct ? this.state.activeProduct.photos ?
                                        this.state.activeProduct.photos.map(photo =>
                                            <Card className='mt-2' key={photo.photoID}>
                                                <CardImg
                                                    alt={photo}
                                                    width="100%"
                                                    src={photo.photoUrl ? photo.photoUrl : ''}
                                                />
                                                <CardFooter >
                                                    <ButtonGroup size="sm" className='col-12'>
                                                        {!photo.is_Cover ?
                                                            <Button outline
                                                                onClick={() => this.MakeCoverImage(photo) } >
                                                            Сделать обложкой
                                                        </Button> : ''}                                                        
                                                        <Button outline
                                                                onClick={() => this.DeleteImage(photo.photoID)}>
                                                            Удалить
                                                        </Button>                                                        
                                                    </ButtonGroup>
                                                </CardFooter>
                                            </Card>
                                        ) : '' : ''
                                }                                
                            </Col> : ''
                            }
                            <Col md={this.state.activeProduct?.productID ? 9 : 12}>
                        {this.state.successMessage ? 
                            <Alert color="success">
                                {this.state.successMessage}
                            </Alert>
                            : ''}
                        {this.state.errorMessage ?
                            <Alert color="danger">
                                {this.state.errorMessage}
                            </Alert>
                            : ''}                        
                        <Form>
                            <FormGroup>
                                <Label for="nameInput">
                                    Наименование
                                </Label>
                                <Input
                                    id="nameInput"
                                    name="name"                                    
                                    value={this.state.activeProduct ? this.state.activeProduct.name : ''}
                                    onChange={(ev) => {
                                        this.changeActiveProduct(ev.target.value,'name');
                                    }}
                                />
                            </FormGroup>
                            <Row>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label for="productTypeInput">
                                            Вид
                                        </Label>
                                        <Input 
                                            id="productTypeInput"
                                            name="productType"
                                            type="select"
                                            value={this.state.activeProduct ? this.state.activeProduct.productType : ''}
                                            onChange={(ev) => {
                                                this.changeActiveProduct(ev.target.value, 'productType');
                                            }}
                                        >
                                            <option value={null}>
                                                Не выбран
                                            </option>
                                            {this.state.productTypes.map(productType =>
                                            <option value={productType.name} key={productType.productTypeID}>
                                                {productType.name}
                                            </option>
                                        )}                                                                                        
                                        </Input>
                                    </FormGroup>
                                </Col>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label for="articulInput">
                                            Артикул
                                        </Label>
                                        <Input
                                            id="articulInput"
                                            name="articul"
                                            placeholder=""
                                            value={this.state.activeProduct ? this.state.activeProduct.vendorCode : ''}
                                            onChange={(ev) => {
                                                this.changeActiveProduct(ev.target.value, 'vendorCode');
                                            }}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                            <FormGroup>
                                <Label for="genderTypeInput">
                                    Пол
                                </Label>
                                        <Input
                                            id="genderTypeInput"
                                            name="genderType"
                                            type="select"
                                            value={this.state.activeProduct ? this.state.activeProduct.genderType : ''}
                                            onChange={(ev) => {
                                                this.changeActiveProduct(ev.target.value, 'genderType');
                                            }}
                                        >
                                            <option value={null}>
                                                Не выбран
                                            </option>
                                            {this.state.genderTypes.map(genderType =>
                                                <option value={genderType.name} key={genderType.genderTypeID}>
                                                    {genderType.name}
                                                </option>
                                            )}
                                        </Input>
                                    </FormGroup>
                                </Col>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label for="materialTypeInput">
                                            Состав
                                        </Label>
                                        <Input
                                            id="materialTypeInput"
                                            name="materialType"
                                            type="select"
                                            value={this.state.activeProduct ? this.state.activeProduct.materialType : ''}
                                            onChange={(ev) => {
                                                this.changeActiveProduct(ev.target.value, 'materialType');
                                            }}
                                        >
                                            <option value={null}>
                                                Не выбран
                                            </option>
                                            {this.state.materialTypes.map(materialType =>
                                                <option value={materialType.name} key={materialType.materialTypeID}>
                                                    {materialType.name}
                                                </option>
                                            )}
                                        </Input>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="productSizeInput">
                                        Размер
                                    </Label>
                                    <Input
                                            id="productSizeInput"
                                            name="productSize"
                                            type="number"
                                            value={this.state.activeProduct ? this.state.activeProduct.size : ''}
                                            onChange={(ev) => {
                                                this.changeActiveProduct(ev.target.value, 'size');
                                            }}
                                    >                                        
                                    </Input>
                                </FormGroup>
                            </Col>
                            </Row>
                            <FormGroup>
                                <Label for="complectInput">
                                    Комплектация
                                </Label>
                                <Input
                                    id="complectInput"
                                    name="complect"
                                    type="textarea"
                                    value={this.state.activeProduct ? this.state.activeProduct.equipment : ''}
                                    onChange={(ev) => {
                                        this.changeActiveProduct(ev.target.value, 'equipment');
                                    }}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="descriptionInput">
                                    Описание
                                </Label>
                                <Input
                                    id="descriptionInput"
                                    name="description"
                                    type="textarea"
                                    value={this.state.activeProduct ? this.state.activeProduct.description : ''}
                                    onChange={(ev) => {
                                        this.changeActiveProduct(ev.target.value, 'description');
                                    }}
                                />
                            </FormGroup>
                            {
                                this.state.activeProduct?.productID ?
                                    <Row>
                                        <Col md={6}>
                                            <FormGroup>
                                                <Label for="storageCount">
                                                    Остаток на складе
                                                </Label>
                                                <Input
                                                    plaintext
                                                    id="storageCount"
                                                    name="storageCount"
                                                    defaultValue={this.state.activeProduct ? this.state.activeProduct.storageCount : ''}                                                    
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row> : ""
                            }                            
                        </Form>
                        {
                            this.state.activeProduct?.productID ?
                                <Card
                                    className="my-2"
                                    style={{
                                        width: '100%'
                                    }}
                                >
                                    <CardHeader>
                                        <b>Вставки</b>
                                    </CardHeader>
                                    <CardBody>
                                        {this.state.insertSuccessMessage ?
                                            <Alert color="success">
                                                {this.state.insertSuccessMessage}
                                            </Alert>
                                            : ''}
                                        {this.state.insertErrorMessage ?
                                            <Alert color="danger">
                                                {this.state.insertErrorMessage}
                                            </Alert>
                                            : ''}
                                        {
                                            this.state.activeProduct?.inserts?.length > 0 ?
                                                <Row>
                                                    <Col md={6}>
                                                        <Label>
                                                            Вид
                                                        </Label>
                                                    </Col>
                                                    <Col md={2}>
                                                        <Label>
                                                            Величина
                                                        </Label>
                                                    </Col>
                                                </Row> : ""
                                        }
                                        {this.state.activeProduct?.inserts?.map(insert =>
                                            <Row key={insert.insertID}>
                                                <Col md={6}>
                                                    <Input
                                                        id="insertType"
                                                        name="iType"
                                                        readOnly
                                                        value={insert.stoneType}
                                                    />
                                                </Col>
                                                <Col md={2}>
                                                    <Input
                                                        id="insertSize"
                                                        name="iSize"
                                                        readOnly
                                                        value={insert.weight}
                                                    />
                                                </Col>
                                                <Col md={2}>
                                                    <Button
                                                        color="danger"
                                                        size="sm"
                                                        onClick={() => { this.deleteInsert(insert.insertID)}}
                                                    >
                                                        Удалить
                                                    </Button>
                                                </Col>
                                            </Row>
                                        )}                                        
                                        <Row className="mt-2">
                                            <Col md={6}>
                                                <Input
                                                    id="insertStoneType"
                                                    name="iStoneType"                                                    
                                                    value={this.state.newInsertType}
                                                    type='select'
                                                    onChange={(ev) => {
                                                        console.log(ev.target.value);
                                                        this.setState({ newInsertType: ev.target.value });
                                                    }}
                                                >   <option disabled value="">
                                                        Выберите значение
                                                    </option>
                                                    {this.state.stoneTypes.map(stoneType =>
                                                        <option value={stoneType.name} key={stoneType.stoneTypeID}>
                                                            {stoneType.name}
                                                        </option>
                                                    )}
                                                </Input>
                                            </Col>
                                            <Col md={2}>
                                                <Input
                                                    id="insertSize"
                                                    name="iSize"
                                                    type="number"
                                                    value={this.state.newInsertWeight}
                                                    onChange={(ev) => {                                                        
                                                        this.setState({ newInsertWeight: ev.target.value });
                                                    }}
                                                />
                                            </Col>
                                            <Col md={2}>
                                                <Button
                                                    color="primary"
                                                    size="sm"
                                                    onClick={this.addNewInsert}
                                                >
                                                    Добавить
                                                </Button>
                                            </Col>
                                        </Row>                                        
                                    </CardBody>
                                </Card> : ""
                            }
                            </Col>
                            </Row>
                    </ModalBody>
                    <ModalFooter>
                        {this.state.activeProduct ? this.state.activeProduct.productID ? <Button color="danger" onClick={this.deleteActiveProduct}>
                            Удалить
                        </Button> : '' : ''}
                        {' '}
                        <Button color="secondary" onClick={this.saveActiveProductChanges}>
                            Сохранить
                        </Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }

  renderProductTable(products) {
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
            <th>Описание</th>
            <th>Пол</th>            
                    <th>Размер</th>
                    <th>Остаток на складе</th>
          </tr>
        </thead>
        <tbody>
                {products.map(product =>
              <tr key={product.productID}>
                  <td>
                      <Button
                                color="primary"
                                size="sm"
                                onClick={() => { this.editProduct(product.productID) }}
                      >
                          Изменить
                      </Button>  
                  </td>
                  <td>{product.name}</td>
                  <td>{product.equipment}</td>
                  <td>{product.productType}</td>
                  <td>{product.materialType}</td>
                  <td>{product.vendorCode}</td>                  
                  <td>{product.description}</td>
                  <td>{product.gendeType}</td>                  
                        <td>{product.size}</td>
                        <td>{product.amounth}</td>
            </tr>
          )}
        </tbody>
      </table>
    );
  }

  render() {
    let contentsActual = this.state.loading
        ? <p><em>Загрузка...</em></p>
        : this.renderProductTable(this.state.products.filter(i=> !i.is_Deleted));

      let contentsDeleted = this.state.loading
          ? <p><em>Загрузка...</em></p>
          : this.renderProductTable(this.state.products.filter(i => i.is_Deleted));

      let modal = this.renderModal();

    return (
      <div>
            <h1 id="tabelLabel" >Товары</h1>            
            <div style={{ textAlign: 'right' }}>
                <button className="btn btn-primary" onClick={() =>
                {
                    this.setState({ activeProduct: this.getActiveProduct(), successMessage: null, errorMessage: null }, () => {
                        this.toggleModal();
                    });
            }}>Создать</button></div>
            <div className="row gy-1">
                <Row className="gy-2"><Col sm="12"><Input onKeyDown={(ev) => {
                    if (ev.keyCode === 13) {
                        this.setState({ searchPattern: ev.target.value }, () => { this.populateProductData()})
                        //return false;
                    }
                }} placeholder='Введите текст для поиска' /></Col></Row>
            </div>
            <br />            
            <Nav tabs >
                <NavItem>
                    <NavLink className={this.state.activeTab === "1" ? "active" : ""} onClick={() => this.setState({ activeTab: "1" })}>Актуальные</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink className={this.state.activeTab === "2" ? "active" : ""} onClick={() => this.setState({ activeTab: "2" })}>Архив</NavLink>
                </NavItem>
            </Nav>
            <TabContent activeTab={this.state.activeTab}>
                <TabPane tabId="1">
                    <Row>
                        <Col sm="12">
                            {contentsActual}
                        </Col>
                    </Row>
                </TabPane>
                <TabPane tabId="2">
                    <Row>
                        <Col sm="12">
                            {contentsDeleted}
                        </Col>
                    </Row>
                </TabPane>
            </TabContent>
            {modal}
      </div>
    );
  }

    async populateProductData() {
        const response = await fetch(settings.apiurl + '/Products?SearchPattern=' + this.state.searchPattern);
        const data = await response.json();
        this.setState({ products: data, loading: false });
    }
    async populateProductTypeData() {
        const response = await fetch(settings.apiurl + '/ProductTypes');
        const data = await response.json();
        this.setState({ productTypes: data });
    }
    async populateMaterialTypeData() {
        const response = await fetch(settings.apiurl + '/MaterialTypes');
        const data = await response.json();
        this.setState({ materialTypes: data });
    }
    async populateGenderTypeData() {
        const response = await fetch(settings.apiurl + '/GenderTypes');
        const data = await response.json();
        this.setState({ genderTypes: data });
    }
    async populateStoneTypeData() {
        const response = await fetch(settings.apiurl + '/StoneTypes');
        const data = await response.json();
        this.setState({ stoneTypes: data });
    }
}
