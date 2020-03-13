import React, {Component, useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import GoogleMapReact from 'google-map-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button,Row, Col, Container, Dropdown, DropdownButton, InputGroup } from 'react-bootstrap';
import {temp0, temp1, temp2, temp3} from './images'


class App extends Component{
	constructor(){
		super();
		this.state = {			
			data:{},
			temp:0,
			pressure:0,
			humidity:0,
			windSpeed:0,
			city:'',
			error:'',
			value:'',
			lang:''
		}
	}
  getValue = (value) => {
  this.setState({
    value
  },this.push);
}

 selectIt = (lang) => {
		this.setState({
			lang
		})
}
	push = () => {
				let API = `http://api.openweathermap.org/data/2.5/weather?q=${this.state.value}&APPID=74e25815c0ca1b67757ea32dfb274d84&units=metric`
		fetch(API)
			.then(res => {
				if(res.ok) return res
				throw this.setState({error: this.state.lang=='Eng'? 'I can\'t find this city!': 'Nie mogę znależź tego miasta!'})
			})
			.then(res => res.json())
			.then(data => this.setState({
				weather: data.weather[0].description,
				lon: data.coord.lon,
				lat: data.coord.lat,
				temp: data.main.temp,
				pressure: data.main.pressure,
				humidity: data.main.humidity,
				windSpeed: data.wind.speed,
				city: data.name,
				sunrise: new Date(data.sys.sunrise * 1000),
				sunset: new Date(data.sys.sunset * 1000),
				error:''
			}))
			this.setState({value:''})
	}
	

	componentDidMount(){
		console.log("mount it "+this.props.city)

			//.catch(err = > console.log(err))

	}
	render(){
		console.log(typeof(this.state.sunrise))
		return(
<div className={"inside"}>
	<Container>
		<FormC selectIt={this.selectIt} getValue={this.getValue}/>

	</Container>

		<p className={"warm"}>{this.state.error}</p>
			{this.state.city!=''? <div>
			<ShowWeather {...this.state}/>
			<ShowMap lon={this.state.lon} lat={this.state.lat} city={this.state.city}/></div>:null}
</div>

		)
	}
}

function FormC(props){
	const [value, setValue] = useState("");
	const [lang, setLang] = useState('Eng')

	function changeValue(e){
		setValue(e.target.value)
	}
	
	function select(e){
		setLang(e.target.innerText)
	}
useEffect(() => {
  props.selectIt(lang)
},[lang]);

	return(
		
<Row className="justify-content-md-center">
    <Col xs sm="7">
		<InputGroup>
			<DropdownButton variant="outline-secondary" title={lang}>
				<Dropdown.Item onClick={select}>Pl</Dropdown.Item>
				<Dropdown.Item onClick={select}>Eng</Dropdown.Item>
			</DropdownButton>
			<Form.Control style={{ width: '200px'}} type="text" placeholder={lang=='Eng'? "Type the city...": "Wpisz miasto..."} value={value} onChange={changeValue}/>
		</InputGroup>
    </Col>
    <Col xs sm="2">
		<Button onClick={props.getValue.bind(null, value)} variant="secondary">OK</Button>
    </Col>
</Row>
		
		)
	
}

function ShowWeather(props){
	const hours1 = props.sunrise.getHours();
	const minutes1 = "0" + props.sunrise.getMinutes();
	const hours2 = props.sunset.getHours();
	const minutes2 = "0" + props.sunset.getMinutes();
	const fulltime1 = hours1 +':'+ minutes1.substr(-2);
	const fulltime2 = hours2 +':'+ minutes2.substr(-2);
	
	const [Eng, useEng] = useState(['Temperature in ',' is: ','Sky:','Pressure:','Humidity:','Sunrise:','Sunset:']);
	const [Pl, usePl] = useState(['Temperatura w ',' wynosi: ','Niebo: ','Ciśnienie,','Wilgotność','Czas wschodu:','CZas zachodu']);
	let currentLang = props.lang
	
	return(
	currentLang=='Eng'?
<div>
	<p className={props.temp>5? "warm" : "cold"}>{Eng[0]}{props.city}{Eng[1]}<b>{props.temp} &#8451;</b></p>
	<img src={props.temp<=0? temp0 :props.temp<=5? temp1 :props.temp<=25? temp2 : temp3}/>
	<p><b>{Eng[2]}</b>  {props.weather}</p>
	<p><b>{Eng[3]}</b>  {props.pressure}</p>
	<p><b>{Eng[4]}</b>  {props.humidity}</p>
	<p><b>{Eng[5]}</b>  {fulltime1}</p>
	<p><b>{Eng[6]}</b>  {fulltime2}</p>
</div>
	:
	<div>
	<p className={props.temp>5? "warm" : "cold"}>{Pl[0]}{props.city}{Pl[1]}<b>{props.temp} &#8451;</b></p>
	<img src={props.temp<=0? temp0 :props.temp<=5? temp1 :props.temp<=25? temp2 : temp3}/>
	<p><b>{Pl[2]}</b>  {props.weather}</p>
	<p><b>{Pl[3]}</b>  {props.pressure}</p>
	<p><b>{Pl[4]}</b>  {props.humidity}</p>
	<p><b>{Pl[5]}</b>  {fulltime1}</p>
	<p><b>{Pl[6]}</b>  {fulltime2}</p>
</div>
	)
}

class ShowMap extends Component{
	constructor(props){
		super(props)
		this.state= {
			lat: props.lat,
			lng: props.lon,
			city: props.city
		}
	}

static getDerivedStateFromProps(nextProps, prevState) {
  return {
    lat: nextProps.lat,
		lng: nextProps.lon,
		city: nextProps.city,
  };
}
	render(){
		console.log("lng: "+this.state.lng)
		return(
			<div className="map">
					<GoogleMapReact
					center={{lat: this.state.lat, lng: this.state.lng}}
					defaultZoom={10}
					>
					<AnyReactComponent
					lat={this.state.lat}
					lng={this.state.lng}
					text= {this.state.city}
					/>
					</GoogleMapReact>
			</div>

		)
	}
}

const AnyReactComponent = ({ text }) => <div style={{
	color:'white',
	background: 'red',
	display: 'inline-flex',
	padding: '5px',
	borderRadius: '20px'


}}>{text}</div>;

export default App;
