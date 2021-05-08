import React from 'react'
import { Link } from "react-router-dom"
import SimpleReactValidator from 'simple-react-validator';
import 'simple-react-validator/dist/locale/es';
import Services from './services';


export default class List extends React.Component {
  constructor(props) {
    super(props);
    this.validator = new SimpleReactValidator({ locale: 'es' });
    this.state = {
      showModal: false,
      listItem: [],
      editItem: {},
      genre: "",
      optionsGenre: [{
        name: 'Femenino'
      },
      {
        name: 'Masculino'
      },
      {
        name: 'Prefiero no decir'
      }]
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleEditSubmit = this.handleEditSubmit.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
  }

  componentDidMount() {
    var callback = (response) => {
      if (response) {
        Object.entries(response).forEach(([key, value]) => {
          if (value.dni !== undefined) {
            value.id = key
            var joined = this.state.listItem.concat(value);
            this.setState({ listItem: joined })
          }
        })
      }
    }
    var callbackError = (error) => {
      console.error(error);
    }
    //call api endopoint to get all users information
    Services.getAllUser(callback, callbackError);
  }

  handleEditSubmit(event) {
    event.stopPropagation();
    event.preventDefault();
    if (this.validator.allValid()) {
      var userId = this.state.editItem.id
      var requestBody = {
        name: this.state.editItem.name,
        last: this.state.editItem.last,
        genre: this.state.editItem.genre,
        email: this.state.editItem.email,
        dni: this.state.editItem.dni,
        loanStatus: this.state.editItem.loanStatus
      }
      var callback = (response) => {
        if (response) {
          window.location.reload()
        } else {
          this.validator.showMessages();
          // rerender to show messages for the first time
          // you can use the autoForceUpdate option to do this automatically`
          this.forceUpdate();
        }
      }
      var callbackError = (error) => {
        console.log(error);
      }
    }
    //call api endpoint to save edited information
    Services.editUserInformation(userId, requestBody, callback, callbackError);
  }

  deleteItem(index, e) {
    var userId = this.state.listItem[index].id;
    var callback = (response) => {
      if (response) {
        window.location.reload(false)
      }
    }
    var callbackError = (error) => {
      console.log(error);
    }
    //calll api endpoint to delete user by id
    Services.deleteUser(userId, callback, callbackError)
  }

  updateEditModalData(index, e) {
    this.setState({
      editItem: this.state.listItem[index]
    })
  }

  handleChange(event) {
    const name = event.target.name
    this.setState({
      editItem: {
        ...this.state.editItem,
        [name]: event.target.value,
      },
    });
  }

  render() {
    const { listItem } = this.state
    return (
      <div>
        <div id="myModal" className="modal fade" role="dialog">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Editar</h4>
                <button type="button" className="close btn btn-lg" data-dismiss="modal">&times;</button>
              </div>
              <form onSubmit={this.handleEditSubmit} className="form-inline">
                <div className="modal-body">
                  <div className="login-wrap mx-sm-3 mb-2">
                    <div className="form-group mb-4">
                      <input className="form-control" name="name" type="text" placeholder="Ingrese su Nombre" value={this.state.editItem.name} onChange={this.handleChange} />
                      {this.validator.message('nombre', this.state.editItem.name, 'required', { className: 'text-danger' })}
                    </div>
                    <div className="form-group mb-4">
                      <input className="form-control" name="last" type="text" placeholder="Ingrese su Apellido" value={this.state.editItem.last} onChange={this.handleChange} />
                      {this.validator.message('apellido', this.state.editItem.last, 'required', { className: 'text-danger' })}
                    </div>
                    <div className="form-group mb-4">
                      <select name="genre" enable type="select" onChange={this.handleChange} className="form-select light">
                        <option value="" >Género</option>
                        {this.state.optionsGenre.map((genre, index) => {
                          return this.state.editItem.genre === genre.name ?
                            <option key={index} value={genre.name} selected>{genre.name}</option>
                            :
                            <option key={index} value={genre.name}>{genre.name}</option>
                        })}
                      </select>
                    </div>
                    <div className="form-group mb-4">
                      <input className="form-control" name="email" type="email" placeholder="Ingrese su email" value={this.state.editItem.email} onChange={this.handleChange} />
                      {this.validator.message('email', this.state.editItem.email, 'required|email', { className: 'text-danger' })}
                    </div>
                    <div className="form-group mb-4">
                      <input className="form-control" name="dni" type="number" min="0" placeholder="Ingrese su dni" value={this.state.editItem.dni} onChange={this.handleChange} />
                      {this.validator.message('dni', this.state.editItem.dni, 'required|size:8', { className: 'text-danger' })}
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-default">Editar</button>
                </div>
              </form>
            </div>

          </div>
        </div>

        <div className="container  mt-5 justify-content-center align-items-center">
          <Link to="/home" className="btn btn-outline-secondary">Solicitud de prestamos</Link>
          <div className="card  mx-auto " style={{ width: '60%' }}>
            <h5 className="card-header text-center" >Listado de peticiones</h5>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col" >Nombre y Apellido</th>
                      <th scope="col">Dni</th>
                      <th scope="col">E-mail</th>
                      <th scope="col" >Genero</th>
                      <th scope="col" >Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listItem.map((item, index) =>
                      <tr key={index}>
                        <td>{item.name} {item.last}</td>
                        <td>{item.dni}</td>
                        <td>{item.email}</td>
                        <td>{item.genre}</td>
                        <td> {item.loanStatus}</td>
                        <td>
                          <button title='Editar' type="button" className="btn btn-sm  btn-outline-info" data-toggle="modal" data-target="#myModal" onClick={(e) => this.updateEditModalData(index, e)} >
                            <i className="fa fa-pencil" aria-hidden="true"></i>
                          </button>
                        </td>
                        <td>
                          <button title='Borrar' className="btn btn-sm btn-outline-danger" onClick={(e) => this.deleteItem(index, e)}>
                            <i className="fa fa-trash" aria-hidden="true"></i>
                          </button>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

      </div>
    )
  }
}

