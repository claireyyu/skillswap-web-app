import React, { useEffect, useState } from 'react';

const LocationIQ = () => {
  const [location, setLocation] = useState({ country: '', city: '', countryCode: '' });
  const [error, setError] = useState(null);
  const YOUR_API_KEY = "pk.8cbbe46f46b441df64ef49a28b42ae0b";

  function countryCodeToEmoji(countryCode) {
    return countryCode
      .toUpperCase()
      .replace(/./g, char => String.fromCodePoint(127397 + char.charCodeAt()));
  }

  useEffect(() => {
    const fetchGeolocation = () => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            fetchLocation(latitude, longitude);
          },
          (error) => setError(error.message)
        );
      } else {
        setError('Geolocation is not supported by this browser.');
      }
    };

    const fetchLocation = async (latitude, longitude) => {
      try {
        const response = await fetch(`https://us1.locationiq.com/v1/reverse.php?key=${YOUR_API_KEY}&lat=${latitude}&lon=${longitude}&format=json`);
        if (!response.ok) throw new Error('Failed to fetch location');
        const data = await response.json();
        const address = data.address;
        setLocation({
          country: address.country,
          city: address.city || address.town || address.village,
          countryCode: address.country_code.toUpperCase(),
        });
      } catch (error) {
        setError(error.message);
      }
    };

    fetchGeolocation();
  }, []);

  return (
    <div>
      {location.country && location.city ? (
        <p>
          <span role="img" aria-label={location.country}>
            {countryCodeToEmoji(location.countryCode)}
          </span>{' '}
          {location.city}, {location.country}
        </p>
      ) : (
        <p>{error ? error : 'Fetching location...'}</p>
      )}
    </div>
  );
};

export default LocationIQ;