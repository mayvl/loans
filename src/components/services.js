
const Services = {

  getAllUser: function (callback, callbackError) {
    fetch('https://wired-torus-98413.firebaseio.com/users.json')
      .then(response => response.json())
      .then(response => {
        callback(response);
      })
      .catch(error => {
        callbackError(error);
      });
  },

  getScoringStatus: function (userDNI, callback, callbackError) {
    fetch(`https://api.moni.com.ar/api/v4/scoring/pre-score/${userDNI}`, {
      method: 'GET',
      headers: new Headers({
        'credential': 'ZGpzOTAzaWZuc2Zpb25kZnNubm5u',
        'Content-type': 'application/json',
        'Origin': 'http://localhost:3000',
        'Host': 'api.moni.com.ar',
      }),
    })
      .then(response => response.json())
      .then(response => {
        callback(response)
      })
      .catch(err => {
        callbackError(err);
      });

  },

  saveNewUser: function (requestBody, callback, callbackError) {
    fetch(`https://wired-torus-98413.firebaseio.com/users.json`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })
      .then(response => response.json())
      .then(response => {
        callback(response);
      })
      .catch(err => {
        callbackError(err);
      });
  },

  editUserInformation: function (userId, requestBody, callback, callbackError) {
    fetch(`https://wired-torus-98413.firebaseio.com/users/${userId}.json`, {
      method: 'PATCH',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    }).then((response) => {
      callback(response);
    })
      .catch(err => {
        callbackError(err);
      })
  },

  deleteUser: function (userId, callback, callbackError) {
    fetch(`https://wired-torus-98413.firebaseio.com/users/${userId}.json`, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json'
      },
    })
      .then(response => {
        callback(response);
      })
      .catch(err => {
        callbackError(err);
      })
  }
}

export default Services;
