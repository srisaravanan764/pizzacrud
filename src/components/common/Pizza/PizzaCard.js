import React, { Component } from 'react'
import Auth from '../../../utils/auth'
import {deleteProductAction} from '../../../actions/productsActions'
import { addToCartAction } from '../../../actions/cartActions'
import { withRouter, Link } from 'react-router-dom'
import { connect } from 'react-redux'

class PizzaCard extends Component {
  constructor (props) {
    super(props)
    this.state = {
      addOnionChk : false,
      addTomotoChk : false,
      addPeppersChk : false,
      addOlivesChk : false,
      addMushroomsChk : false
    };
    this.onDeleteButtonClick = this.onDeleteButtonClick.bind(this)
    this.toppingsCLick = this.toppingsCLick.bind(this)
  }

  onOrderButtonClick (e) {
    let subtotal = e.target.value;
    if (Auth.isUserAuthenticated()) {
      this.props.addToCart(this.props.id,subtotal);
      this.props.history.push('/cart')
    } else {
      this.props.history.push('/login')
    }
  }
  toppingsCLick(e){
    const addItem = e.target.name;
    const isChecked = e.target.checked;
    const state = this.state;
    state[addItem] = isChecked;
    this.setState(state);
  }
  onDeleteButtonClick (e) {
    this.props.deleteProduct(this.props.id)
  }

  render () {
    var subtotal = 0 ;
    if (this.state.addOnionChk) {
        subtotal += 2;
    } 
    if (this.state.addMushroomsChk) {
        subtotal += 3;
    } 
    if (this.state.addTomotoChk) {
      subtotal += 3;
    }
    if (this.state.addPeppersChk) {
      subtotal += 2;
    }
    if (this.state.addOlivesChk) {
      subtotal += 3;
    }   
    const { id, name, image, description, weight } = this.props
    localStorage.setItem("toppings",JSON.stringify({id : id, subtotal : subtotal}));
    let footer
    if (Auth.isUserAdmin()) {
      footer = (
        <div className='card-footer'>
          <small className='text-muted'>{weight} gr</small>
          <button onClick={this.onDeleteButtonClick} className='btn btn-danger float-right btn-sm'><i className='fa fa-trash' /></button>
          <Link to={`/admin/edit/${id}`} className='btn btn-warning float-right btn-sm'><i className='fa fa-edit' /></Link>
        </div>
      )
    } else {
      footer = (
        <div className='card-footer'>
        <small className='text-muted'>Onion  </small>
          <input name="addOnionChk" type="checkbox" value="4" checked={this.state.addOnionChk} onChange={this.toppingsCLick} />
        <small>Peppers   </small>
          <input name="addTomotoChk" type="checkbox" value="3" checked={this.state.addTomotoChk} onChange={this.toppingsCLick} />
        <small>Tomato  </small>
          <input name="addOlivesChk" type="checkbox" checked={this.state.addOlivesChk} onChange={this.toppingsCLick} />
        <small>Olives </small>
          <input name="addPeppersChk" type="checkbox" checked={this.state.addPeppersChk} onChange={this.toppingsCLick} />
        <small>Mushrooms </small>
          <input name="addMushroomsChk" type="checkbox" checked={this.state.addMushroomsChk} onChange={this.toppingsCLick} />
          <br />
          <small className='text-muted'>{weight} gr</small>
          <br />
          <small className='text-muted' name="subTotal" value={subtotal}>subTotal : {subtotal}</small>
          <Link to={`/details/${id}`} type='button' className='btn btn-primary float-right btn-sm'>Details</Link>
          <button type='button' className='btn btn-warning float-right btn-sm' value={subtotal} onClick={this.onOrderButtonClick.bind(this)}>Order</button>
        </div>
      )
    }

    return (
      <div className='card col-4'>
        <img className='card-img-top card-image' src={image} alt={name} />
        <div className='card-body'>
          <h5 className='card-title'>{name}</h5>
          <p className='card-text'>{description}</p>
        </div>
        {footer}
      </div>
    )
  }
}

function mapDispatchToProps (dispatch) {
  return {
    addToCart: (id, subtotal) => dispatch(addToCartAction(id, subtotal)),
    deleteProduct: (id) => dispatch(deleteProductAction(id))
  }
}

export default withRouter(connect(() => { return {} }, mapDispatchToProps)(PizzaCard))
