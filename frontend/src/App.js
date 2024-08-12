import './App.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {

  document.title = "The Taco Truck Finder";

  const [showTruck, setShowTruck] = useState(false); // Whether to show the truck or not
  const [location, setLocation] = useState({latitude: null, longitude: null}); // The location
  const [error, setError] = useState(null); // Incase of error
  const [loading, setLoading] = useState(false); // Signal that we are loading
  const [nearestTruck, setNearest] = useState(null); // Nearest taco truck data

  // Stores the returned foor
  const [food, setFood] = useState(null);
  const [foodLoading, setFoodLoading] = useState(null);
  const [showFood, setShowFood] = useState(false);

  const [address, setAddress] = useState('');

  // Whether to show the truck
  const toggletruck = () => {
    setShowTruck(true);
  }
  
  // Display whether to show food
  const togglefood = () => {
    setShowFood(true);
  }

  // Gets the location of the user storing it into location var
  const getLocation = () => {
    console.log(address);
    console.log("Trying to get location");
    setLoading(true);
    setNearest(null);
    setFood(null);
    setError(null);
    setShowFood(false);

    setLocation({latitude:'tmp', longitude: 'tmp'}) // easier to handle then making https
    return;
    
    /* Need Https and don't want a Domain name */
    // Geolocation supported
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Location acquired:", position.coords.latitude, position.coords.longitude);
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setError(null);
        },
        (error) => {
          setLoading(false);
          toggletruck();
          setError(error.message);
        }
      );
    }
    else {
      console.log("Else fail")
      setError("Geolocation is not supported by this browser.");
    }
    console.log("Got location", location.latitude, location.longitude, error);
  };

  useEffect ( () => {
    console.log(error);
  }, [error])

  // Whenever location is updated to a valid value, find a new truck
  useEffect ( () => {
    if (location.longitude != null && location.latitude != null){
      setLoading(true);
      FindTruck(setNearest, setError, address);
    }
  }, [location]); 

  // Whenever truck is updated, dispaly the truck
  useEffect( () => {
    if (nearestTruck != null){
      toggletruck();
      setLoading(false);
    }
  }, [nearestTruck]);

  // whenever we want to show food to recommend, send request
  useEffect( () => {
    if (showFood){
      setFoodLoading(true);
      FindFood(setFood, setError, nearestTruck);
      setFoodLoading(false);
    }
  }, [showFood]);

  const handleSubmit = (event) => {
    event.preventDefault();
    getLocation();
  }

  // Actual design of the website
  return (
    <div className = "App">
      <div className="left-side"></div>
      <h1 className='header-style'> The Taco Truck Finder </h1>
      
      <form onSubmit={handleSubmit} className='form-style'>
      <label>Enter Your Address:
        <input
          className='form-style'
          type="text" 
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </label>
    </form>



      <button onClick={getLocation} className='button-style'>
         Find the Nearest Taco Truck!
      </button>
      <DisplayTruck data={nearestTruck} showTruck={showTruck} loading={loading} error={error}> </DisplayTruck>
      {showTruck && nearestTruck &&
        <> 
          <h1> Can't Decide What To Eat?</h1>
          {!showFood && 
            <button onClick={togglefood} className='button-style'>
              Click Me!
            </button>
          }
        </>}
      <DisplayFood food={food} loading={foodLoading}>  </DisplayFood>

      <div className="right-side"></div>
    </div>
  );
}

// Wrapper to request from out backend
const FindTruck = async(setData, setError, address) => {
  console.log("Trying to find truck")
  const backend_url = 'abc'; // Url for the backend
  setError(null);
  try {
    const response = await axios.get(backend_url + 'finder/', {
      params: {
        'address': address,
      }
    });
    setData(response.data);
  } catch(error) {
    setError(error)
    setData(false);
  }
  console.log("Sucesfully got response back");
}

const FindFood = async(setFood, setError) => {
  const backend_url = 'abc'; // Url for the backend
  setError(null);
  try{
    const response = await axios.get(backend_url + 'picker/');
    setFood(response.data);
  } catch(error) {
    setError(error);
  }
}

const formatLocation = (location) => {
  if (!location || !location.address1) {
    return "";
  }

  const { address1, address2, address3, city } = location;

  let locationString = `Located at: ${address1}`;
  if (address2) {
    locationString += `, ${address2}`;
  }
  if (address3) {
    locationString += `, ${address3}`;
  }
  if (city){
    locationString += `, ${city}`;
  }

  return locationString;
};

// Displays the truck information in data
function DisplayTruck ({data, loading, showTruck, error}){
  if (loading){
    return (<div> 
             <h2> Finding Truck... </h2> 
            </div>);
  }
  else if (showTruck && error == null){
    return (
      <div>
        <h2> The Nearest Taco Truck Is: {data.name} </h2>
        <h2> {formatLocation(data.location)}</h2>
        <div> 
          <a href={data.url} > Learn  More Here </a>
        </div>
        <p></p>
        <img 
          src={data.image_url} 
          className='image-style'
        />
      </div>
    );
  }
  else if (showTruck) {
    return (<div>
              <h1> Could Not Find Any Taco Trucks Near You </h1>
            </div>);
  }
  else{
    return null;
  }
  
}

function DisplayFood ({ food, loading }){
  if (loading){
    return (<div> Choosing Food ... </div>);
  }
  else if (food == null){
    return null;
  }
  return (
    <div>
      <h1> Try {food} </h1> 
    </div>
  );
}

export default App;
