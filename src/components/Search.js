import React, { Component } from 'react'

export default class Search extends Component {
    constructor(props){
        super(props)
        this.state={
            cityName: "",
        }
    }

    handleChange=(e)=>{
      e.preventDefault()
      let newCityName=e.target.value
      this.setState({
        cityName:newCityName
      })
    }
    

    searchCity=(e)=>{
      this.props.onCityNameChanged(this.state.cityName)
      e.preventDefault()
    }


  render() {
    return (
      <div>
          <form action="#" onSubmit={this.searchCity}>
              <input type="text" placeholder='Enter city' value={this.state.cityName} onChange={this.handleChange} />
              <input type="submit" value='Search'/>
          </form>
          
      </div>
    )
  }
}
