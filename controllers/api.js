const { SuperfaceClient } = require("@superfaceai/one-sdk");
const sdk = new SuperfaceClient();
const axios = require("axios");

module.exports.user = async (req, res) => {
  const { visitor_name } = req.query;

  try {
    // Get the client's IP address
    let ipAddress = req.ip;

    // Get Region
    const region = await getRegion(ipAddress);
    const weather = await getWeather(region);

    // Send a response with the visitor's name and location data
    res.send({
      client_ip: ipAddress,
      location: region.addressRegion,
      greeting: `Hello, ${visitor_name}!, the temperature is ${weather.current.temp_c} degrees Celcius in ${region.addressRegion}`,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: "An error occurred while fetching location data",
      error: error,
    });
  }
};

const getWeather = async (region) => {
  // Get weather data from region open weather map using axios
  const weather = await axios.get(
    `https://api.weatherapi.com/v1/current.json?key=${process.env.OPENWEATHER_API_KEY}&q=${region.addressRegion}&aqi=no`
  );

  return weather.data;
};

const getRegion = async (ipAddress) => {
  // Get location data from IP address
  const profile = await sdk.getProfile("address/ip-geolocation@1.0.1");

  // Use the profile
  const result = await profile.getUseCase("IpGeolocation").perform(
    {
      ipAddress: ipAddress,
    },
    {
      provider: "ipdata",
      security: {
        apikey: {
          apikey: process.env.IPDATA_API_KEY,
        },
      },
    }
  );

  return result.unwrap();
};
