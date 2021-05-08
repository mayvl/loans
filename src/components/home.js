import React from "react";
import { Link } from "react-router-dom"
import SimpleReactValidator from 'simple-react-validator';
import 'simple-react-validator/dist/locale/es';
import Services from './services';


export default class Home extends React.Component {

  constructor(props) {
    super(props);
    this.validator = new SimpleReactValidator({ locale: 'es' });
    this.state = {
      loading: false,
      showApprovedAlert: false,
      showRejectedAlert: false,
      showErrorAlert: false,
      firstName: '',
      lastName: '',
      genre: '',
      email: '',
      dni: '',
      loanStatus: '',
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
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(event) {
    const name = event.target.name
    this.setState({ [name]: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.validator.allValid()) {
      this.postData()
    } else {
      this.validator.showMessages();
      // rerender to show messages for the first time
      // you can use the autoForceUpdate option to do this automatically`
      this.forceUpdate();
    }
  }

  postData() {
    var userDNI = this.state.dni;
    this.setState({ loading: true });
    var callback = (response) => {
      var status = response.status;
      this.setState({ loanStatus: status });
      this.saveData()
    }
    var callbackError = (error) => {
      console.error(error);
    }
    //call api endpoint to get scoring of the user
    Services.getScoringStatus(userDNI, callback, callbackError);
  }

  saveData() {
    var requestBody = {
      name: this.state.name,
      last: this.state.last,
      genre: this.state.genre,
      email: this.state.email,
      dni: this.state.dni,
      loanStatus: this.state.loanStatus
    }

    var callback = (response) => {
      if (this.state.loanStatus === 'approve') {
        this.setState({
          showApprovedAlert: true,
          name: '',
          last: '',
          genre: '',
          email: '',
          dni: '',
          loanStatus: '',
        });
        this.setState({ loading: false });
      }else if(this.state.loanStatus === 'rejected'){
        this.setState({
          showRejectedAlert: true,
          name: '',
          last: '',
          genre: '',
          email: '',
          dni: '',
          loanStatus: '',
        });
        this.setState({ loading: false });
      }else{
        this.setState({
          showErrorAlert: true,
          name: '',
          last: '',
          genre: '',
          email: '',
          dni: '',
          loanStatus: '',
        });
        this.setState({ loading: false });
      }
    }

    var callbackError = (error) => {
      this.setState({
        showErrorAlert: true,
        name: '',
        last: '',
        genre: '',
        email: '',
        dni: '',
        loanStatus: '',
      })
      this.setState({ loading: false });

    }
    // call api endpoint to save new user
    Services.saveNewUser(requestBody, callback, callbackError);
  }


  render() {
    return (
      <div className="container mt-5 justify-content-center align-items-center">
        <div>
          {this.state.showApprovedAlert && <div className="alert alert-success alert-dismissible fade show" role="alert">
            <strong>Su prestamo ha sido aprobado!</strong>
            <button type="button" className="close btn" data-dismiss="alert" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>}

          {this.state.showRejectedAlert && <div className="alert alert-warning alert-dismissible fade show space-between" role="alert">
            <strong>Lo sentimos su solicitud fue rechazada</strong>
            <button type="button" className="close btn" data-dismiss="alert" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>}

          {this.state.showErrorAlert && <div className="alert alert-danger alert-dismissible fade show space-between" role="alert">
            <strong>Lo sentimos no pudimos procesar su solicitud. Intentelo mas tarde.</strong>
            <button type="button" className="close btn" data-dismiss="alert" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>}
        </div>
        <Link to="/list" className="btn btn-outline-secondary">Listado de peticiones</Link>
        <div className="card mx-auto " style={{ width: '50%' }}>
          <div className="card-header text-center">
            <h5>Solicitud de prestamo</h5>
          </div>
          <div className="card-body">
            <div className="login-wrap mx-sm-3 mb-2">
              <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                  <input className="form-control" name="name" type="text" placeholder="Ingrese su Nombre" value={this.state.name} onChange={this.handleChange} />
                  {this.validator.message('nombre', this.state.name, 'required', { className: 'text-danger' })}
                </div>
                <br></br>
                <div className="form-group">
                  <input className="form-control" name="last" type="text" placeholder="Ingrese su Apellido" value={this.state.last} onChange={this.handleChange} />
                  {this.validator.message('apellido', this.state.last, 'required', { className: 'text-danger' })}
                </div>
                <br></br>
                <div className="form-group mb-4">
                  <select name="genre" enable type="select" onChange={this.handleChange} className="form-select light">
                    <option value="">Género</option>
                    {this.state.optionsGenre.map((genre, index) =>
                      <option key={index} value={this.state.genre.name}>{genre.name}</option>
                    )}
                  </select>
                </div>
                <div className="form-group">
                  <input className="form-control" name="email" type="email" placeholder="Ingrese su email" value={this.state.email} onChange={this.handleChange} />
                  {this.validator.message('email', this.state.email, 'required|email', { className: 'text-danger' })}
                </div>
                <br></br>
                <div className="form-group">
                  <input className="form-control" name="dni" type="number" placeholder="Ingrese su dni" value={this.state.dni} onChange={this.handleChange} />
                  {this.validator.message('dni', this.state.dni, 'required|size:8', { className: 'text-danger' })}
                </div>

                <div className="text-center mt-4">
                  <button type="submit" className="btn btn-outline-secondary" disabled={this.state.loading}>Solicitar Prestamo</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    )

  }
}