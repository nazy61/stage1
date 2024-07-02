const { SuperfaceClient } = require("@superfaceai/one-sdk");

module.exports.user = async (req, res) => {
  const { visitor_name } = req.query;

  try {
    // Get the client's IP address
    let ipAddress = req.ip;

    // Get location data from IP address
    const sdk = new SuperfaceClient();
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
            apikey: "9a511b6fc8334e1852cfbbd4ff3f1af3c42ed6abc75e96a1648b969a",
          },
        },
      }
    );

    // Send a response with the visitor's name and location data
    res.send({
      client_ip: ipAddress,
      location: result.unwrap(),
      message: `Hello, ${visitor_name}!`,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      status: false,
      message: "An error occurred while fetching location data",
    });
  }
};
