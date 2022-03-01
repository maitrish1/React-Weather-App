import './App.css';
import React, { Component } from 'react'
import Search from './components/Search';
import { type } from '@testing-library/user-event/dist/type';



export default class App extends Component {
  constructor(){
    super()
    this.state={
      currDate:"",
      cityName:"",
      currtemp:"",
      currDesc:"",
      weekDays:[],
      currentCondition:"",
      hours:[],
      currMax:"",
      currMin:"",
      uv:"",
      visibility:"",
      humidity:"",
      feelsLike:""
    }
    navigator.geolocation.getCurrentPosition((position)=>{
      const coords = position.coords;
            const lat = coords.latitude;
            const long = coords.longitude;
            // console.log(lat, long);
            this.fetchWeatherByLatLong(lat, long);
    })
  }
  

  fetchWeatherByLatLong=async(lat,long)=>{
    const res=await fetch(`https://eu1.locationiq.com/v1/reverse.php?key=pk.6e70b3d6826ddf016c55137a6409fa19&lat=$${lat}&lon=${long}&format=json`)
    const data= await res.json()
    console.log(data.address.state_district)
    this.setNewCityfromLatLong(data.address.state_district)
  }



  setNewCityfromLatLong=async(city)=>{
    const res=await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=AQCU5XN55DVKZM6KKZ3YWEYTQ&contentType=json`)
    const data= await res.json()
    
    console.log(data.days[0])
    
    this.setState({
      currtemp:data.currentConditions.temp,
      currDesc:data.description,
      weekDays:data.days,
      cityName:data.resolvedAddress,
      currentCondition:data.currentConditions.conditions,
      hours:data.days[0].hours,
      currMax:data.days[0].tempmax,
      currMin:data.days[0].tempmin,
      feelsLike:data.days[0].feelslike,
      uv:data.days[0].uvindex,
      visibility:data.days[0].visibility,
      humidity:data.days[0].humidity
    })
  }



  setNewCity=(newcityName)=>{
    this.setState({
      cityName:newcityName
    })
    this.getData(newcityName)
  }



   getData=async(newcityName)=>{
    const res=await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${newcityName}?unitGroup=metric&key=AQCU5XN55DVKZM6KKZ3YWEYTQ&contentType=json`)
    const data= await res.json()
    console.log(data)
    
    this.setState({
      currtemp:data.currentConditions.temp,
      currDesc:data.description,
      weekDays:data.days,
      cityName:data.resolvedAddress,
      currentCondition:data.currentConditions.conditions,
      hours:data.days[0].hours,
      currMax:data.days[0].tempmax,
      currMin:data.days[0].tempmin,
      feelsLike:data.days[0].feelslike,
      uv:data.days[0].uvindex,
      visibility:data.days[0].visibility,
      humidity:data.days[0].humidity
    })
    
  }

  
  dateTimeFunc=(newDate)=>{
    const parts=newDate.split('-')
    const myDate=new Date(parts[0], parts[1]-1, parts[2]).toDateString().substring(0,10)
    return myDate 
  }


  cropTime=(time)=>{
    const newTime=time.substring(0,5)
    return newTime
  }


  coverIcon=(time)=>{
    const newTime=Number(time.substring(0,2))
    
    if(newTime>=0 && newTime<=5){
      return "🌙"
    }
    else if(newTime>=17 && newTime<=23){
      return "🌙"
    }
    else if(newTime>=6 && newTime<=16){
      return "☀️"
    }
  }

  setIcon=(icon)=>{
    if(icon=='snow') return '❄️'
    else if(icon=='rain') return '☔'
    else if(icon=='fog') return '🌫️'
    else if(icon=='wind') return '💨'
    else if(icon=='cloudy') return '☁️'
    else if(icon=='partly-cloudy-day') return '⛅'
    else if(icon=='partly-cloudy-night') return '🌒'
    else if(icon=='clear-day') return '☀️'
    else if(icon=='clear-night') return '🌕'
  }


  setUv=(uv)=>{
    if(uv<=2) return "UV Index is Low. Enjoy Outdoors!"
    else if(uv>2 && uv<=5) return "UV Index is Moderate. Cover Up and Enjoy Outdoors!"
    else if(uv>5 && uv<=7) return "UV Index is High. Remember to Cover yourself up!"
    else if(uv>7 && uv<=9) return "UV Index is very High. Prolonged time outdoors might cause sunburns."
    else if(uv>9) return "UV Index Is Extremely High. Don't go out unless absolutely necessary."
  }

  render() {
    return (
      <div className='App-parent'>
        <Search onCityNameChanged={this.setNewCity} />
        <div className='App'>
        
          <div className='App-child-one'>
            <h1>{this.state.cityName? this.state.cityName: 'Weather App ⛅'} </h1>
            <h1>{this.state.currtemp?Math.ceil(this.state.currtemp)+"°C":''}</h1>
            <h2>{this.state.currMax?Math.ceil(this.state.currMax)+"°C"+'/'+Math.floor(this.state.currMin) +"°C":''}</h2>
            <h2>{this.state.currentCondition} </h2>
          </div>

          <div className='App-child-two'>
            <h1>{this.state.feelsLike?"Feels Like "+this.state.feelsLike+"°C":''}</h1>
            <h2>{this.state.uv?this.setUv(this.state.uv):""} </h2>
            <h2>{this.state.humidity?this.state.humidity+"% Humidity": ''} </h2>
          </div>
          
        </div>
        
        <h4>{this.state.cityName? 'Hourly Weather Forecast': ''}</h4>

        <div className='hour'> 
          {this.state.hours.map((hour)=>(
          <div className='hour-div'>
            <p>{this.cropTime(hour.datetime)}</p>
            <p id="cover-icon">{this.coverIcon(hour.datetime)}</p>
            <p>{Math.ceil(hour.temp)}°C</p>
            <p>{hour.conditions}</p>
          </div>
          ))}
        </div>

        <h4>{this.state.cityName? '14-Day Weather Forecast': ''}</h4>

        <div className='weekday'> 
          {this.state.weekDays.map((weekday)=>(
          <div className='weekday-div'>
            <p id="icon">{this.setIcon(weekday.icon)}</p>
            <p>{this.dateTimeFunc(weekday.datetime)}</p>
            <p>{Math.ceil(weekday.tempmax)}°C/{Math.floor(weekday.tempmin)}°C</p>
            <p> {weekday.conditions}</p>

          </div>
          ))}
        </div>

      </div>
      
    )
  }
}
